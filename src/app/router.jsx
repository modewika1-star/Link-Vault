import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import AuthPage from '../pages/AuthPage.jsx'
import LogoutPage from '../pages/LogoutPage.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/forgot-password" element={<AuthPage mode="forgot-password" />} />
        <Route path="/verify-code" element={<AuthPage mode="verify-code" />} />
        <Route path="/reset-password" element={<AuthPage mode="reset-password" />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
