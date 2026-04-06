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
      "SELECT id, book_id as bookId, member_id as memberId, borrow_date as borrowDate, due_date as dueDate, return_date as returnDate, status, fine_amount as fineAmount, notes, created_at as createdAt FROM transactions ORDER BY borrow_date DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bookId, memberId, borrowDate, dueDate, status, notes } =
      await request.json();

    if (!bookId || !memberId || !borrowDate || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO transactions (book_id, member_id, borrow_date, due_date, status, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, book_id as bookId, member_id as memberId, borrow_date as borrowDate, due_date as dueDate, return_date as returnDate, status, fine_amount as fineAmount, notes, created_at as createdAt",
      [bookId, memberId, borrowDate, dueDate, status || "BORROWED", notes]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
