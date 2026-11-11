import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bottle, Icon, StatusPill, TopBar } from '../components/ui'
import { EMERGENCY_NUMBER, STATUS_LABEL, fcfa, orderTotal, product } from '../data/mock'
import { useStore } from '../data/store'

export function Orders() {
  const nav = useNavigate()
  const { orders, addToCart } = useStore()
  const mine = orders.filter((o) => o.customer === 'Vous' || o.customer === 'Mme Ngono')
  return (
    <div className="screen with-nav">
      <TopBar title="Mes commandes" back={false} />
      <div className="pad orders-grid">
        {mine.map((o) => {
          const p = product(o.lines[0].productId)
          return (
            <div key={o.id} className="card order">
              <Link to={`/suivi/${o.id}`} className="order-main">
                <div className="line-img" style={{ background: p.color + '14' }}><Bottle color={p.color} size={p.size} height={52} /></div>
                <div className="grow">
                  <b>{o.lines.map((l) => `${l.qty} × ${product(l.productId).brand} ${String(product(l.productId).size).replace('.', ',')} kg`).join(', ')}</b>
                  <small className="muted">{o.id} · {new Date(o.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</small>
                  <span className="price">{fcfa(orderTotal(o))}</span>
                </div>
                <StatusPill status={o.status} label={STATUS_LABEL[o.status]} />
              </Link>
              {o.status === 'livree' && (
                <div className="order-actions">
                  <button className="btn btn-sm btn-ghost"><Icon name="star" size={16} /> Noter</button>
                  <button className="btn btn-sm btn-primary" onClick={() => { o.lines.forEach(addToCart); nav('/panier') }}>
                    <Icon name="refresh" size={16} /> Commander à nouveau
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Addresses() {
  const { addresses, addAddress } = useStore()
  const [adding, setAdding] = useState(false)
  const [f, setF] = useState({ label: '', quarter: '', landmark: '', phone: '' })
  return (
    <div className="screen with-nav narrow">
      <TopBar title="Mes adresses" />
      <div className="pad stack">
        {addresses.map((a) => (
          <div key={a.id} className="card option">
            <span className="addr-icon"><Icon name={a.label === 'Maison' ? 'home' : 'pin'} /></span>
            <div className="grow"><b>{a.label}</b><small className="muted">{a.quarter}</small><small>{a.landmark}</small></div>
          </div>
        ))}
        {adding ? (
          <div className="card stack">
            <button className="btn btn-ghost btn-sm"><Icon name="pin" size={16} /> Utiliser ma position GPS</button>
            {(['label', 'quarter', 'landmark', 'phone'] as const).map((k) => (
              <label key={k} className="field">
                <span>{{ label: 'Libellé (Maison, Boutique…)', quarter: 'Quartier', landmark: 'Repère (« derrière la station… »)', phone: 'Téléphone de rappel' }[k]}</span>
                <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
              </label>
            ))}
            <button className="btn btn-primary" disabled={!f.label || !f.landmark}
              onClick={() => { addAddress({ id: crypto.randomUUID(), ...f }); setAdding(false); setF({ label: '', quarter: '', landmark: '', phone: '' }) }}>
              Enregistrer
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={() => setAdding(true)}><Icon name="plus" size={18} /> Ajouter une adresse</button>
        )}
      </div>
    </div>
  )
}

export function Emergency() {
  return (
    <div className="screen emergency narrow">
      <TopBar title="Fuite de gaz" />
      <div className="pad stack">
        <div className="sos-hero"><Icon name="alert" size={44} /><h2>Gardez votre calme</h2><p>Suivez ces étapes immédiatement.</p></div>
        <ol className="steps">
          <li><b>Fermez le robinet</b> de la bouteille et le détendeur.</li>
          <li><b>N’allumez rien</b> : ni lumière, ni allumette, ni téléphone près de la fuite.</li>
          <li><b>Ouvrez portes et fenêtres</b> pour aérer.</li>
          <li><b>Sortez la bouteille</b> à l’extérieur si vous pouvez le faire sans danger.</li>
          <li><b>Éloignez tout le monde</b>, puis appelez depuis l’extérieur.</li>
        </ol>
        <a className="btn btn-danger btn-lg" href={`tel:${EMERGENCY_NUMBER.replace(/\s/g, '')}`}>
          <Icon name="phone" size={20} /> Appeler l’urgence · {EMERGENCY_NUMBER}
        </a>
        <a className="btn btn-ghost" href="tel:118"><Icon name="phone" size={18} /> Sapeurs-pompiers · 118</a>
      </div>
    </div>
  )
}

export function Profile() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  return (
    <div className="screen with-nav narrow">
      <TopBar title="Profil" back={false} />
      <div className="pad stack">
        <div className="card profile">
          <div className="avatar lg">MN</div>
          <div><b>Marie Ngono</b><small className="muted">+237 6 77 12 34 56</small></div>
        </div>
        <div className="card menu">
          <Link to="/adresses"><Icon name="pin" /> Mes adresses <span>›</span></Link>
          <Link to="/commandes"><Icon name="list" /> Mes commandes <span>›</span></Link>
          <Link to="/urgence"><Icon name="alert" /> Consignes de sécurité <span>›</span></Link>
          <div className="menu-row"><Icon name="globe" /> Langue
            <div className="seg mini">
              <button className={lang === 'fr' ? 'on' : ''} onClick={() => setLang('fr')}>FR</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>
        </div>
        <div className="card menu">
          <Link to="/livreur"><Icon name="truck" /> Espace livreur (démo) <span>›</span></Link>
          <Link to="/console"><Icon name="chart" /> Console distributeur (démo) <span>›</span></Link>
        </div>
        <Link to="/" className="btn btn-ghost"><Icon name="logout" size={18} /> Se déconnecter</Link>
      </div>
    </div>
  )
}
