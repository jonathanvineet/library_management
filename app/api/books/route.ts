import { NextRequest, NextResponse } from "next/server";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:tkt@vav@vj@u1@db.hnpgjwbhndackowriqau.supabase.co:5432/postgres?sslmode=require",
});

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at FROM books ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, author, isbn, category, totalCopies, availableCopies, returnPeriodDays } =
      await request.json();

    if (!title || !author || !totalCopies) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO books (title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id, title, author, isbn, genre, total_copies, available_copies, return_period_days, created_at",
      [
        title,
        author,
        isbn,
        category,
        totalCopies,
        availableCopies || totalCopies,
        returnPeriodDays || 14,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
