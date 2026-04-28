import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Eager-loaded pages
import Home  from './pages/Home'
import Login from './pages/Login'

// Lazy-loaded pages (Step 11 – Performance optimization)
const Events       = lazy(() => import('./pages/Events'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))

function PageLoader() {
  return <div className="spinner" />
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/"          element={<Home />} />
              <Route path="/events"    element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login"     element={<Login />} />

              {/* Protected route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}
