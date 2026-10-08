import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  // Fetch all cakes
  const { data: cakes } = await supabase.from('cakes').select('*').order('id', { ascending: false })

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <Link href="/login" style={{ color: 'red' }}>Logout</Link>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Add New Cake</h2>
        <p>Use the form below to add cakes directly to your website.</p>
        {/* We will add the form here in the next step! */}
        <p><em>(Form coming next...)</em></p>
      </div>

      <h2>Your Cakes ({cakes?.length || 0})</h2>
      {cakes?.map((cake: any) => (
        <div key={cake.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
          <h3>{cake.name}</h3>
          <p>Price: ₦{Number(cake.price).toLocaleString()}</p>
          <small>ID: {cake.id}</small>
        </div>
      ))}
    </div>
  )
}
