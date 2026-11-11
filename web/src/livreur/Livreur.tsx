import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Icon, StatusPill, TopBar } from '../components/ui'
import { BRANDS, PAYMENT_LABEL, STATUS_LABEL, fcfa, orderTotal, product, type Order } from '../data/mock'
import { useStore } from '../data/store'

export const ME = 'Paul Mbarga'

const summary = (o: Order) =>
  o.lines.map((l) => `${l.qty} × ${product(l.productId).brand} ${String(product(l.productId).size).replace('.', ',')} kg`).join(', ')

function Countdown({ onEnd }: { onEnd: () => void }) {
  const [s, setS] = useState(120)
  useEffect(() => {
    if (s <= 0) { onEnd(); return }
    const t = setTimeout(() => setS(s - 1), 1000)
    return () => clearTimeout(t)
  }, [s, onEnd])
  return <span className="countdown">{Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}</span>
}

export function Missions() {
  const { orders, setStatus, online, setOnline } = useStore()
  const [refused, setRefused] = useState<string[]>([])
  const proposal = online && orders.find((o) => ['recue', 'confirmee'].includes(o.status) && !o.driver && !refused.includes(o.id))
  const mine = orders.filter((o) => o.driver === ME && ['attribuee', 'preparation', 'en_route'].includes(o.status))

  return (
    <div className="screen with-nav driver-app">
      <header className="driver-head">
        <div className="avatar">PM</div>
        <div className="grow"><small>Bonjour</small><b>{ME}</b></div>
        <button className={'toggle' + (online ? ' on' : '')} onClick={() => setOnline(!online)}>
          <span />{online ? 'En service' : 'Hors service'}
        </button>
      </header>

      <div className="pad stack">
        {!online && <div className="card muted-card center">Passez « En service » pour recevoir des commandes. Votre position est envoyée toutes les 30 s.</div>}

        {proposal && (
          <div className="card proposal">
            <div className="row-between">
              <span className="pill pill-new">Nouvelle commande</span>
              <Countdown key={proposal.id} onEnd={() => setRefused((r) => [...r, proposal.id])} />
            </div>
            <h3>{summary(proposal)}</h3>
            <p className="muted"><Icon name="pin" size={14} /> {proposal.address.quarter} · {proposal.address.landmark}</p>
            <div className="kv">
              <div><small>Distance</small><b>2,4 km</b></div>
              <div><small>Retrait</small><b>{proposal.outlet}</b></div>
              <div><small>À encaisser</small><b>{proposal.payment === 'cash' ? fcfa(orderTotal(proposal)) : 'Payé'}</b></div>
            </div>
            <div className="two">
              <button className="btn btn-ghost btn-lg" onClick={() => setRefused((r) => [...r, proposal.id])}>Refuser</button>
              <button className="btn btn-primary btn-lg" onClick={() => setStatus(proposal.id, 'attribuee', { driver: ME })}>Accepter</button>
            </div>
          </div>
        )}

        <div className="section-head"><h3>Mes livraisons</h3><small className="muted">{mine.length} en cours</small></div>
        {mine.map((o) => (
          <Link key={o.id} to={`/livreur/livraison/${o.id}`} className="card mission">
            <div className="grow">
              <b>{o.customer}</b>
              <small className="muted">{summary(o)}</small>
              <small><Icon name="pin" size={12} /> {o.address.quarter}</small>
            </div>
            <StatusPill status={o.status} label={STATUS_LABEL[o.status]} />
          </Link>
        ))}
        {!mine.length && <p className="muted center">Aucune livraison en cours.</p>}
      </div>
    </div>
  )
}

export function Delivery() {
  const { id } = useParams()
  const nav = useNavigate()
  const { orders, setStatus } = useStore()
  const o = orders.find((x) => x.id === id)
  const [code, setCode] = useState('')
  const [empty, setEmpty] = useState(o?.lines[0].emptyBrand ?? 'Tradex')
  const [state, setState] = useState<'bon' | 'abime' | 'hors_norme'>('bon')
  const [paid, setPaid] = useState(false)
  if (!o) return <div className="screen"><TopBar title="Livraison" /></div>

  const total = orderTotal(o)
  const needsEmpty = o.lines.some((l) => l.kind === 'recharge')

  return (
    <div className="screen driver-app">
      <TopBar title={o.id} />
      <div className="pad stack">
        <div className="card">
          <b>{o.customer}</b>
          <p className="muted">{o.address.quarter} — {o.address.landmark}</p>
          <p>{summary(o)}</p>
          <div className="two">
            <a className="btn btn-ghost" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address.quarter + ' Yaoundé')}`} target="_blank" rel="noreferrer">
              <Icon name="nav" size={18} /> Itinéraire
            </a>
            <a className="btn btn-ghost" href={`tel:${o.phone}`}><Icon name="phone" size={18} /> Appeler</a>
          </div>
        </div>

        {o.status === 'attribuee' && (
          <button className="btn btn-primary btn-xl" onClick={() => setStatus(o.id, 'preparation')}>
            <Icon name="box" /> J’ai retiré les bouteilles
          </button>
        )}
        {o.status === 'preparation' && (
          <button className="btn btn-primary btn-xl" onClick={() => setStatus(o.id, 'en_route')}>
            <Icon name="truck" /> Je pars livrer
          </button>
        )}
        {o.status === 'en_route' && (
          <div className="card stack">
            <h3>Remise au client</h3>
            <label className="field">
              <span>Code à 4 chiffres donné par le client</span>
              <input className="code-input" value={code} inputMode="numeric" maxLength={4} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="••••" />
            </label>
            {code.length === 4 && code !== o.code && <small className="error">Code incorrect (démo : {o.code})</small>}
            <button className="btn btn-ghost btn-sm"><Icon name="camera" size={16} /> Pas de code ? Prendre une photo</button>

            {needsEmpty && (
              <>
                <h4>Bouteille vide récupérée</h4>
                <select className="input" value={empty} onChange={(e) => setEmpty(e.target.value)}>
                  {BRANDS.map((b) => <option key={b}>{b}</option>)}
                </select>
                <div className="seg mini">
                  {(['bon', 'abime', 'hors_norme'] as const).map((s) => (
                    <button key={s} className={state === s ? 'on' : ''} onClick={() => setState(s)}>
                      {{ bon: 'Bon', abime: 'Abîmée', hors_norme: 'Hors norme' }[s]}
                    </button>
                  ))}
                </div>
              </>
            )}

            <h4>Encaissement</h4>
            <div className="amount">
              <small>{PAYMENT_LABEL[o.payment]}</small>
              <b>{o.payment === 'cash' ? fcfa(total) : 'Déjà payé'}</b>
            </div>
            {o.payment === 'cash' && (
              <label className="check"><input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} /> J’ai encaissé {fcfa(total)}</label>
            )}

            <button className="btn btn-primary btn-xl" disabled={code !== o.code || (o.payment === 'cash' && !paid)}
              onClick={() => { setStatus(o.id, 'livree'); nav('/livreur', { replace: true }) }}>
              <Icon name="check" /> Valider la livraison
            </button>
            <button className="btn btn-danger-ghost" onClick={() => {
              const m = prompt('Motif : client absent, adresse introuvable, refus…')
              if (m) { setStatus(o.id, 'echouee'); nav('/livreur', { replace: true }) }
            }}>Signaler un échec</button>
          </div>
        )}
      </div>
    </div>
  )
}

const WEEK = [
  { d: 'Lun', v: 9 }, { d: 'Mar', v: 12 }, { d: 'Mer', v: 7 }, { d: 'Jeu', v: 14 },
  { d: 'Ven', v: 16 }, { d: 'Sam', v: 11 }, { d: 'Dim', v: 5 },
]

export function Cashbox() {
  const { orders } = useStore()
  const done = orders.filter((o) => o.driver === ME && o.status === 'livree')
  const cash = done.filter((o) => o.payment === 'cash').reduce((s, o) => s + orderTotal(o), 0)
  const mobile = done.filter((o) => o.payment !== 'cash').reduce((s, o) => s + orderTotal(o), 0)
  const max = Math.max(...WEEK.map((w) => w.v))
  return (
    <div className="screen with-nav driver-app">
      <TopBar title="Caisse du jour" back={false} />
      <div className="pad stack">
        <div className="card cash-hero">
          <small>Espèces à remettre au gérant</small>
          <b>{fcfa(cash)}</b>
          <div className="kv">
            <div><small>Mobile money</small><b>{fcfa(mobile)}</b></div>
            <div><small>Livraisons</small><b>{done.length}</b></div>
          </div>
        </div>
        <div className="card">
          <div className="row-between"><h3>Livraisons de la semaine</h3></div>
          <div className="bars" role="img" aria-label="Livraisons par jour">
            {WEEK.map((w, i) => (
              <div key={w.d} className="bar-col">
                <small>{w.v}</small>
                <div className={'bar' + (i === 4 ? ' hi' : '')} style={{ height: `${(w.v / max) * 100}%` }} />
                <small className="muted">{w.d}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="section-head"><h3>Détail</h3></div>
        {done.map((o) => (
          <div key={o.id} className="card mission">
            <div className="grow"><b>{o.id} · {o.customer}</b><small className="muted">{PAYMENT_LABEL[o.payment]}</small></div>
            <b>{fcfa(orderTotal(o))}</b>
          </div>
        ))}
        <button className="btn btn-primary btn-lg">Clôturer avec le gérant</button>
      </div>
    </div>
  )
}
