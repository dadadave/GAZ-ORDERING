import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bottle, Icon, TopBar } from '../components/ui'

export function Onboarding() {
  const nav = useNavigate()
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand"><span className="brand-mark"><Icon name="flame" size={20} /></span>GazExpress</div>
        <div className="landing-nav-actions">
          <a href="#comment" className="site-link hide-sm">Comment ça marche</a>
          <button className="btn btn-sm btn-light" onClick={() => nav('/connexion')}>Se connecter</button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">Yaoundé · 7 j/7 · 6 h – 22 h</span>
          <h1>Votre bouteille de gaz livrée <em>en moins d’une heure</em></h1>
          <p>Recharge ou première bouteille, toutes marques. Payez par MTN MoMo, Orange Money ou en espèces, et suivez votre livreur en direct.</p>
          <div className="landing-cta">
            <button className="btn btn-light btn-lg" onClick={() => nav('/connexion')}>Commander maintenant</button>
            <a href="#comment" className="btn btn-outline-light btn-lg">En savoir plus</a>
          </div>
          <ul className="landing-proof">
            <li><b>&lt; 60 min</b><span>en ville</span></li>
            <li><b>6 · 12,5 · 50 kg</b><span>toutes tailles</span></li>
            <li><b>MoMo · OM</b><span>ou espèces</span></li>
          </ul>
        </div>
        <div className="landing-art" aria-hidden="true">
          <div className="landing-bottles">
            <Bottle color="#1E5AA8" height={170} />
            <Bottle color="#fff" height={230} />
            <Bottle color="#1F9D55" size={6} height={140} />
          </div>
        </div>
      </section>

      <section id="comment" className="landing-section">
        <h2>Comment ça marche</h2>
        <div className="how">
          {[
            { i: 'flame', t: 'Choisissez', d: 'Votre marque et votre taille, en recharge ou première bouteille avec consigne.' },
            { i: 'wallet', t: 'Payez', d: 'MTN MoMo, Orange Money, ou espèces à la livraison. Reçu numérique.' },
            { i: 'truck', t: 'Recevez', d: 'Suivez votre livreur sur la carte. Donnez-lui votre code à 4 chiffres.' },
          ].map((s, n) => (
            <article key={s.t} className="card how-step">
              <span className="how-num">{n + 1}</span>
              <span className="how-icon"><Icon name={s.i} size={26} /></span>
              <h3>{s.t}</h3>
              <p className="muted">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="safety">
          <div>
            <h2>Une fuite de gaz ?</h2>
            <p>Les consignes de sécurité et le numéro d’urgence sont accessibles en un clic, même sans compte.</p>
          </div>
          <button className="btn btn-danger btn-lg" onClick={() => nav('/urgence')}><Icon name="alert" size={20} /> Que faire en cas de fuite</button>
        </div>
      </section>

      <footer className="landing-foot">
        <span>© 2026 GazExpress · Prototype</span>
        <span><a href="/livreur">Espace livreur</a> · <a href="/console">Espace distributeur</a></span>
      </footer>
    </div>
  )
}

export function Login() {
  const nav = useNavigate()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(true)
  const valid = phone.replace(/\D/g, '').length === 9 && name.trim().length > 1 && consent
  return (
    <div className="screen auth">
      <TopBar title="Connexion" />
      <div className="pad stack">
        <div className="hero-icon"><Icon name="phone" size={34} /></div>
        <h2 className="center">Entrez votre numéro</h2>
        <p className="muted center">Nous vous envoyons un code par SMS. Pas de mot de passe à retenir.</p>
        <label className="field">
          <span>Nom</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Marie Ngono" autoComplete="name" />
        </label>
        <label className="field">
          <span>Téléphone</span>
          <div className="input-prefix">
            <b>+237</b>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="6 77 12 34 56" autoComplete="tel" />
          </div>
        </label>
        <label className="check">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>J’accepte la <a href="#">politique de confidentialité</a></span>
        </label>
        <button className="btn btn-primary btn-lg" disabled={!valid} onClick={() => nav('/otp', { state: { phone } })}>
          Recevoir le code
        </button>
      </div>
    </div>
  )
}

export function Otp() {
  const nav = useNavigate()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const set = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[i] = d
    setCode(next)
    if (d && i < 5) refs.current[i + 1]?.focus()
  }
  return (
    <div className="screen auth">
      <TopBar title="Vérification" />
      <div className="pad stack">
        <div className="hero-icon"><Icon name="check" size={34} /></div>
        <h2 className="center">Code de vérification</h2>
        <p className="muted center">Saisissez le code à 6 chiffres reçu par SMS.<br /><small>(Prototype : n’importe quel code)</small></p>
        <div className="otp">
          {code.map((c, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el }} value={c} inputMode="numeric" maxLength={1}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => e.key === 'Backspace' && !c && i > 0 && refs.current[i - 1]?.focus()} />
          ))}
        </div>
        <button className="btn btn-primary btn-lg" disabled={code.some((c) => !c)} onClick={() => nav('/accueil', { replace: true })}>
          Continuer
        </button>
        <button className="link center">Renvoyer le code</button>
      </div>
    </div>
  )
}
