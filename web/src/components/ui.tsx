import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const PATHS: Record<string, ReactNode> = {
  back: <path d="M15 18l-6-6 6-6" />,
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  cart: <><path d="M3 4h2l2.4 11h11l2-8H6.2" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></>,
  pin: <><path d="M12 21s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.01" /></>,
  flame: <path d="M12 3c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 1.5-5 3-6.5.3 2 1.3 3 2.6 3.4C11 8 11.5 5.5 12 3z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="M5 12l5 5 9-10" />,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M16 15h2" /></>,
  truck: <><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  box: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" /></>,
  camera: <><path d="M4 7h4l2-3h4l2 3h4v13H4z" /><circle cx="12" cy="13" r="4" /></>,
  nav: <path d="M3 11l18-8-8 18-2-8z" />,
  star: <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />,
  refresh: <><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8" /><path d="M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16" /><path d="M20 20v-4h-4" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  logout: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" />,
}

export function Icon({ name, size = 22 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  )
}

/** Illustration d'une bouteille de gaz, colorée selon la marque. */
export function Bottle({ color, size = 12.5, height = 96 }: { color: string; size?: number; height?: number }) {
  const w = size >= 50 ? 1.1 : size <= 6 ? 0.85 : 1
  return (
    <svg viewBox="0 0 80 120" height={height} aria-hidden="true">
      <ellipse cx="40" cy="114" rx="26" ry="4" fill="#000" opacity=".08" />
      <rect x="31" y="6" width="18" height="10" rx="3" fill="#9AA0A6" />
      <path d="M26 16h28l4 10H22z" fill="#C8CCD0" />
      <g transform={`translate(40 0) scale(${w} 1) translate(-40 0)`}>
        <rect x="14" y="24" width="52" height="86" rx="20" fill={color} />
        <rect x="20" y="30" width="8" height="70" rx="4" fill="#fff" opacity=".25" />
        <rect x="14" y="58" width="52" height="6" fill="#000" opacity=".12" />
      </g>
      <text x="40" y="92" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="inherit">
        {String(size).replace('.', ',')} kg
      </text>
    </svg>
  )
}

export function TopBar({ title, right, back = true }: { title: string; right?: ReactNode; back?: boolean }) {
  const nav = useNavigate()
  return (
    <header className="topbar">
      {back ? (
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Retour"><Icon name="back" /></button>
      ) : <span className="icon-btn ghost" />}
      <h1>{title}</h1>
      {right ?? <span className="icon-btn ghost" />}
    </header>
  )
}

/** En-tête du site (écrans larges). Sur mobile, c'est la barre du bas qui prend le relais. */
export function SiteHeader({ cartCount }: { cartCount: number }) {
  const link = ({ isActive }: { isActive: boolean }) => 'site-link' + (isActive ? ' active' : '')
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/accueil" className="brand"><span className="brand-mark"><Icon name="flame" size={20} /></span>GazExpress</NavLink>
        <nav className="site-nav">
          <NavLink to="/accueil" className={link}>Bouteilles</NavLink>
          <NavLink to="/commandes" className={link}>Mes commandes</NavLink>
          <NavLink to="/adresses" className={link}>Adresses</NavLink>
        </nav>
        <div className="site-actions">
          <NavLink to="/urgence" className="btn btn-sm btn-danger"><Icon name="alert" size={16} /> Fuite de gaz</NavLink>
          <NavLink to="/panier" className="icon-btn cart-btn" aria-label="Panier">
            <Icon name="cart" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </NavLink>
          <NavLink to="/profil" className="avatar sm" aria-label="Profil">MN</NavLink>
        </div>
      </div>
    </header>
  )
}

export type NavItem ={ to: string; icon: string; label: string; center?: boolean; badge?: number }

export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="bottom-nav">
      {items.map((it) =>
        it.center ? (
          <NavLink key={it.to} to={it.to} className="nav-center" aria-label={it.label}>
            <Icon name={it.icon} size={26} />
            {!!it.badge && <span className="badge">{it.badge}</span>}
          </NavLink>
        ) : (
          <NavLink key={it.to} to={it.to} end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <Icon name={it.icon} />
            <span>{it.label}</span>
          </NavLink>
        ),
      )}
    </nav>
  )
}

/** Carte stylisée (placeholder) : sera remplacée par Leaflet / OpenStreetMap. */
export function MapView({ progress = 0.5, height = 300 }: { progress?: number; height?: number }) {
  const route = 'M60 250 C 120 230, 120 160, 190 150 S 290 90, 330 50'
  const ref = useRef<SVGPathElement>(null)
  const [pt, setPt] = useState({ x: 60, y: 250 })
  useLayoutEffect(() => {
    const p = ref.current
    if (!p) return
    const q = p.getPointAtLength(p.getTotalLength() * progress)
    setPt({ x: q.x, y: q.y })
  }, [progress])
  return (
    <div className="map" style={{ height }}>
      <svg viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <rect width="390" height="300" fill="#EDE7E1" />
        {[40, 110, 180, 250].map((y) => <rect key={y} x="0" y={y} width="390" height="14" fill="#fff" />)}
        {[70, 160, 260, 340].map((x) => <rect key={x} x={x} y="0" width="14" height="300" fill="#fff" />)}
        <rect x="190" y="185" width="60" height="50" rx="6" fill="#D7E8CF" />
        <rect x="20" y="70" width="40" height="30" rx="6" fill="#D7E8CF" />
        <path d={route} stroke="#F2541B" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="1 10" />
        <path d={route} stroke="#F2541B" strokeWidth="5" fill="none" strokeLinecap="round"
          pathLength={1} strokeDasharray={`${progress} 1`} />
        <circle cx="60" cy="250" r="9" fill="#1F1A17" />
        <circle cx="330" cy="50" r="13" fill="#F2541B" opacity=".25" />
        <circle cx="330" cy="50" r="7" fill="#F2541B" />
        <path ref={ref} d={route} fill="none" stroke="none" />
        <g transform={`translate(${pt.x} ${pt.y})`}>
          <circle r="16" fill="#1F1A17" stroke="#fff" strokeWidth="3" />
          <g transform="translate(-9 -9)" color="#fff"><Icon name="truck" size={18} /></g>
        </g>
      </svg>
    </div>
  )
}

export function StatusPill({ status, label }: { status: string; label: string }) {
  return <span className={`pill pill-${status}`}>{label}</span>
}
