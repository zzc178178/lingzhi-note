import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Note from './pages/Note'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import './App.scss'

export default function App() {
  // 初始化深色模式
  const storedDark = localStorage.getItem('dark')
  if (storedDark === '1') document.body.classList.add('dark')

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note/:id" element={<Note />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  )
}
