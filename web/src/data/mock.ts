// Données fictives pour le prototype (prix indicatifs, à remplacer par Supabase).

export type Product = {
  id: string
  brand: string
  size: number // kg
  price: number // recharge, XAF
  deposit: number // consigne première bouteille, XAF
  color: string
  stock: number
}

export const PRODUCTS: Product[] = [
  { id: 'tradex-12', brand: 'Tradex', size: 12.5, price: 6500, deposit: 16000, color: '#1E5AA8', stock: 42 },
  { id: 'total-12', brand: 'TotalEnergies', size: 12.5, price: 6500, deposit: 16500, color: '#E3262F', stock: 18 },
  { id: 'camgaz-12', brand: 'Camgaz', size: 12.5, price: 6500, deposit: 15500, color: '#1F9D55', stock: 0 },
  { id: 'tradex-6', brand: 'Tradex', size: 6, price: 3300, deposit: 11000, color: '#1E5AA8', stock: 25 },
  { id: 'total-6', brand: 'TotalEnergies', size: 6, price: 3300, deposit: 11500, color: '#E3262F', stock: 9 },
  { id: 'tradex-50', brand: 'Tradex', size: 50, price: 26000, deposit: 45000, color: '#1E5AA8', stock: 4 },
]

export const BRANDS = ['Tradex', 'TotalEnergies', 'Camgaz', 'MRS', 'Bocom', 'Autre']

export type Address = { id: string; label: string; quarter: string; landmark: string; phone: string }

export const ADDRESSES: Address[] = [
  { id: 'a1', label: 'Maison', quarter: 'Bastos, Yaoundé', landmark: 'Derrière la station Tradex, portail bleu', phone: '+237 6 77 12 34 56' },
  { id: 'a2', label: 'Boutique', quarter: 'Mvog-Mbi, Yaoundé', landmark: 'Face au marché, 2e boutique à gauche', phone: '+237 6 99 87 65 43' },
]

export const DELIVERY_FEE = 500
export const EMERGENCY_NUMBER = '+237 222 00 00 00'

export type PaymentMethod = 'momo' | 'om' | 'cash'
export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  momo: 'MTN MoMo',
  om: 'Orange Money',
  cash: 'Espèces à la livraison',
}

export type OrderStatus =
  | 'recue'
  | 'confirmee'
  | 'attribuee'
  | 'preparation'
  | 'en_route'
  | 'livree'
  | 'annulee'
  | 'echouee'

export const STATUS_LABEL: Record<OrderStatus, string> = {
  recue: 'Reçue',
  confirmee: 'Confirmée',
  attribuee: 'Attribuée',
  preparation: 'En préparation',
  en_route: 'En route',
  livree: 'Livrée',
  annulee: 'Annulée',
  echouee: 'Échouée',
}

export const STATUS_FLOW: OrderStatus[] = ['recue', 'confirmee', 'attribuee', 'preparation', 'en_route', 'livree']

export type CartLine = { productId: string; qty: number; kind: 'recharge' | 'consigne'; emptyBrand?: string }

export type Order = {
  id: string
  createdAt: number
  customer: string
  phone: string
  address: Address
  lines: CartLine[]
  payment: PaymentMethod
  deliveryFee: number
  status: OrderStatus
  code: string
  driver?: string
  outlet: string
}

export const DRIVERS = [
  { id: 'd1', name: 'Paul Mbarga', phone: '+237 6 70 11 22 33', online: true },
  { id: 'd2', name: 'Aïcha Bello', phone: '+237 6 90 44 55 66', online: true },
  { id: 'd3', name: 'Serge Ndi', phone: '+237 6 55 77 88 99', online: false },
]

export const OUTLETS = [
  { id: 'pv1', name: 'Dépôt Bastos', status: 'Ouvert' },
  { id: 'pv2', name: 'Dépôt Mvog-Mbi', status: 'Ouvert' },
  { id: 'pv3', name: 'Point Essos', status: 'Rupture' },
]

export const product = (id: string) => PRODUCTS.find((p) => p.id === id)!

export const lineTotal = (l: CartLine) => {
  const p = product(l.productId)
  return (p.price + (l.kind === 'consigne' ? p.deposit : 0)) * l.qty
}

export const orderTotal = (o: { lines: CartLine[]; deliveryFee: number }) =>
  o.lines.reduce((s, l) => s + lineTotal(l), 0) + o.deliveryFee

export const fcfa = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const now = Date.now()
const min = 60_000

export const SEED_ORDERS: Order[] = [
  {
    id: 'GX-1042', createdAt: now - 18 * min, customer: 'Mme Ngono', phone: '+237 6 77 00 11 22',
    address: { id: 'x', label: 'Maison', quarter: 'Nlongkak', landmark: 'Près de la pharmacie', phone: '' },
    lines: [{ productId: 'tradex-12', qty: 1, kind: 'recharge', emptyBrand: 'Tradex' }],
    payment: 'momo', deliveryFee: 500, status: 'en_route', code: '4821', driver: 'Paul Mbarga', outlet: 'Dépôt Bastos',
  },
  {
    id: 'GX-1043', createdAt: now - 52 * min, customer: 'Restaurant Le Biniou', phone: '+237 6 99 33 44 55',
    address: { id: 'y', label: 'Restaurant', quarter: 'Omnisport', landmark: 'Carrefour Mobil', phone: '' },
    lines: [{ productId: 'total-12', qty: 3, kind: 'recharge', emptyBrand: 'TotalEnergies' }],
    payment: 'cash', deliveryFee: 1000, status: 'attribuee', code: '1190', driver: 'Aïcha Bello', outlet: 'Dépôt Mvog-Mbi',
  },
  {
    id: 'GX-1044', createdAt: now - 4 * min, customer: 'M. Fotso', phone: '+237 6 55 66 77 88',
    address: { id: 'z', label: 'Maison', quarter: 'Essos', landmark: 'Rue de l’école publique', phone: '' },
    lines: [{ productId: 'tradex-6', qty: 1, kind: 'consigne' }],
    payment: 'om', deliveryFee: 500, status: 'recue', code: '7305', outlet: 'Dépôt Mvog-Mbi',
  },
  {
    id: 'GX-1039', createdAt: now - 3 * 60 * min, customer: 'Mme Ngono', phone: '+237 6 77 00 11 22',
    address: ADDRESSES[0],
    lines: [{ productId: 'tradex-12', qty: 1, kind: 'recharge', emptyBrand: 'Tradex' }],
    payment: 'cash', deliveryFee: 500, status: 'livree', code: '5512', driver: 'Paul Mbarga', outlet: 'Dépôt Bastos',
  },
]
