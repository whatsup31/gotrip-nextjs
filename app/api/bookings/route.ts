import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase-server'

type Svc = { service_id: number; quantity: number }

export async function POST(req: Request) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok:false, errors:[{message:'Unauthorized'}] }, { status: 401 })

  const ctype = req.headers.get('content-type') || ''
  let body: any

  if (ctype.includes('application/json')) {
    body = await req.json().catch(() => ({}))
  } else {
    const f = await req.formData()
    body = {
      listing_id: Number(f.get('listing_id') || 0),
      start_date: String(f.get('start_date') || ''),
      end_date: String(f.get('end_date') || ''),
      // pour formData on peut ignorer services pour le POC
      services: [] as Svc[],
    }
  }

  const { listing_id, start_date, end_date } = body as { listing_id:number; start_date:string; end_date:string }
  const services: Svc[] = Array.isArray(body.services) ? body.services : []

  if (!listing_id || !start_date || !end_date) {
    return NextResponse.json({ ok:false, errors:[{message:'Missing fields'}] }, { status: 422 })
  }

  // calcul naïf des nuits
  const sd = new Date(start_date + 'T00:00:00Z')
  const ed = new Date(end_date + 'T00:00:00Z')
  const diffMs = ed.getTime() - sd.getTime()
  const nights = Math.max(1, Math.ceil(diffMs / (1000*60*60*24)))

  // prix du listing
  const { data: listing, error: lerr } = await supabase
    .from('listings')
    .select('id, price_per_night')
    .eq('id', listing_id)
    .single()
  if (lerr || !listing) {
    return NextResponse.json({ ok:false, errors:[{message:'Listing not found'}] }, { status: 404 })
  }

  let total = nights * Number(listing.price_per_night)

  // récupérer le prix unitaire des services inclus (si fournis en JSON)
  let bsRows: { service_id:number; quantity:number; unit_price:number }[] = []
  if (services.length) {
    const ids = services.map(s => s.service_id)
    const { data: svcRows, error: serr } = await supabase
      .from('services').select('id, price').in('id', ids)
    if (serr) return NextResponse.json({ ok:false, errors:[{message:serr.message}] }, { status: 400 })

    bsRows = services.map(s => {
      const m = svcRows?.find(r => r.id === s.service_id)
      const unit = Number(m?.price ?? 0)
      total += unit * (s.quantity || 1)
      return { service_id: s.service_id, quantity: s.quantity || 1, unit_price: unit }
    })
  }

  // 1) créer le booking (RLS: user_id = auth.uid())
  const { data: booking, error: berr } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      listing_id,
      start_date,
      end_date,
      nights,
      total_price: total,
      status: 'created',
    })
    .select('id')
    .single()

  if (berr || !booking) {
    return NextResponse.json({ ok:false, errors:[{message: berr?.message || 'Create booking failed'}] }, { status: 400 })
  }

  // 2) insérer les services attachés (si présents)
  if (bsRows.length) {
    const { error: bserr } = await supabase.from('booking_services')
      .insert(bsRows.map(r => ({ booking_id: booking.id, ...r })))
    if (bserr) {
      // NB POC: pas de transaction ; on laisse le booking créé même si l’insert services échoue
      return NextResponse.json({ ok:false, errors:[{message: bserr.message }] }, { status: 400 })
    }
  }

  if (!ctype.includes('application/json')) {
    return NextResponse.redirect(new URL('/trips', req.url), { status: 303 })
  }
  return NextResponse.json({ ok:true, data:{ id: booking.id, total_price: total, nights } }, { status: 201 })
}
