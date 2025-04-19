-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'spam')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Add a function to automatically update the updated_at field
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to call the function when a row is updated
CREATE TRIGGER trigger_update_contact_submissions_updated_at
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE PROCEDURE update_contact_submissions_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users with admin role to see all submissions
CREATE POLICY "Admins can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Allow authenticated users with admin role to insert, update and delete submissions
CREATE POLICY "Admins can manage all contact submissions"
  ON contact_submissions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Allow authenticated staff to view all submissions
CREATE POLICY "Staff can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'staff');

-- Allow unauthenticated users to insert new submissions
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website'; 