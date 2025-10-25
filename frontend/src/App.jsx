import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/public/Home'
import LikedNewsPage from './pages/user/LikedNewsPage'
import NavBar from './components/NavBar'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import EditProfilePage from './pages/user/EditProfilePage'
import NewsDetailPage from './pages/public/NewsDetailPage'
import MyNewsPage from './pages/jornalist/MyNewsPage'
import CreateNewsPage from './pages/jornalist/CreateNewsPage'
import EditNewsPage from './pages/jornalist/EditNewsPage'

function App() {
  return (
    <div>
      <NavBar/>
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/LikedNews" element={<LikedNewsPage/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/Profile" element={<EditProfilePage/>}/>
          <Route path="/news/:id" element={<NewsDetailPage/>}/>
          <Route path="/admin/news" element={<MyNewsPage />} />
          <Route path="/admin/news/create" element={<CreateNewsPage />} />
          <Route path="/admin/news/edit/:id" element={<EditNewsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App