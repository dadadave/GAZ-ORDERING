import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  ADDRESSES, DELIVERY_FEE, SEED_ORDERS,
  type Address, type CartLine, type Order, type OrderStatus, type PaymentMethod,
} from './mock'

type Store = {
  cart: CartLine[]
  addToCart: (l: CartLine) => void
  setQty: (i: number, qty: number) => void
  clearCart: () => void
  addresses: Address[]
  addAddress: (a: Address) => void
  orders: Order[]
  placeOrder: (address: Address, payment: PaymentMethod) => Order
  setStatus: (id: string, s: OrderStatus, patch?: Partial<Order>) => void
  online: boolean
  setOnline: (v: boolean) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([])
  const [addresses, setAddresses] = useState<Address[]>(ADDRESSES)
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const [online, setOnline] = useState(true)

  const addToCart = (l: CartLine) =>
    setCart((c) => {
      const i = c.findIndex((x) => x.productId === l.productId && x.kind === l.kind)
      if (i < 0) return [...c, l]
      const next = [...c]
      next[i] = { ...next[i], qty: next[i].qty + l.qty }
      return next
    })

  const setQty = (i: number, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((_, j) => j !== i) : c.map((l, j) => (j === i ? { ...l, qty } : l))))

  const placeOrder = (address: Address, payment: PaymentMethod) => {
    const o: Order = {
      id: 'GX-' + (1045 + orders.length),
      createdAt: Date.now(),
      customer: 'Vous',
      phone: address.phone,
      address,
      lines: cart,
      payment,
      deliveryFee: DELIVERY_FEE,
      status: 'confirmee',
      code: String(Math.floor(1000 + Math.random() * 9000)),
      outlet: 'Dépôt Bastos',
    }
    setOrders((os) => [o, ...os])
    setCart([])
    return o
  }

  const setStatus = (id: string, s: OrderStatus, patch: Partial<Order> = {}) =>
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, ...patch, status: s } : o)))

  return (
    <Ctx.Provider
      value={{
        cart, addToCart, setQty, clearCart: () => setCart([]),
        addresses, addAddress: (a) => setAddresses((x) => [...x, a]),
        orders, placeOrder, setStatus, online, setOnline,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useStore = () => {
  const s = useContext(Ctx)
  if (!s) throw new Error('StoreProvider manquant')
  return s
}
