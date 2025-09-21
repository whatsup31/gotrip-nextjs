// app/api/services/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase-server'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok:false, errors:[{message:'Unauthorized'}] }, { status: 401 })

  const ctype = req.headers.get('content-type') || ''
  let payload: any

  if (ctype.includes('application/json')) {
    payload = await req.json().catch(() => ({}))
  } else {
    const f = await req.formData()
    payload = {
      title: String(f.get('title') || ''),
      category: String(f.get('category') || ''),
      description: String(f.get('description') || ''),
      price: Number(f.get('price') || 0),
      duration_min: Number(f.get('duration_min') || 0),
      area: String(f.get('area') || ''),
    }
  }

  const { title, category, description, price, duration_min, area } = payload
  if (!title || !category || !price) {
    return NextResponse.json({ ok:false, errors:[{message:'Missing required fields'}] }, { status: 422 })
  }

  const { error } = await supabase.from('services').insert({
    provider_id: user.id,
    title, category, description, price, duration_min, area
  })

  if (error) return NextResponse.json({ ok:false, errors:[{message:error.message}] }, { status: 400 })

  // redirect pour les <form>, JSON pour les fetch
  if (!ctype.includes('application/json')) {
    return NextResponse.redirect(new URL('/provider/services', req.url), { status: 303 })
  }
  return NextResponse.json({ ok:true }, { status: 201 })
}
