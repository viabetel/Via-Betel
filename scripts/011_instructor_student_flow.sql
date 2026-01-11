-- SPRINT 1: Modelo de Dados Completo para Fluxo Aluno->Instrutor

-- 1) Tabela profiles (existente, adicionar campos se necessário)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'ADMIN')) DEFAULT 'STUDENT',
  instructor_status TEXT CHECK (instructor_status IN ('NONE', 'STARTED', 'PROFILE_DONE', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED')) DEFAULT 'NONE',
  instructor_rejection_reason TEXT,
  banned_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2) Tabela instructor_profiles (1:1 com profiles)
CREATE TABLE IF NOT EXISTS instructor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  categories TEXT[] DEFAULT '{}',
  bio TEXT,
  price_hour NUMERIC,
  service_areas JSONB DEFAULT '{}',
  availability_json JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3) Tabela documents (para upload de verificação)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('ID', 'CERTIFICATE', 'BACKGROUND_CHECK')) NOT NULL,
  storage_path TEXT NOT NULL,
  status TEXT CHECK (status IN ('UNDER_REVIEW', 'APPROVED', 'REJECTED')) DEFAULT 'UNDER_REVIEW',
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4) Índices para performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_instructor_status ON profiles(instructor_status);
CREATE INDEX idx_instructor_profiles_user_id ON instructor_profiles(user_id);
CREATE INDEX idx_documents_owner_id ON documents(owner_id);
CREATE INDEX idx_documents_status ON documents(status);

-- 5) RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário lê/edita próprio (exceto role/status que só admin)
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()) AND instructor_status = (SELECT instructor_status FROM profiles WHERE id = auth.uid()));

-- InstructorProfiles: usuário lê/edita próprio; público vê se VERIFIED e is_public
CREATE POLICY "users_read_own_instructor_profile" ON instructor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_update_own_instructor_profile" ON instructor_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "public_read_verified_instructor_profiles" ON instructor_profiles FOR SELECT USING (
  is_public = TRUE AND user_id IN (SELECT id FROM profiles WHERE instructor_status = 'VERIFIED')
);

-- Documents: owner e admin veem/editam
CREATE POLICY "users_read_own_documents" ON documents FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "users_insert_own_documents" ON documents FOR INSERT WITH CHECK (auth.uid() = owner_id);
