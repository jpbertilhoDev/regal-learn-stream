import { createClient } from 'jsr:@supabase/supabase-js@2';

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

    console.log('Starting weekly challenge reset...');

    // Deactivate old challenges
    const { error: deactivateError } = await supabase
      .from('challenges')
      .update({ is_active: false })
      .lt('end_date', new Date().toISOString());

    if (deactivateError) {
      console.error('Error deactivating old challenges:', deactivateError);
      throw deactivateError;
    }

    // Calculate next week's dates
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const dayOfWeek = startDate.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // Next Monday
    startDate.setDate(startDate.getDate() + daysUntilMonday);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    console.log('Creating challenges for:', {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    });

    // Define this week's challenges with variety
    const challengeTemplates = [
      {
        title: 'Maratona Semanal',
        description: 'Complete 5 aulas esta semana',
        icon: 'Zap',
        challenge_type: 'lessons_completed',
        target_value: 5,
        reward_points: 100,
        difficulty: 'easy'
      },
      {
        title: 'Explorador Ativo',
        description: 'Complete 10 aulas esta semana',
        icon: 'Rocket',
        challenge_type: 'lessons_completed',
        target_value: 10,
        reward_points: 250,
        difficulty: 'medium'
      },
      {
        title: 'Mestre do Conhecimento',
        description: 'Complete 15 aulas esta semana',
        icon: 'Brain',
        challenge_type: 'lessons_completed',
        target_value: 15,
        reward_points: 500,
        difficulty: 'hard'
      },
      {
        title: 'Voz da Comunidade',
        description: 'Faça 5 comentários esta semana',
        icon: 'MessageSquare',
        challenge_type: 'comments_created',
        target_value: 5,
        reward_points: 75,
        difficulty: 'easy'
      },
      {
        title: 'Crítico da Semana',
        description: 'Avalie 3 trilhas esta semana',
        icon: 'Star',
        challenge_type: 'reviews_created',
        target_value: 3,
        reward_points: 150,
        difficulty: 'medium'
      },
      {
        title: 'Engajamento Total',
        description: 'Faça 10 comentários esta semana',
        icon: 'Users',
        challenge_type: 'comments_created',
        target_value: 10,
        reward_points: 200,
        difficulty: 'hard'
      }
    ];

    // Randomly select 4 challenges for this week
    const shuffled = challengeTemplates.sort(() => 0.5 - Math.random());
    const selectedChallenges = shuffled.slice(0, 4);

    // Insert new challenges
    const challengesToInsert = selectedChallenges.map(template => ({
      ...template,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: true
    }));

    const { data: newChallenges, error: insertError } = await supabase
      .from('challenges')
      .insert(challengesToInsert)
      .select();

    if (insertError) {
      console.error('Error creating new challenges:', insertError);
      throw insertError;
    }

    console.log('Successfully created', newChallenges?.length, 'new challenges');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Weekly challenges reset successfully',
        challengesCreated: newChallenges?.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in weekly challenge reset:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
