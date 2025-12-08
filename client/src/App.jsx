import React, { useContext, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Posts from './pages/Posts'
import BrowseBooks from './pages/BrowseBooks'
import BookDetails from './pages/BookDetails'
import MyLists from './pages/MyLists'
import About from './pages/About'
import UserProfile from './pages/UserProfile'
import Notifications from './pages/Notifications'
import Recommendations from './pages/Recommendations'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'
import Friends from './components/friends.jsx'
import Search from './components/search.jsx';
import Footer from './components/Footer'
import Subscription from './pages/BuyCredits.jsx'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
// import Verify from './pages/Verify'

const App = () => {

  const { showLogin } = useContext(AppContext)
  const location = useLocation()

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    // <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gray-900 '>
      <div className='min-h-screen bg-gray-900 '>
      <ToastContainer position='bottom-right' />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path='/posts' element={<Posts/>}/>
        <Route path='/books' element={<BrowseBooks/>}/>
        <Route path='/books/:id' element={<BookDetails/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/buy' element={<Subscription />} />
        <Route path='/subscription' element={<Subscription />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path='/friends' element={<ProtectedRoute><Friends/></ProtectedRoute>}/>
        <Route path='/recommendations' element={<ProtectedRoute><Recommendations/></ProtectedRoute>}/>
        <Route path='/my-lists' element={<ProtectedRoute><MyLists/></ProtectedRoute>}/>
        <Route path='/notifications' element={<ProtectedRoute><Notifications/></ProtectedRoute>}/>
        <Route path='/profile/:userId' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
        <Route path='/settings' element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App