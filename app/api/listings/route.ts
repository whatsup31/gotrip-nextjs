import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase-server'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok:false, errors:[{message:'Unauthorized'}]}, { status: 401 })

  let payload: any
  const ctype = req.headers.get('content-type') || ''
  if (ctype.includes('application/json')) {
    payload = await req.json().catch(() => ({}))
  } else {
    const f = await req.formData()
    payload = {
      title: String(f.get('title') || ''),
      location: String(f.get('location') || ''),
      description: String(f.get('description') || ''),
      price_per_night: Number(f.get('price_per_night') || 0),
      photos: [],
      amenities: [],
    }
  }

  const { title, location, description, price_per_night, photos = [], amenities = [] } = payload
  if (!title || !location || !price_per_night) {
    return NextResponse.json({ ok:false, errors:[{message:'Missing fields'}]}, { status: 422 })
  }

  const { data, error } = await supabase
    .from('listings')
    .insert({ host_id: user.id, title, location, description, price_per_night, photos, amenities })
    .select('*')
    .single()

  if (error) return NextResponse.json({ ok:false, errors:[{message:error.message}]}, { status: 400 })
  // si form post → redirect; si fetch json → renvoyer json
  if (!ctype.includes('application/json')) {
    return NextResponse.redirect(new URL('/host/listings', req.url), { status: 303 })
  }
  return NextResponse.json({ ok:true, data }, { status: 201 })
}
