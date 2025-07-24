import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('scores')
    .select('name, score')
    .order('score', { ascending: false })
    .limit(20)

  if (error) {
    return new Response('Error fetching leaderboard', { status: 500 })
  }

  return Response.json(data)
}
