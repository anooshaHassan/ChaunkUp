CREATE TABLE IF NOT EXISTS checks (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_type VARCHAR(10) NOT NULL,
  input_text TEXT NOT NULL,
  verdict VARCHAR(20) NOT NULL CHECK (verdict IN ('scam', 'suspicious', 'safe')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  scam_type VARCHAR(100) NOT NULL,
  red_flags JSONB NOT NULL DEFAULT '[]',
  explanation_en TEXT NOT NULL,
  explanation_ur TEXT NOT NULL,
  explanation_roman TEXT NOT NULL,
  recommended_actions JSONB NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_checks_created_at ON checks(created_at DESC);
