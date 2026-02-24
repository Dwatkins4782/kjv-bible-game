import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/layout/AppHeader'
import BottomNav from './components/layout/BottomNav'
import AuthGuard from './components/auth/AuthGuard'
import Home from './pages/Home'
import Memorize from './pages/Memorize'
import Quiz from './pages/Quiz'
import Browse from './pages/Browse'
import Stats from './pages/Stats'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Pricing from './pages/Pricing'
import Account from './pages/Account'
import Login from './pages/Login'

export default function App() {
  return (
    <>
      <AppHeader />
      <main className="container main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />

          {/* Auth-required routes */}
          <Route path="/memorize" element={<AuthGuard><Memorize /></AuthGuard>} />
          <Route path="/quiz" element={<AuthGuard><Quiz /></AuthGuard>} />
          <Route path="/stats" element={<AuthGuard><Stats /></AuthGuard>} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lesson/:id" element={<AuthGuard><LessonDetail /></AuthGuard>} />
          <Route path="/account" element={<AuthGuard><Account /></AuthGuard>} />
        </Routes>
      </main>
      <BottomNav />
      <footer className="app-footer">
        Scripture Vault &bull; King James Version &bull; All scripture is given by inspiration of God
      </footer>
    </>
  )
}
