import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bottle, Icon, TopBar } from '../components/ui'

export function Onboarding() {
  const nav = useNavigate()
  return (
    <div className="screen onboarding">
      <div className="onb-hero">
        <div className="onb-bottles">
          <Bottle color="#1E5AA8" height={150} />
          <Bottle color="#fff" height={190} />
          <Bottle color="#1F9D55" size={6} height={130} />
        </div>
      </div>
      <div className="onb-body">
        <div className="brand"><span className="brand-mark"><Icon name="flame" size={20} /></span>GazExpress</div>
        <h2>Votre gaz livré chez vous <em>en moins d’une heure</em></h2>
        <p className="muted">Recharge ou première bouteille, paiement MoMo, Orange Money ou espèces. Suivez votre livreur en direct.</p>
        <button className="btn btn-primary btn-lg" onClick={() => nav('/connexion')}>
          Commencer <Icon name="back" size={18} />
        </button>
      </div>
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
    <div className="screen">
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
    <div className="screen">
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
