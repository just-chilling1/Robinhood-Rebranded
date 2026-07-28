-- Seed initial data for RH

-- Insert niches
INSERT INTO public.niches (name, description, icon) VALUES
  ('Weight Loss', 'Help people achieve their fitness goals with proven weight loss solutions', '🏃'),
  ('Make Money Online', 'Share opportunities for earning income from home', '💰'),
  ('Dating & Relationships', 'Guide people to better relationships and dating success', '❤️'),
  ('Health & Wellness', 'Promote products that improve overall health and wellbeing', '🌿'),
  ('Personal Development', 'Help people grow and achieve their full potential', '🚀'),
  ('Technology & Gadgets', 'Review the latest tech products and innovations', '📱')
ON CONFLICT DO NOTHING;

-- Insert sample offers (using niche IDs)
INSERT INTO public.offers (niche_id, title, description, commission_rate, affiliate_network)
SELECT 
  n.id,
  'Ultimate Weight Loss System',
  'Proven 12-week program that helps people lose 20-50 pounds safely',
  '50% per sale ($47 product)',
  'DigiStore24'
FROM public.niches n WHERE n.name = 'Weight Loss'
ON CONFLICT DO NOTHING;

INSERT INTO public.offers (niche_id, title, description, commission_rate, affiliate_network)
SELECT 
  n.id,
  'Affiliate Marketing Masterclass',
  'Complete training on building a profitable affiliate business',
  '40% per sale ($197 product)',
  'DigiStore24'
FROM public.niches n WHERE n.name = 'Make Money Online'
ON CONFLICT DO NOTHING;

INSERT INTO public.offers (niche_id, title, description, commission_rate, affiliate_network)
SELECT 
  n.id,
  'Text Chemistry Formula',
  'Texting secrets that make men obsess over you',
  '75% per sale ($67 product)',
  'DigiStore24'
FROM public.niches n WHERE n.name = 'Dating & Relationships'
ON CONFLICT DO NOTHING;

-- Insert training videos
INSERT INTO public.videos (title, description, duration, thumbnail_url, video_url, category, upgrade_required) VALUES
  ('Getting Started with RH', 'Learn how to generate your first comment pack in under 5 minutes', '4:32', '/placeholder.svg?height=180&width=320', '#', 'Getting Started', 'free'),
  ('Choosing Profitable Niches', 'Discover which niches convert best for beginners', '8:15', '/placeholder.svg?height=180&width=320', '#', 'Strategy', 'free'),
  ('Traffic Generation Basics', 'Free traffic methods that work in 2025', '12:45', '/placeholder.svg?height=180&width=320', '#', 'Traffic', 'free'),
  ('Advanced SEO Tactics', 'Rank your pages on Google in 30 days', '15:20', '/placeholder.svg?height=180&width=320', '#', 'Advanced', 'dfy_vault'),
  ('Paid Traffic Mastery', 'Scale to $1000/day with Facebook ads', '22:10', '/placeholder.svg?height=180&width=320', '#', 'Advanced', 'instant_income')
ON CONFLICT DO NOTHING;

-- Insert testimonials
INSERT INTO public.testimonials (user_name, user_avatar, content, earnings) VALUES
  ('Sarah M.', '/placeholder.svg?height=48&width=48', 'I made my first $500 in just 2 weeks! This system actually works.', '$2,347'),
  ('Mike T.', '/placeholder.svg?height=48&width=48', 'Finally, something that delivers on its promises. Generated 3 pages and already seeing commissions.', '$1,892'),
  ('Jennifer L.', '/placeholder.svg?height=48&width=48', 'As a complete beginner, I was nervous. But the step-by-step process made it so easy!', '$4,521'),
  ('David R.', '/placeholder.svg?height=48&width=48', 'This is the real deal. No fluff, just results. Highly recommend!', '$3,156')
ON CONFLICT DO NOTHING;
