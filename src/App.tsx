import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { QuestionnaireProvider } from './context/QuestionnaireContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login   from './pages/Login'
import Home    from './pages/Home'
import Treino  from './pages/Treino'
import Dieta   from './pages/Dieta'
import Perfil  from './pages/Perfil'
import Form    from './pages/Form'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-[#EF3340] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuestionnaireProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/"       element={<Landing />} />
              <Route path="/login"  element={<Login />} />
              <Route path="/form"   element={<Form />} />

              {/* Protected Routes */}
              <Route path="/home"   element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/treino" element={<ProtectedRoute><Treino /></ProtectedRoute>} />
              <Route path="/dieta"  element={<ProtectedRoute><Dieta /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

              {/* fallback */}
              <Route path="*"       element={<Landing />} />
            </Routes>
          </BrowserRouter>
        </QuestionnaireProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

