import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting weekly challenges reset...');

    // Deactivate old challenges
    const { error: deactivateError } = await supabase
      .from('challenges')
      .update({ is_active: false })
      .lt('end_date', new Date().toISOString());

    if (deactivateError) {
      throw deactivateError;
    }

    console.log('Old challenges deactivated');

    // Calculate next week dates
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Create new weekly challenges
    const newChallenges = [
      {
        title: 'Maratona Semanal',
        description: 'Complete 5 aulas esta semana',
        icon: 'Zap',
        challenge_type: 'lessons_completed',
        target_value: 5,
        reward_points: 100,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        difficulty: 'easy',
        is_active: true,
      },
      {
        title: 'Explorador Ativo',
        description: 'Complete 10 aulas esta semana',
        icon: 'Rocket',
        challenge_type: 'lessons_completed',
        target_value: 10,
        reward_points: 250,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        difficulty: 'medium',
        is_active: true,
      },
      {
        title: 'Super Aprendiz',
        description: 'Complete 15 aulas esta semana',
        icon: 'Flame',
        challenge_type: 'lessons_completed',
        target_value: 15,
        reward_points: 500,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        difficulty: 'hard',
        is_active: true,
      },
      {
        title: 'Voz da Comunidade',
        description: 'Faça 5 comentários esta semana',
        icon: 'MessageSquare',
        challenge_type: 'comments_created',
        target_value: 5,
        reward_points: 75,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        difficulty: 'easy',
        is_active: true,
      },
      {
        title: 'Crítico da Semana',
        description: 'Avalie 3 trilhas esta semana',
        icon: 'Star',
        challenge_type: 'reviews_created',
        target_value: 3,
        reward_points: 150,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        difficulty: 'medium',
        is_active: true,
      },
      {
        title: 'Conquistador Total',
        description: 'Complete todos os desafios da semana',
        icon: 'Trophy',
        challenge_type: 'special_all_challenges',
        target_value: 5,
        reward_points: 1000,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        difficulty: 'hard',
        is_active: true,
      },
    ];

    const { error: insertError } = await supabase
      .from('challenges')
      .insert(newChallenges);

    if (insertError) {
      throw insertError;
    }

    console.log(`Created ${newChallenges.length} new challenges`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Weekly challenges reset completed. Created ${newChallenges.length} new challenges.`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in weekly-challenges-reset:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
