import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bottle, Icon } from '../components/ui'
import { PRODUCTS, fcfa } from '../data/mock'
import { useStore } from '../data/store'

const SIZES = [
  { v: 0, l: 'Tout' },
  { v: 6, l: '6 kg' },
  { v: 12.5, l: '12,5 kg' },
  { v: 50, l: '50 kg' },
]

export function Home() {
  const nav = useNavigate()
  const { addresses, addToCart, orders } = useStore()
  const [size, setSize] = useState(0)
  const [q, setQ] = useState('')
  const active = orders.find((o) => o.customer === 'Vous' && !['livree', 'annulee', 'echouee'].includes(o.status))
  const list = PRODUCTS.filter((p) => (!size || p.size === size) && p.brand.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="screen with-nav">
      <header className="home-head">
        <div>
          <small className="muted">Livrer à</small>
          <Link to="/adresses" className="loc"><Icon name="pin" size={16} /> {addresses[0].label} · {addresses[0].quarter} ▾</Link>
        </div>
        <Link to="/urgence" className="sos" aria-label="Urgence fuite de gaz"><Icon name="alert" size={20} /></Link>
      </header>

      <div className="pad stack">
        <div className="search">
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une marque…" />
        </div>

        {active ? (
          <Link to={`/suivi/${active.id}`} className="promo live">
            <div>
              <small>Commande {active.id}</small>
              <b>Votre livreur arrive</b>
              <span>Suivre en direct →</span>
            </div>
            <Icon name="truck" size={44} />
          </Link>
        ) : (
          <div className="promo">
            <div>
              <small>Livraison express</small>
              <b>Votre bouteille en moins d’1 heure</b>
              <button className="btn btn-light btn-sm" onClick={() => nav('/produit/tradex-12')}>Commander une 12,5 kg</button>
            </div>
            <Bottle color="#fff" height={110} />
          </div>
        )}

        <div className="chips">
          {SIZES.map((s) => (
            <button key={s.v} className={'chip' + (size === s.v ? ' on' : '')} onClick={() => setSize(s.v)}>{s.l}</button>
          ))}
        </div>

        <div className="section-head"><h3>Bouteilles disponibles</h3><small className="muted">Dépôt Bastos · 1,2 km</small></div>

        <div className="grid">
          {list.map((p) => (
            <article key={p.id} className={'card product' + (p.stock ? '' : ' out')}>
              <Link to={`/produit/${p.id}`} className="product-img" style={{ background: p.color + '14' }}>
                <Bottle color={p.color} size={p.size} height={92} />
                {!p.stock && <span className="tag">Rupture</span>}
              </Link>
              <div className="product-info">
                <b>{p.brand}</b>
                <small className="muted">{String(p.size).replace('.', ',')} kg · recharge</small>
                <div className="row-between">
                  <span className="price">{fcfa(p.price)}</span>
                  <button className="add" disabled={!p.stock} aria-label="Ajouter au panier"
                    onClick={() => addToCart({ productId: p.id, qty: 1, kind: 'recharge', emptyBrand: p.brand })}>
                    <Icon name="plus" size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
