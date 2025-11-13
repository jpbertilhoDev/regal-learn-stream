-- Add category column to trails table
ALTER TABLE public.trails ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing trails with default category
UPDATE public.trails SET category = 'geral' WHERE category IS NULL;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_trails_category ON public.trails(category);

-- Insert Ecossistema trails
INSERT INTO public.trails (slug, title, description, category, thumbnail_url, duration, lessons_count, order_index)
VALUES
  (
    'ecossistema-blockchain',
    'Fundamentos de Blockchain',
    'Entenda os conceitos fundamentais da tecnologia blockchain e seu impacto no ecossistema digital.',
    'ecossistema',
    '/placeholder-blockchain.jpg',
    180,
    6,
    10
  ),
  (
    'ecossistema-web3',
    'Introdução ao Web3',
    'Explore o mundo descentralizado do Web3 e suas aplicações práticas no ecossistema moderno.',
    'ecossistema',
    '/placeholder-web3.jpg',
    150,
    5,
    11
  ),
  (
    'ecossistema-nfts',
    'NFTs e Tokens Digitais',
    'Aprenda sobre NFTs, tokens e como eles estão transformando o ecossistema de ativos digitais.',
    'ecossistema',
    '/placeholder-nfts.jpg',
    120,
    4,
    12
  );

-- Insert Financeiro trails
INSERT INTO public.trails (slug, title, description, category, thumbnail_url, duration, lessons_count, order_index)
VALUES
  (
    'financeiro-investimentos',
    'Fundamentos de Investimentos',
    'Aprenda os princípios básicos de investimentos e como construir seu patrimônio financeiro.',
    'financeiro',
    '/placeholder-investments.jpg',
    200,
    8,
    20
  ),
  (
    'financeiro-criptomoedas',
    'Investindo em Criptomoedas',
    'Guia completo para investir em criptomoedas com segurança e estratégia financeira.',
    'financeiro',
    '/placeholder-crypto.jpg',
    165,
    6,
    21
  ),
  (
    'financeiro-gestao',
    'Gestão Financeira Pessoal',
    'Domine as técnicas de gestão financeira pessoal para alcançar seus objetivos financeiros.',
    'financeiro',
    '/placeholder-finance.jpg',
    140,
    5,
    22
  );

-- Create modules for new trails (2 per trail)
INSERT INTO public.modules (trail_id, title, description, order_index)
SELECT
  t.id,
  'Módulo Introdutório',
  'Comece sua jornada com os conceitos fundamentais',
  1
FROM public.trails t
WHERE t.category IN ('ecossistema', 'financeiro');

INSERT INTO public.modules (trail_id, title, description, order_index)
SELECT
  t.id,
  'Módulo Avançado',
  'Aprofunde seus conhecimentos com práticas avançadas',
  2
FROM public.trails t
WHERE t.category IN ('ecossistema', 'financeiro');

-- Create lessons for new modules (3 per module)
INSERT INTO public.lessons (module_id, title, description, video_duration, order_index)
SELECT
  m.id,
  'Aula ' || s.generate_series || ': ' || CASE
    WHEN s.generate_series = 1 THEN 'Introdução'
    WHEN s.generate_series = 2 THEN 'Conceitos Principais'
    WHEN s.generate_series = 3 THEN 'Aplicação Prática'
  END,
  CASE
    WHEN s.generate_series = 1 THEN 'Aprenda os fundamentos e prepare-se para a jornada.'
    WHEN s.generate_series = 2 THEN 'Explore os conceitos principais e entenda como aplicá-los.'
    WHEN s.generate_series = 3 THEN 'Coloque em prática o que você aprendeu com exercícios reais.'
  END,
  1800, -- 30 minutes
  s.generate_series
FROM public.modules m
CROSS JOIN generate_series(1, 3) AS s(generate_series)
WHERE m.trail_id IN (
  SELECT id FROM public.trails WHERE category IN ('ecossistema', 'financeiro')
);
