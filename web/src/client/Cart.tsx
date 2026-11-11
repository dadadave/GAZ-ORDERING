import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bottle, Icon, TopBar } from '../components/ui'
import { DELIVERY_FEE, PAYMENT_LABEL, fcfa, lineTotal, product, type PaymentMethod } from '../data/mock'
import { useStore } from '../data/store'

export function Cart() {
  const nav = useNavigate()
  const { cart, setQty, addresses, placeOrder } = useStore()
  const [addr, setAddr] = useState(addresses[0].id)
  const [slot, setSlot] = useState<'asap' | 'later'>('asap')
  const [pay, setPay] = useState<PaymentMethod>('momo')
  const sub = cart.reduce((s, l) => s + lineTotal(l), 0)

  if (!cart.length)
    return (
      <div className="screen with-nav">
        <TopBar title="Panier" back={false} />
        <div className="empty">
          <Icon name="cart" size={48} />
          <h3>Votre panier est vide</h3>
          <Link to="/accueil" className="btn btn-primary">Voir les bouteilles</Link>
        </div>
      </div>
    )

  return (
    <div className="screen">
      <TopBar title="Panier" />
      <div className="pad split cart-split">
      <div className="stack">
        {cart.map((l, i) => {
          const p = product(l.productId)
          return (
            <div key={i} className="card line">
              <div className="line-img" style={{ background: p.color + '14' }}><Bottle color={p.color} size={p.size} height={58} /></div>
              <div className="grow">
                <b>{p.brand} {String(p.size).replace('.', ',')} kg</b>
                <small className="muted">{l.kind === 'recharge' ? `Recharge · vide ${l.emptyBrand}` : 'Première bouteille + consigne'}</small>
                <span className="price">{fcfa(lineTotal(l))}</span>
              </div>
              <div className="stepper sm">
                <button onClick={() => setQty(i, l.qty - 1)} aria-label="Moins"><Icon name="minus" size={16} /></button>
                <b>{l.qty}</b>
                <button onClick={() => setQty(i, l.qty + 1)} aria-label="Plus"><Icon name="plus" size={16} /></button>
              </div>
            </div>
          )
        })}

        <h4>Adresse de livraison</h4>
        {addresses.map((a) => (
          <label key={a.id} className={'card option' + (addr === a.id ? ' on' : '')}>
            <input type="radio" name="addr" checked={addr === a.id} onChange={() => setAddr(a.id)} />
            <Icon name="pin" />
            <div className="grow"><b>{a.label}</b><small className="muted">{a.landmark}</small></div>
          </label>
        ))}

        <h4>Créneau</h4>
        <div className="seg">
          <button className={slot === 'asap' ? 'on' : ''} onClick={() => setSlot('asap')}><b>Dès que possible</b><small>≈ 35–50 min</small></button>
          <button className={slot === 'later' ? 'on' : ''} onClick={() => setSlot('later')}><b>Choisir l’heure</b><small>Aujourd’hui ou demain</small></button>
        </div>
        {slot === 'later' && <input className="input" type="datetime-local" />}

        <h4>Paiement</h4>
        {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((m) => (
          <label key={m} className={'card option' + (pay === m ? ' on' : '')}>
            <input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} />
            <span className={`pay-logo pay-${m}`}>{m === 'momo' ? 'MoMo' : m === 'om' ? 'OM' : 'XAF'}</span>
            <b className="grow">{PAYMENT_LABEL[m]}</b>
          </label>
        ))}
      </div>

      <aside className="summary stack">
        <div className="card totals">
          <h3 className="hide-sm">Récapitulatif</h3>
          <div className="row-between"><span>Sous-total</span><span>{fcfa(sub)}</span></div>
          <div className="row-between"><span>Livraison</span><span>{fcfa(DELIVERY_FEE)}</span></div>
          <div className="row-between total"><b>Total</b><b>{fcfa(sub + DELIVERY_FEE)}</b></div>
        </div>
      <div className="sticky-cta">
        <button className="btn btn-primary btn-lg" onClick={() => {
          const o = placeOrder(addresses.find((a) => a.id === addr)!, pay)
          nav(`/suivi/${o.id}`, { replace: true })
        }}>
          {pay === 'cash' ? 'Commander' : 'Payer et commander'} · {fcfa(sub + DELIVERY_FEE)}
        </button>
      </div>
      </aside>
      </div>
    </div>
  )
}
