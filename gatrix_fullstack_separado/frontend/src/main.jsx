import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import PublicLayout from './layouts/PublicLayout/PublicLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/public/HomePage'
import StorePage from './pages/public/StorePage'
import ServicesPage from './pages/public/ServicesPage'
import AboutPage from './pages/public/AboutPage'
import AdditionalPage from './pages/public/AdditionalPage'
import PricesPage from './pages/public/PricesPage'
import ReservationPage from './pages/public/ReservationPage'
import LocationPage from './pages/public/LocationPage'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ClientsPage from './pages/admin/ClientsPage'
import AttentionPage from './pages/admin/AttentionPage'
import InventoryPage from './pages/admin/InventoryPage'
import FinancePage from './pages/admin/FinancePage'
import AdminReservationsPage from './pages/admin/AdminReservationsPage'
import UsersPage from './pages/admin/UsersPage'
import NotFoundPage from './pages/NotFoundPage'
import './styles/global.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'nosotros', element: <AboutPage /> },
      { path: 'servicios', element: <ServicesPage /> },
      { path: 'tienda', element: <StorePage /> },
      { path: 'reservas', element: <ReservationPage /> },
      { path: 'ubicacion', element: <LocationPage /> },
      { path: 'adicionales', element: <AdditionalPage /> },
      { path: 'precios', element: <PricesPage /> }
    ]
  },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'clientes', element: <ClientsPage /> },
      { path: 'atencion', element: <AttentionPage /> },
      { path: 'almacen', element: <InventoryPage /> },
      { path: 'finanzas', element: <FinancePage /> },
      { path: 'reservas', element: <AdminReservationsPage /> },
      { path: 'usuarios', element: <UsersPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>
)
