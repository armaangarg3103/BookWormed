import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assests/assets.js'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Login')
  // const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [pendingSignupData, setPendingSignupData] = useState(null)
  const [nameError, setNameError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  // Validate name length
  useEffect(() => {
    if (name.length > 0 && (name.length < 2 || name.length > 50)) {
      setNameError(`Name must be 2-50 characters (current: ${name.length})`)
    } else {
      setNameError('')
    }
  }, [name])

  // Validate username length
  useEffect(() => {
    if (username.length > 0 && (username.length < 3 || username.length > 30)) {
      setUsernameError(`Username must be 3-30 characters (current: ${username.length})`)
    } else {
      setUsernameError('')
    }
  }, [username])

  // 🔍 Check username availability with debounce
  useEffect(() => {
    const check = async () => {
      if (!username.trim() || usernameError) {
        setUsernameAvailable(null)
        return
      }
      setCheckingUsername(true)
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/check-username/${username}`)
        setUsernameAvailable(data.available)
      } catch (err) {
        console.error(err)
      } finally {
        setCheckingUsername(false)
      }
    }

    const timeout = setTimeout(check, 500) // wait 0.5s after typing
    return () => clearTimeout(timeout)
  }, [username, backendUrl])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Forgot Password') {
        const { data } = await axios.post(backendUrl + '/api/user/forgot-password', { email })
        if (data.success) {
          toast.success('Password reset link sent to your email!')
          setState('Reset Password')
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Reset Password') {
        // Validate password match
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          return
        }

        // Validate password strength
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters long')
          return
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
        if (!passwordRegex.test(password)) {
          toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
          return
        }

        const { data } = await axios.post(backendUrl + '/api/user/reset-password', { 
          token: resetToken, 
          newPassword: password 
        })
        if (data.success) {
          toast.success('Password reset successful! You can now login.')
          setState('Login')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          setResetToken('')
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Sign Up') {
        // Validate name length
        if (name.length < 2 || name.length > 50) {
          toast.error('Name must be between 2 and 50 characters')
          return
        }

        // Validate username length
        if (username.length < 3 || username.length > 30) {
          toast.error('Username must be between 3 and 30 characters')
          return
        }

        // prevent submission if username already taken
        if (usernameAvailable === false) {
          toast.error('Username already taken')
          return
        }

        // Validate Gmail only
        if (!email.toLowerCase().endsWith('@gmail.com')) {
          toast.error('Please use a valid Gmail address')
          return
        }

        // Validate password match
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          return
        }

        // Validate password strength before sending verification code
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters long')
          return
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
        if (!passwordRegex.test(password)) {
          toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
          return
        }

        // Send verification code
        const { data } = await axios.post(backendUrl + '/api/user/send-verification', { email })
        if (data.success) {
          toast.success('Verification code sent to your email!')
          setPendingSignupData({ name, username, email, password })
          setState('Verify Email')
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Verify Email') {
        // Verify code and complete registration
        const { data } = await axios.post(backendUrl + '/api/user/register', {
          ...pendingSignupData,
          verificationCode
        })
        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          toast.success('Email verified! Welcome to BookWormed!')
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500 max-h-[90vh] overflow-y-auto"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">{state}</h1>
        <p className="text-center text-sm">
          {state === 'Forgot Password' 
            ? 'Enter your email to receive a reset link'
            : state === 'Reset Password'
            ? 'Enter the token from your email and new password'
            : state === 'Verify Email'
            ? 'Enter the 6-digit code sent to your email'
            : 'Welcome! Please sign in to continue'}
        </p>

        {state === 'Sign Up' && (
          <>
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
              <img className="h-5" src={assets.profile_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="outline-none text-sm"
                placeholder="Full name"
                maxLength="50"
                required
              />
            </div>
            {nameError && (
              <p className="text-xs mt-1 text-red-600">
                {nameError}
              </p>
            )}

            {/* 🧍 Username input */}
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
              <img className="h-5" src={assets.profile_icon} alt="" />
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                className="outline-none text-sm"
                placeholder="Choose a username"
                maxLength="30"
                required
              />
            </div>
            {usernameError && (
              <p className="text-xs mt-1 text-red-600">
                {usernameError}
              </p>
            )}
            {username && !usernameError && (
              <p
                className={`text-xs mt-1 ${
                  usernameAvailable === null
                    ? 'text-gray-400'
                    : usernameAvailable
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {checkingUsername
                  ? 'Checking...'
                  : usernameAvailable === null
                  ? ''
                  : usernameAvailable
                  ? 'Username available ✓'
                  : 'Username already taken ✗'}
              </p>
            )}
          </>
        )}

        {(state === 'Sign Up' || state === 'Forgot Password' || state === 'Login') && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.email_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="outline-none text-sm"
              placeholder={state === 'Sign Up' ? 'Email id (Gmail only)' : 'Email id'}
              required
            />
          </div>
        )}

        {(state === 'Sign Up' || state === 'Login') && (
          <>
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="outline-none text-sm"
                placeholder="Password"
                required
              />
            </div>
            {state === 'Sign Up' && (
              <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                <img src={assets.lock_icon} alt="" />
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type="password"
                  className="outline-none text-sm"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            )}
          </>
        )}

        {state === 'Reset Password' && (
          <>
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={(e) => setResetToken(e.target.value)}
                value={resetToken}
                type="text"
                className="outline-none text-sm"
                placeholder="Reset Token from Email"
                required
              />
            </div>
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="outline-none text-sm"
                placeholder="New Password"
                required
              />
            </div>
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                className="outline-none text-sm"
                placeholder="Confirm New Password"
                required
              />
            </div>
          </>
        )}

        {state === 'Verify Email' && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setVerificationCode(e.target.value)}
              value={verificationCode}
              type="text"
              className="outline-none text-sm"
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </div>
        )}

        {state === 'Login' && (
          <p 
            className="text-sm text-blue-600 my-4 cursor-pointer hover:underline" 
            onClick={() => setState('Forgot Password')}
          >
            Forgot Password?
          </p>
        )}

        <button className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
          {state === 'Login' 
            ? 'Login' 
            : state === 'Forgot Password' 
            ? 'Send Reset Link' 
            : state === 'Reset Password' 
            ? 'Reset Password' 
            : state === 'Verify Email'
            ? 'Verify Email'
            : 'Send Verification Code'}
        </button>

        {state === 'Login' ? (
          <p className="mt-5 text-center">
            Don't have an account?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Sign Up')}>
              Sign up
            </span>
          </p>
        ) : state === 'Forgot Password' ? (
          <p className="mt-5 text-center">
            Remember your password?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>
              Log in
            </span>
          </p>
        ) : state === 'Reset Password' ? (
          <p className="mt-5 text-center">
            Back to{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>
              Log in
            </span>
          </p>
        ) : state === 'Verify Email' ? (
          <p className="mt-5 text-center">
            Didn't receive code?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Sign Up')}>
              Resend
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>
              Log in
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  )
}

export default Login
