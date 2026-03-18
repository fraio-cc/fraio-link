CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_links_short_code ON links(short_code);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_created_at ON links(created_at DESC);

CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2),
  city VARCHAR(100)
);

CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_clicked_at ON link_clicks(clicked_at DESC);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active links" ON links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create links" ON links
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert clicks" ON link_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view clicks for their links" ON link_clicks
  FOR SELECT USING (
    link_id IN (SELECT id FROM links WHERE user_id = auth.uid())
  );
