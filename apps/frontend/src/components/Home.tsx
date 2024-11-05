import React from 'react'
import Login from './components/login'
import Signup from './components/signup'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex items-center justify-around m-4'>
    <Link to={'/Login'}>Login</Link>
    <h1>Metaverse App</h1>
    <Link to={'/signup'}>Signup</Link>
    </div>
  )
}

export default Home
