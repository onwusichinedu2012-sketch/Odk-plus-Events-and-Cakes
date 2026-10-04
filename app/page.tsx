import { supabase } from '../lib/supabase'

export default async function Home() {
  // Fetch all cakes from the database
  const { data: cakes, error } = await supabase.from('cakes').select('*')

  if (error) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>ODK Plus Events & Cakes</h1>
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>ODK Plus Events & Cakes</h1>
      <p style={{ color: 'green', textAlign: 'center' }}>✅ Supabase Connected!</p>

      <h2>Our Menu</h2>

      {cakes && cakes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {cakes.map((cake: any) => (
            <div key={cake.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {cake.image_url && (
                <img
                  src={cake.image_url}
                  alt={cake.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
                />
              )}
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{cake.name}</h3>
              <p style={{ color: '#666', margin: '0 0 1rem 0' }}>{cake.description}</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
                ₦{Number(cake.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No cakes found. Add some in Supabase!</p>
      )}
    </main>
  )
}
