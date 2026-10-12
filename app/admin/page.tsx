'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [cakes, setCakes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If not logged in, kick back to login page
      if (!session) {
        router.push('/login')
      } else {
        // If logged in, fetch the cakes
        const { data } = await supabase.from('cakes').select('*').order('id', { ascending: false })
        if (data) setCakes(data)
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div style={{padding: '2rem'}}>Loading dashboard...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
          Logout
        </button>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Welcome, Admin!</h2>
        <p>You are successfully logged in.</p>
      </div>

      <h2>Your Cakes ({cakes.length})</h2>
      {cakes.map((cake: any) => (
        <div key={cake.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
          <h3>{cake.name}</h3>
          <p>Price: ₦{Number(cake.price).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
