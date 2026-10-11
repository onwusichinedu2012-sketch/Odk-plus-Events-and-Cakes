'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/admin')
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email first')
      return
    }
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://odk-plus-events-and-cakes-eta.vercel.app/login',
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a reset link!')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Admin Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.75rem', background: '#000', color: '#fff', border: 'none' }}>
          Log In
        </button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button 
          onClick={handleResetPassword}
          style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  )
}
