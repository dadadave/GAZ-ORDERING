import { Link, useParams } from 'react-router-dom'
import { Icon, MapView, TopBar } from '../components/ui'
import { DRIVERS, STATUS_FLOW, STATUS_LABEL, fcfa, orderTotal } from '../data/mock'
import { useStore } from '../data/store'

const PROGRESS: Record<string, number> = { recue: 0, confirmee: 0, attribuee: 0.05, preparation: 0.1, en_route: 0.55, livree: 1 }

export function Tracking() {
  const { id } = useParams()
  const { orders, setStatus } = useStore()
  const o = orders.find((x) => x.id === id)
  if (!o) return <div className="screen"><TopBar title="Suivi" /><p className="pad">Commande introuvable.</p></div>
  const driver = DRIVERS.find((d) => d.name === o.driver)
  const step = STATUS_FLOW.indexOf(o.status)
  const cancellable = ['recue', 'confirmee', 'attribuee'].includes(o.status)

  return (
    <div className="screen">
      <TopBar title={`Commande ${o.id}`} />
      <div className="split track-split">
      <div className="track-map"><MapView progress={PROGRESS[o.status] ?? 0} height={260} /></div>
      <div className="pad stack sheet overlap">
        <div className="eta card">
          <div>
            <small className="muted">{o.status === 'livree' ? 'Livrée' : 'Arrivée estimée'}</small>
            <b>{o.status === 'livree' ? 'Merci !' : o.status === 'en_route' ? '12 – 18 min' : '35 – 50 min'}</b>
          </div>
          <div className="code">
            <small>Code à donner au livreur</small>
            <b>{o.code}</b>
          </div>
        </div>

        {driver ? (
          <div className="card driver">
            <div className="avatar">{driver.name.split(' ').map((s) => s[0]).join('')}</div>
            <div className="grow"><b>{driver.name}</b><small className="muted">Votre livreur · ★ 4,8</small></div>
            <a className="icon-btn primary" href={`tel:${driver.phone}`} aria-label="Appeler le livreur"><Icon name="phone" size={20} /></a>
          </div>
        ) : (
          <div className="card driver muted-card"><Icon name="clock" /> <span>Recherche d’un livreur disponible…</span></div>
        )}

        <ol className="timeline">
          {STATUS_FLOW.map((s, i) => (
            <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}>
              <span className="dot">{i < step && <Icon name="check" size={12} />}</span>
              {STATUS_LABEL[s]}
            </li>
          ))}
        </ol>

        <div className="card totals">
          <div className="row-between"><span>Total</span><b>{fcfa(orderTotal(o))}</b></div>
          <div className="row-between"><span>Adresse</span><span>{o.address.label} · {o.address.landmark}</span></div>
        </div>

        {o.status === 'livree' && <Link to="/commandes" className="btn btn-primary">Noter la livraison</Link>}
        {cancellable && (
          <button className="btn btn-ghost" onClick={() => {
            const motif = prompt('Motif d’annulation (obligatoire)')
            if (motif) setStatus(o.id, 'annulee')
          }}>Annuler la commande</button>
        )}
      </div>
      </div>
    </div>
  )
}
