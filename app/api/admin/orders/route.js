import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM orders ORDER BY id DESC"
  );

  return new Response(JSON.stringify(result.rows), {
    headers: { "Content-Type": "application/json" },
  });
}
