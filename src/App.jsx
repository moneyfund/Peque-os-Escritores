import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Learn from './pages/Learn.jsx'
import Lesson from './pages/Lesson.jsx'
import Progress from './pages/Progress.jsx'
import Profile from './pages/Profile.jsx'
import Groups from './pages/Groups.jsx'
import GroupDetail from './pages/GroupDetail.jsx'
import Invitations from './pages/Invitations.jsx'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="full-loader"><div className="loader-orbit">📚</div><strong>Cargando aventuras…</strong></div>
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/aprender" element={<Learn/>}/>
    <Route path="/lecciones/:lessonId" element={<Lesson/>}/>
    <Route path="/avances" element={<Protected><Progress/></Protected>}/>
    <Route path="/perfil" element={<Protected><Profile/></Protected>}/>
    <Route path="/grupos" element={<Protected><Groups/></Protected>}/>
    <Route path="/grupos/:groupId" element={<Protected><GroupDetail/></Protected>}/>
    <Route path="/invitaciones" element={<Protected><Invitations/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></Layout>
}
