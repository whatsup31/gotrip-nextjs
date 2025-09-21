// lib/serviceFormBridge.ts
export type ServicePayload = {
  title: string
  category: string
  price: number
  description?: string
  duration_min?: number
  area?: string
}

const selectors = {
  title: [
    'input[name="title"]',
    '#service-title',
    'input[placeholder*="Titre"]',
  ],
  category: [
    'input[name="category"]',
    '#service-category',
    'input[placeholder*="Catég"]',
  ],
  price: [
    'input[name="price"]',
    '#service-price',
    'input[type="number"]',
    'input[placeholder="17.90"]',
  ],
  description: [
    'textarea[name="description"]',
    '#service-description',
    'textarea[placeholder*="Décrivez"]',
  ],
  duration_min: [
    'input[name="duration_min"]',
    '#service-duration',
    'input[placeholder="30"]',
  ],
  area: [
    'input[name="area"]',
    '#service-area',
    'input[placeholder*="Zone"]',
  ],
}

function pick(doc: Document, list: string[]) {
  for (const sel of list) {
    const el = doc.querySelector<HTMLInputElement | HTMLTextAreaElement>(sel)
    if (el && typeof el.value === 'string' && el.value.trim() !== '') return el.value.trim()
  }
  return undefined
}

function toNumber(v?: string) {
  if (!v) return undefined
  const n = Number(v.replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

export function collectServicePayload(doc: Document): ServicePayload {
  const title = pick(doc, selectors.title)
  const category = pick(doc, selectors.category)
  const price = toNumber(pick(doc, selectors.price))
  if (!title) throw new Error('Le champ “Titre” est requis.')
  //if (!category) throw new Error('Le champ “Catégorie” est requis.')
  //if (price == null) throw new Error('Le champ “Prix” est requis et doit être un nombre.')

  const description = pick(doc, selectors.description)
  const duration_min = toNumber(pick(doc, selectors.duration_min))
  const area = pick(doc, selectors.area)

  return { title, category, price, description, duration_min, area }
}
