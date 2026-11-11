import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bottle, Icon, TopBar } from '../components/ui'
import { BRANDS, fcfa, product } from '../data/mock'
import { useStore } from '../data/store'

export function Product() {
  const { id = '' } = useParams()
  const p = product(id)
  const nav = useNavigate()
  const { addToCart } = useStore()
  const [kind, setKind] = useState<'recharge' | 'consigne'>('recharge')
  const [empty, setEmpty] = useState(p.brand)
  const [qty, setQty] = useState(1)
  const unit = p.price + (kind === 'consigne' ? p.deposit : 0)

  return (
    <div className="screen">
      <TopBar title="Détails" />
      <div className="product-hero" style={{ background: p.color + '18' }}>
        <Bottle color={p.color} size={p.size} height={190} />
      </div>
      <div className="pad stack sheet">
        <div className="row-between">
          <div>
            <h2>{p.brand} {String(p.size).replace('.', ',')} kg</h2>
            <small className="muted">{p.stock ? `${p.stock} en stock · Dépôt Bastos` : 'Rupture au point de vente le plus proche'}</small>
          </div>
          <span className="price big">{fcfa(unit)}</span>
        </div>

        <h4>Type d’achat</h4>
        <div className="seg">
          <button className={kind === 'recharge' ? 'on' : ''} onClick={() => setKind('recharge')}>
            <b>Recharge</b><small>J’échange ma bouteille vide</small>
          </button>
          <button className={kind === 'consigne' ? 'on' : ''} onClick={() => setKind('consigne')}>
            <b>Première bouteille</b><small>+ consigne {fcfa(p.deposit)}</small>
          </button>
        </div>

        {kind === 'recharge' && (
          <>
            <h4>Marque de la bouteille vide rendue</h4>
            <div className="chips wrap">
              {BRANDS.map((b) => (
                <button key={b} className={'chip' + (empty === b ? ' on' : '')} onClick={() => setEmpty(b)}>{b}</button>
              ))}
            </div>
          </>
        )}

        <div className="row-between qty-row">
          <h4>Quantité</h4>
          <div className="stepper">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Moins"><Icon name="minus" size={18} /></button>
            <b>{qty}</b>
            <button onClick={() => setQty(qty + 1)} aria-label="Plus"><Icon name="plus" size={18} /></button>
          </div>
        </div>
      </div>
      <div className="sticky-cta">
        <button className="btn btn-primary btn-lg" disabled={!p.stock} onClick={() => {
          addToCart({ productId: p.id, qty, kind, emptyBrand: kind === 'recharge' ? empty : undefined })
          nav('/panier')
        }}>
          Ajouter au panier · {fcfa(unit * qty)}
        </button>
      </div>
    </div>
  )
}
