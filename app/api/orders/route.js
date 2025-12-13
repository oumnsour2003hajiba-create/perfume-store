import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  const body = await request.json();

  const {
    customer_name,
    phone,
    city,
    address,
    product_id,
    size,
    price
  } = body;

  await pool.query(
    `INSERT INTO orders (customer_name, phone, city, address, product_id, size, price)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [customer_name, phone, city, address, product_id, size, price]
  );

  return new Response(
    JSON.stringify({ success: true }),
    { status: 201 }
  );
}

