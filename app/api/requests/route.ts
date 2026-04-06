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
      "SELECT id, book_id as bookId, user_id as userId, status, requested_at as requestDate, processed_at as responseDate FROM book_requests ORDER BY requested_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bookId, userId } = await request.json();

    if (!bookId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO book_requests (book_id, user_id, status, requested_at) VALUES ($1, $2, $3, NOW()) RETURNING id, book_id as bookId, user_id as userId, status, requested_at as requestDate, processed_at as responseDate",
      [bookId, userId, "PENDING"]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
