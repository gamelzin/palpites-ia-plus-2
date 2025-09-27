import { createClient } from "@supabase/supabase-js";

// Cliente público (anon) → usado no frontend
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Cliente admin (service_role) → usado em jobs
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
