import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/ui'
import { StoreProvider, useStore } from './data/store'
import { Login, Onboarding, Otp } from './client/Auth'
import { Home } from './client/Home'
import { Product } from './client/Product'
import { Cart } from './client/Cart'
import { Tracking } from './client/Tracking'
import { Addresses, Emergency, Orders, Profile } from './client/Pages'
import { Cashbox, Delivery, Missions } from './livreur/Livreur'
import { ConsoleLayout, Dispatch, Reports, Settings, Stock } from './console/Console'

function MobileShell() {
  return <div className="phone"><Outlet /></div>
}

function ClientTabs() {
  const { cart } = useStore()
  return (
    <>
      <Outlet />
      <BottomNav items={[
        { to: '/accueil', icon: 'home', label: 'Accueil' },
        { to: '/commandes', icon: 'list', label: 'Commandes' },
        { to: '/panier', icon: 'cart', label: 'Panier', center: true, badge: cart.reduce((s, l) => s + l.qty, 0) },
        { to: '/adresses', icon: 'pin', label: 'Adresses' },
        { to: '/profil', icon: 'user', label: 'Profil' },
      ]} />
    </>
  )
}

function DriverTabs() {
  return (
    <>
      <Outlet />
      <BottomNav items={[
        { to: '/livreur', icon: 'truck', label: 'Missions' },
        { to: '/livreur/caisse', icon: 'wallet', label: 'Caisse' },
        { to: '/accueil', icon: 'back', label: 'Quitter' },
      ]} />
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MobileShell />}>
            <Route path="/" element={<Onboarding />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/produit/:id" element={<Product />} />
            <Route path="/suivi/:id" element={<Tracking />} />
            <Route path="/urgence" element={<Emergency />} />
            <Route element={<ClientTabs />}>
              <Route path="/accueil" element={<Home />} />
              <Route path="/commandes" element={<Orders />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/adresses" element={<Addresses />} />
              <Route path="/profil" element={<Profile />} />
            </Route>
            <Route path="/livreur/livraison/:id" element={<Delivery />} />
            <Route element={<DriverTabs />}>
              <Route path="/livreur" element={<Missions />} />
              <Route path="/livreur/caisse" element={<Cashbox />} />
            </Route>
          </Route>
          <Route path="/console" element={<ConsoleLayout />}>
            <Route index element={<Dispatch />} />
            <Route path="stock" element={<Stock />} />
            <Route path="rapports" element={<Reports />} />
            <Route path="parametres" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
