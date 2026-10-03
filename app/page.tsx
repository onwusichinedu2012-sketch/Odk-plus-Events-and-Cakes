import { supabase } from '../lib/supabase'

export default async function Home() {
  // This tests if Supabase is connected
  const { data, error } = await supabase.from('cakes').select('*')

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>ODK Plus Events & Cakes</h1>
      
      {error ? (
        <p style={{ color: 'red' }}> Error: {error.message}</p>
      ) : (
        <div>
          <p style={{ color: 'green', fontSize: '1.2rem' }}>✅ Supabase Connected!</p>
          <p>Ready to build your cake business app.</p>
        </div>
      )}
    </main>
  )
}
