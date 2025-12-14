// app/api/orders/route.js

import { Pool } from 'pg';
import { NextResponse } from 'next/server';

// Initialize the PostgreSQL connection pool
// This uses the DATABASE_URL environment variable on Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      phone,
      city,
      address,
      product_id,
      size,
      price // This is the total price passed from the front-end
    } = body;
    
    // Validate required fields
    if (!customer_name || !phone || !price) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert the order into the 'orders' table
    await pool.query(
      `INSERT INTO orders (customer_name, phone, city, address, product_id, size, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customer_name, phone, city, address, product_id || 1, size || '100ml', price]
    );

    // Success response
    return NextResponse.json(
      { success: true, message: "Order saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    // Error response
    return NextResponse.json(
      { success: false, error: 'Failed to save order to database.' },
      { status: 500 }
    );
  }
}