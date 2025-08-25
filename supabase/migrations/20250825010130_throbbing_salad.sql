/*
  # Initial Photography Business Management Schema

  1. New Tables
    - `profiles` - User profile and business information
    - `clients` - Client management
    - `packages` - Service packages
    - `add_ons` - Additional services
    - `projects` - Photography projects
    - `leads` - Lead management
    - `transactions` - Financial transactions
    - `team_members` - Freelancer management
    - `cards` - Payment cards/accounts
    - `assets` - Equipment and asset tracking
    - `contracts` - Contract management
    - `client_feedback` - Client satisfaction feedback
    - `promo_codes` - Promotional codes

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text NOT NULL,
  website text,
  address text,
  bank_account text,
  authorized_signer text,
  id_number text,
  bio text,
  brand_color text DEFAULT '#3b82f6',
  logo_base64 text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  instagram text,
  client_type text NOT NULL DEFAULT 'Langsung',
  status text NOT NULL DEFAULT 'Aktif',
  since date NOT NULL DEFAULT CURRENT_DATE,
  last_contact timestamptz DEFAULT now(),
  portal_access_id uuid DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  processing_time text NOT NULL DEFAULT '30 hari kerja',
  photographers text,
  videographers text,
  physical_items jsonb DEFAULT '[]',
  digital_items jsonb DEFAULT '[]',
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add-ons table
CREATE TABLE IF NOT EXISTS add_ons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_name text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  project_type text NOT NULL,
  package_id uuid REFERENCES packages(id) ON DELETE SET NULL,
  package_name text NOT NULL,
  add_ons jsonb DEFAULT '[]',
  date date NOT NULL,
  deadline_date date,
  location text NOT NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'Dikonfirmasi',
  active_sub_statuses jsonb,
  total_cost numeric NOT NULL DEFAULT 0,
  amount_paid numeric DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Belum Bayar',
  team jsonb DEFAULT '[]',
  notes text,
  accommodation text,
  drive_link text,
  client_drive_link text,
  final_drive_link text,
  start_time text,
  end_time text,
  image text,
  revisions jsonb,
  promo_code_id uuid,
  discount_amount numeric,
  shipping_details text,
  dp_proof_url text,
  printing_details jsonb,
  printing_cost numeric,
  transport_cost numeric,
  booking_status text,
  rejection_reason text,
  chat_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  contact_channel text NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'Sedang Diskusi',
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  whatsapp text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  category text NOT NULL,
  method text NOT NULL DEFAULT 'Transfer Bank',
  pocket_id uuid,
  card_id uuid,
  printing_item_id text,
  vendor_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  standard_fee numeric NOT NULL DEFAULT 0,
  no_rek text,
  reward_balance numeric DEFAULT 0,
  rating numeric DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
  performance_notes jsonb DEFAULT '[]',
  portal_access_id uuid DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_holder_name text NOT NULL,
  bank_name text NOT NULL,
  card_type text NOT NULL,
  last_four_digits text NOT NULL,
  expiry_date text,
  balance numeric DEFAULT 0,
  color_gradient text NOT NULL DEFAULT 'from-blue-500 to-sky-400',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  purchase_date date NOT NULL,
  purchase_price numeric NOT NULL DEFAULT 0,
  serial_number text,
  status text NOT NULL DEFAULT 'Tersedia',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contract_number text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  signing_date date NOT NULL,
  signing_location text NOT NULL,
  client_name1 text NOT NULL,
  client_address1 text NOT NULL,
  client_phone1 text NOT NULL,
  client_name2 text,
  client_address2 text,
  client_phone2 text,
  shooting_duration text NOT NULL,
  guaranteed_photos text NOT NULL,
  album_details text NOT NULL,
  digital_files_format text NOT NULL DEFAULT 'JPG High-Resolution',
  other_items text NOT NULL,
  personnel_count text NOT NULL,
  delivery_timeframe text NOT NULL DEFAULT '30 hari kerja',
  dp_date date NOT NULL,
  final_payment_date date NOT NULL,
  cancellation_policy text NOT NULL,
  jurisdiction text NOT NULL,
  vendor_signature text,
  client_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Client feedback table
CREATE TABLE IF NOT EXISTS client_feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  satisfaction text NOT NULL,
  feedback text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  discount_type text NOT NULL,
  discount_value numeric NOT NULL,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  max_usage integer,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for clients
CREATE POLICY "Users can manage own clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for packages
CREATE POLICY "Users can manage own packages"
  ON packages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Public read access for packages (for public booking forms)
CREATE POLICY "Public can read packages"
  ON packages
  FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for add_ons
CREATE POLICY "Users can manage own add_ons"
  ON add_ons
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Public read access for add_ons
CREATE POLICY "Public can read add_ons"
  ON add_ons
  FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for projects
CREATE POLICY "Users can manage own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for leads
CREATE POLICY "Users can manage own leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Public insert access for leads (for public lead forms)
CREATE POLICY "Public can insert leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for transactions
CREATE POLICY "Users can manage own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for team_members
CREATE POLICY "Users can manage own team_members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for cards
CREATE POLICY "Users can manage own cards"
  ON cards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for assets
CREATE POLICY "Users can manage own assets"
  ON assets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for contracts
CREATE POLICY "Users can manage own contracts"
  ON contracts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for client_feedback
CREATE POLICY "Users can manage own client_feedback"
  ON client_feedback
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Public insert access for client feedback
CREATE POLICY "Public can insert client_feedback"
  ON client_feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for promo_codes
CREATE POLICY "Users can manage own promo_codes"
  ON promo_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Public read access for promo_codes (for public forms)
CREATE POLICY "Public can read active promo_codes"
  ON promo_codes
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_client_feedback_user_id ON client_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_user_id ON promo_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- Create unique constraints
ALTER TABLE profiles ADD CONSTRAINT unique_user_profile UNIQUE (user_id);
ALTER TABLE clients ADD CONSTRAINT unique_portal_access UNIQUE (portal_access_id);
ALTER TABLE team_members ADD CONSTRAINT unique_team_portal_access UNIQUE (portal_access_id);
ALTER TABLE promo_codes ADD CONSTRAINT unique_promo_code UNIQUE (user_id, code);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_add_ons_updated_at BEFORE UPDATE ON add_ons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_feedback_updated_at BEFORE UPDATE ON client_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();