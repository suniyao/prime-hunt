import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { name, score } = await req.json()

  if (!name || typeof score !== 'number') {
    return new Response('Invalid input', { status: 400 })
  }

  const { error } = await supabase
    .from('scores')
    .insert([{ name, score }])

  if (error) {
    return new Response('Error saving score', { status: 500 })
  }

  return new Response('Score submitted')
}
