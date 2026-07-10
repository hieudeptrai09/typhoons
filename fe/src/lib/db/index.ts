import postgres from "postgres";

const client = postgres(process.env.SUPABASE_POSTGRES_URL!, {
  // Supabase's pooled connection (pgbouncer, transaction mode) doesn't support prepared statements, so they must be disabled here.
  prepare: false,
  // The typhoon tables live in the catfisha_typhoons schema, not public.
  connection: {
    search_path: "catfisha_typhoons, public",
  },
});

const sql = {
  query: (query: string, params: unknown[] = []) => client.unsafe(query, params),
};

export default sql;
