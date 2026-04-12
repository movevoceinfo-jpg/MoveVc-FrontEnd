import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { QuestionnaireProvider } from './context/QuestionnaireContext'
import Landing from './pages/Landing'
import Login   from './pages/Login'
import Home    from './pages/Home'
import Dieta   from './pages/Dieta'
import Perfil  from './pages/Perfil'
import Form    from './pages/Form'

export default function App() {
  return (
    <ThemeProvider>
      <QuestionnaireProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"       element={<Landing />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/home"   element={<Home />} />
            <Route path="/dieta"  element={<Dieta />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/form"   element={<Form />} />
            {/* fallback */}
            <Route path="*"       element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </QuestionnaireProvider>
    </ThemeProvider>
  )
}
