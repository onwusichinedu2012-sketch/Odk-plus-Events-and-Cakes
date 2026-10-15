'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [cakes, setCakes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
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

  const handleAddCake = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Adding cake...')
    
    const { error } = await supabase
      .from('cakes')
      .insert([
        { 
          name, 
          description, 
          price: parseFloat(price), 
          image_url: imageUrl 
        }
      ])

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Cake added successfully!')
      // Clear the form
      setName('')
      setDescription('')
      setPrice('')
      setImageUrl('')
      
      // Refresh the list of cakes
      const { data: newCakes } = await supabase.from('cakes').select('*').order('id', { ascending: false })
      if (newCakes) setCakes(newCakes)
    }
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

      {/* ADD CAKE FORM */}
      <div style={{ background: '#f0f8ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ccc' }}>
        <h2>Add New Cake</h2>
        {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
        
        <form onSubmit={handleAddCake} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Cake Name (e.g., Wedding Cake)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ padding: '0.75rem', fontSize: '1rem' }}
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            style={{ padding: '0.75rem', fontSize: '1rem' }}
          />
          <input 
            type="number" 
            placeholder="Price (e.g., 50000)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
            style={{ padding: '0.75rem', fontSize: '1rem' }}
          />
          <input 
            type="url" 
            placeholder="Image URL (paste link here)" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            required 
            style={{ padding: '0.75rem', fontSize: '1rem' }}
          />
          <button type="submit" style={{ padding: '1rem', background: '#0070f3', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px' }}>
            Add Cake
          </button>
        </form>
      </div>

      {/* CAKE LIST */}
      <h2>Your Cakes ({cakes.length})</h2>
      {cakes.map((cake: any) => (
        <div key={cake.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
          <h3>{cake.name}</h3>
          <p>{cake.description}</p>
          <p>Price: ₦{Number(cake.price).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
