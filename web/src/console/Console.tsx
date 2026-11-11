import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Icon, MapView, StatusPill } from '../components/ui'
import { DRIVERS, OUTLETS, PAYMENT_LABEL, PRODUCTS, STATUS_LABEL, fcfa, orderTotal, product } from '../data/mock'
import { useStore } from '../data/store'

const LATE_MIN = 45

function useNow() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(t) }, [])
  return now
}

export function ConsoleLayout() {
  return (
    <div className="console">
      <aside className="side">
        <div className="brand"><span className="brand-mark"><Icon name="flame" size={18} /></span>GazExpress</div>
        <small className="side-org">Distributeur pilote · Yaoundé</small>
        <nav>
          <NavLink to="/console" end><Icon name="truck" /> Dispatch</NavLink>
          <NavLink to="/console/stock"><Icon name="box" /> Stock</NavLink>
          <NavLink to="/console/rapports"><Icon name="chart" /> Rapports</NavLink>
          <NavLink to="/console/parametres"><Icon name="settings" /> Paramètres</NavLink>
        </nav>
        <NavLink to="/accueil" className="side-foot"><Icon name="back" size={18} /> Appli client</NavLink>
      </aside>
      <main className="console-main"><Outlet /></main>
    </div>
  )
}

export function Dispatch() {
  const { orders, setStatus } = useStore()
  const now = useNow()
  const open = orders.filter((o) => !['livree', 'annulee', 'echouee'].includes(o.status))
  const late = open.filter((o) => now - o.createdAt > LATE_MIN * 60_000)
  const delivered = orders.filter((o) => o.status === 'livree')

  return (
    <>
      <header className="console-head">
        <div><h1>Dispatch</h1><small className="muted">Commandes en temps réel</small></div>
        <button className="btn btn-primary"><Icon name="phone" size={18} /> Saisir une commande téléphonique</button>
      </header>

      <div className="kpis">
        <div className="kpi"><small>Commandes ouvertes</small><b>{open.length}</b></div>
        <div className={'kpi' + (late.length ? ' warn' : '')}><small>En retard (&gt; {LATE_MIN} min)</small><b>{late.length}</b></div>
        <div className="kpi"><small>Livrées aujourd’hui</small><b>{delivered.length}</b></div>
        <div className="kpi"><small>Délai moyen</small><b>38 min</b></div>
      </div>

      {late.length > 0 && (
        <div className="alert"><Icon name="alert" size={18} /> {late.map((o) => o.id).join(', ')} dépasse{late.length > 1 ? 'nt' : ''} le délai cible de {LATE_MIN} min.</div>
      )}

      <div className="console-grid">
        <section className="panel">
          <h3>Commandes</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>N°</th><th>Client</th><th>Contenu</th><th>Montant</th><th>Âge</th><th>Statut</th><th>Livreur</th></tr></thead>
              <tbody>
                {orders.map((o) => {
                  const age = Math.round((now - o.createdAt) / 60_000)
                  const isOpen = open.includes(o)
                  return (
                    <tr key={o.id} className={late.includes(o) ? 'late' : ''}>
                      <td><b>{o.id}</b></td>
                      <td>{o.customer}<br /><small className="muted">{o.address.quarter}</small></td>
                      <td>{o.lines.map((l) => `${l.qty}× ${product(l.productId).brand} ${String(product(l.productId).size).replace('.', ',')}kg`).join(', ')}</td>
                      <td>{fcfa(orderTotal(o))}<br /><small className="muted">{PAYMENT_LABEL[o.payment]}</small></td>
                      <td>{age < 120 ? `${age} min` : '—'}</td>
                      <td><StatusPill status={o.status} label={STATUS_LABEL[o.status]} /></td>
                      <td>
                        {isOpen ? (
                          <select value={o.driver ?? ''} onChange={(e) => setStatus(o.id, e.target.value ? 'attribuee' : 'confirmee', { driver: e.target.value || undefined })}>
                            <option value="">— Non attribuée —</option>
                            {DRIVERS.filter((d) => d.online).map((d) => <option key={d.id}>{d.name}</option>)}
                          </select>
                        ) : (o.driver ?? '—')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <h3>Carte en direct</h3>
          <MapView progress={0.55} height={220} />
          <h3>Livreurs</h3>
          <ul className="drivers">
            {DRIVERS.map((d) => (
              <li key={d.id}>
                <span className={'dot-status' + (d.online ? ' on' : '')} />
                <b>{d.name}</b>
                <small className="muted">{orders.filter((o) => o.driver === d.name && open.includes(o)).length} en cours</small>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export function Stock() {
  return (
    <>
      <header className="console-head">
        <div><h1>Stock</h1><small className="muted">Pleines et vides par point de vente</small></div>
        <div className="two-inline">
          <button className="btn btn-ghost">Inventaire</button>
          <button className="btn btn-primary"><Icon name="plus" size={18} /> Entrée de stock</button>
        </div>
      </header>
      <div className="kpis">
        {OUTLETS.map((o) => (
          <div key={o.id} className={'kpi' + (o.status === 'Rupture' ? ' warn' : '')}><small>{o.name}</small><b>{o.status}</b></div>
        ))}
      </div>
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Article</th><th>Pleines</th><th>Vides</th><th>Seuil</th><th>Prix recharge</th><th>Consigne</th></tr></thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.id} className={p.stock < 10 ? 'late' : ''}>
                  <td><b>{p.brand}</b> {String(p.size).replace('.', ',')} kg</td>
                  <td>{p.stock} {p.stock < 10 && <span className="pill pill-annulee">Sous le seuil</span>}</td>
                  <td>{Math.round(p.stock * 0.6)}</td>
                  <td>10</td>
                  <td>{fcfa(p.price)}</td>
                  <td>{fcfa(p.deposit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export function Reports() {
  const { orders } = useStore()
  const exportCsv = () => {
    const rows = [['N°', 'Date', 'Client', 'Statut', 'Paiement', 'Livreur', 'Montant (XAF)'],
      ...orders.map((o) => [o.id, new Date(o.createdAt).toISOString(), o.customer, STATUS_LABEL[o.status], PAYMENT_LABEL[o.payment], o.driver ?? '', String(orderTotal(o))])]
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(';')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    a.download = 'ventes.csv'
    a.click()
  }
  const total = orders.filter((o) => o.status === 'livree').reduce((s, o) => s + orderTotal(o), 0)
  return (
    <>
      <header className="console-head">
        <div><h1>Rapports</h1><small className="muted">Ventes, livraison, caisse, stock, consignes</small></div>
        <button className="btn btn-primary" onClick={exportCsv}>Exporter (Excel / CSV)</button>
      </header>
      <div className="kpis">
        <div className="kpi"><small>Chiffre d’affaires livré</small><b>{fcfa(total)}</b></div>
        <div className="kpi"><small>% livré &lt; 60 min</small><b>92 %</b></div>
        <div className="kpi"><small>Part mobile money</small><b>{Math.round((orders.filter((o) => o.payment !== 'cash').length / orders.length) * 100)} %</b></div>
        <div className="kpi"><small>Note moyenne</small><b>4,7 / 5</b></div>
      </div>
      <section className="panel"><p className="muted">Graphiques détaillés à venir (par jour, zone, livreur, produit).</p></section>
    </>
  )
}

export function Settings() {
  return (
    <>
      <header className="console-head"><div><h1>Paramètres</h1><small className="muted">Entreprise, utilisateurs, zones, catalogue</small></div></header>
      <section className="panel"><p className="muted">À venir : utilisateurs et rôles, zones de livraison sur la carte, grille de frais, numéro d’urgence, journal des actions.</p></section>
    </>
  )
}
