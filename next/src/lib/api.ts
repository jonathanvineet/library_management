import { supabase } from "@/lib/supabase";

type ApiResponse<T = any> = {
  ok: boolean;
  status: number;
  json: () => Promise<T>;
};

const buildResponse = <T,>(data: T, status = 200): ApiResponse<T> => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

const buildError = (message: string, status = 400): ApiResponse<{ error: string }> =>
  buildResponse({ error: message }, status);

const normalizeRole = (role?: string | null) => (role || "member").toUpperCase();
const normalizeStatus = (status?: string | null) => (status || "pending").toUpperCase();

const toBookView = (book: any) => ({
  ...book,
  publicationYear: book.publication_year,
  totalCopies: book.total_copies,
  availableCopies: book.available_copies,
  coverImageUrl: book.cover_image_url,
  available: (book.available_copies ?? 0) > 0,
});

const toMemberView = (member: any, userByEmail: Record<string, any>) => {
  const user = member?.email ? userByEmail[member.email.toLowerCase()] : null;
  return {
    ...member,
    membershipDate: member.membership_date,
    maxBooksAllowed: member.max_books_allowed,
    user: user
      ? {
          ...user,
          fullName: user.full_name,
          role: normalizeRole(user.role),
        }
      : null,
  };
};

const getUsersByEmail = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, full_name, email, role, enabled");

  if (error) throw new Error(error.message);

  return (data || []).reduce((acc: Record<string, any>, user: any) => {
    if (user.email) {
      acc[user.email.toLowerCase()] = user;
    }
    return acc;
  }, {});
};

const getCurrentAppUser = async () => {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    throw new Error("Not authenticated");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, username, full_name, email, role, enabled")
    .eq("id", authUser.id)
    .maybeSingle();

  return {
    authUser,
    profile,
  };
};

const resolveMemberForUserEmail = async (email?: string | null) => {
  if (!email) throw new Error("User email is missing");

  const { data: existingMember, error: memberError } = await supabase
    .from("members")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (memberError) throw new Error(memberError.message);
  if (existingMember) return existingMember;

  const { data: createdMember, error: createError } = await supabase
    .from("members")
    .insert({
      name: email.split("@")[0],
      email,
      phone: "9999999999",
      address: "N/A",
      membership_date: new Date().toISOString().slice(0, 10),
      status: "ACTIVE",
      max_books_allowed: 3,
    })
    .select("*")
    .single();

  if (createError) throw new Error(createError.message);
  return createdMember;
};

const getTransactionsView = async () => {
  const [txsResult, requestsResult, booksResult, membersResult, usersByEmail] = await Promise.all([
    supabase
      .from("transactions")
      .select("id, book_id, member_id, borrow_date, due_date, return_date, status, fine_amount, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("book_requests")
      .select("id, book_id, user_id, status, request_date, processed_at, decision_message")
      .order("request_date", { ascending: false }),
    supabase.from("books").select("*"),
    supabase.from("members").select("*"),
    getUsersByEmail(),
  ]);

  if (txsResult.error) throw new Error(txsResult.error.message);
  if (requestsResult.error) throw new Error(requestsResult.error.message);
  if (booksResult.error) throw new Error(booksResult.error.message);
  if (membersResult.error) throw new Error(membersResult.error.message);

  const booksById = new Map((booksResult.data || []).map((b: any) => [b.id, toBookView(b)]));
  const membersById = new Map((membersResult.data || []).map((m: any) => [m.id, toMemberView(m, usersByEmail)]));
  const usersById = Object.values(usersByEmail).reduce((acc: Record<string, any>, user: any) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const txRows = (txsResult.data || []).map((tx: any) => ({
    id: tx.id,
    status: normalizeStatus(tx.status),
    issueDate: tx.borrow_date,
    dueDate: tx.due_date,
    returnDate: tx.return_date,
    fineAmount: tx.fine_amount,
    book: booksById.get(tx.book_id) || null,
    member: membersById.get(tx.member_id) || null,
    type: "transaction",
  }));

  const requestRows = (requestsResult.data || []).map((req: any) => {
    const requestUser = usersById[req.user_id];
    const matchingMember = requestUser?.email
      ? Array.from(membersById.values()).find((m: any) => m.email?.toLowerCase() === requestUser.email.toLowerCase())
      : null;

    return {
      id: req.id,
      status: normalizeStatus(req.status),
      issueDate: req.request_date,
      dueDate: null,
      returnDate: req.processed_at,
      fineAmount: 0,
      book: booksById.get(req.book_id) || null,
      member: matchingMember || (requestUser ? { user: { ...requestUser, role: normalizeRole(requestUser.role) } } : null),
      type: "request",
    };
  });

  return [...requestRows, ...txRows].sort((a: any, b: any) => {
    const da = new Date(a.issueDate || 0).getTime();
    const db = new Date(b.issueDate || 0).getTime();
    return db - da;
  });
};

export const api = {
  get: async (endpoint: string): Promise<ApiResponse> => {
    try {
      if (endpoint === "/books") {
        const { data, error } = await supabase.from("books").select("*").order("title", { ascending: true });
        if (error) return buildError(error.message);
        return buildResponse((data || []).map(toBookView));
      }

      if (endpoint === "/members") {
        const [{ data: members, error: membersError }, userByEmail] = await Promise.all([
          supabase.from("members").select("*").order("name", { ascending: true }),
          getUsersByEmail(),
        ]);

        if (membersError) return buildError(membersError.message);
        return buildResponse((members || []).map((m: any) => toMemberView(m, userByEmail)));
      }

      if (endpoint === "/transactions") {
        const txs = await getTransactionsView();
        return buildResponse(txs);
      }

      return buildError(`Unsupported endpoint: ${endpoint}`, 404);
    } catch (error: any) {
      return buildError(error.message || "Request failed", 500);
    }
  },

  post: async (endpoint: string, body: any): Promise<ApiResponse> => {
    try {
      if (endpoint === "/auth/login") {
        const email = (body?.email || body?.username || "").trim().toLowerCase();
        const password = body?.password;

        if (!email || !password) {
          return buildError("Email and password are required", 400);
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) {
          return buildError(error?.message || "Invalid email or password", 401);
        }

        const { data: profile } = await supabase
          .from("users")
          .select("id, username, full_name, email, role")
          .eq("id", data.user.id)
          .maybeSingle();

        const role = normalizeRole(profile?.role || data.user.user_metadata?.role);

        return buildResponse({
          userId: data.user.id,
          id: data.user.id,
          username: profile?.username || data.user.email?.split("@")[0] || "member",
          fullName: profile?.full_name || data.user.user_metadata?.fullName || data.user.email,
          role,
          email: profile?.email || data.user.email,
          message: "Login successful",
        });
      }

      if (endpoint === "/users/register") {
        const email = (body?.email || "").trim().toLowerCase();
        const password = body?.password;
        const fullName = body?.fullName?.trim();
        const username = body?.username?.trim();

        if (!email || !password || !fullName || !username) {
          return buildError("All fields are required", 400);
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName,
              role: "MEMBER",
              username,
            },
          },
        });

        if (signUpError) return buildError(signUpError.message, 400);

        const authUser = signUpData.user;
        if (!authUser) return buildError("Registration failed", 400);

        const { error: userError } = await supabase.from("users").upsert(
          {
            id: authUser.id,
            username,
            full_name: fullName,
            email,
            role: "member",
            enabled: true,
            password: "SUPABASE_AUTH",
          },
          { onConflict: "id" }
        );

        if (userError) return buildError(userError.message, 400);

        await resolveMemberForUserEmail(email);
        return buildResponse({ message: "Registration successful" }, 201);
      }

      if (endpoint === "/book-requests/request") {
        const bookId = Number(body?.bookId);
        if (!bookId) return buildError("bookId is required", 400);

        const { authUser, profile } = await getCurrentAppUser();
        const userRole = normalizeRole(profile?.role || authUser.user_metadata?.role);
        if (userRole !== "MEMBER") {
          return buildError("Only members can request books", 403);
        }

        const { data: book, error: bookError } = await supabase
          .from("books")
          .select("id, available_copies")
          .eq("id", bookId)
          .single();

        if (bookError) return buildError(bookError.message, 404);
        if ((book?.available_copies ?? 0) <= 0) return buildError("Book is currently not available", 400);

        const { data: pendingExisting, error: pendingError } = await supabase
          .from("book_requests")
          .select("id")
          .eq("book_id", bookId)
          .eq("user_id", authUser.id)
          .eq("status", "pending")
          .maybeSingle();

        if (pendingError) return buildError(pendingError.message, 400);
        if (pendingExisting) return buildError("You already have a pending request for this book", 409);

        const { data: created, error: createError } = await supabase
          .from("book_requests")
          .insert({
            book_id: bookId,
            user_id: authUser.id,
            status: "pending",
            request_date: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (createError) return buildError(createError.message, 400);
        return buildResponse(created, 201);
      }

      const approveOrRejectMatch = endpoint.match(/^\/book-requests\/(\d+)\/(approve|reject)$/);
      if (approveOrRejectMatch) {
        const requestId = Number(approveOrRejectMatch[1]);
        const action = approveOrRejectMatch[2];

        const { authUser, profile } = await getCurrentAppUser();
        const userRole = normalizeRole(profile?.role || authUser.user_metadata?.role);
        if (userRole !== "LIBRARIAN") {
          return buildError("Only librarians can process requests", 403);
        }

        const { data: requestRow, error: reqError } = await supabase
          .from("book_requests")
          .select("id, book_id, user_id, status")
          .eq("id", requestId)
          .single();

        if (reqError) return buildError(reqError.message, 404);
        if (normalizeStatus(requestRow.status) !== "PENDING") {
          return buildError("Only pending requests can be processed", 400);
        }

        if (action === "reject") {
          const { data: updated, error: rejectError } = await supabase
            .from("book_requests")
            .update({
              status: "rejected",
              processed_at: new Date().toISOString(),
              decision_message: body?.reason || "Request rejected by librarian",
            })
            .eq("id", requestId)
            .select("*")
            .single();

          if (rejectError) return buildError(rejectError.message, 400);
          return buildResponse(updated);
        }

        const { data: requestUser, error: requestUserError } = await supabase
          .from("users")
          .select("id, email")
          .eq("id", requestRow.user_id)
          .single();

        if (requestUserError) return buildError(requestUserError.message, 400);

        const member = await resolveMemberForUserEmail(requestUser.email);

        const { count: activeBorrowings, error: countError } = await supabase
          .from("transactions")
          .select("id", { count: "exact", head: true })
          .eq("member_id", member.id)
          .in("status", ["BORROWED", "OVERDUE"]);

        if (countError) return buildError(countError.message, 400);
        if ((activeBorrowings || 0) >= (member.max_books_allowed || 3)) {
          const { data: updated } = await supabase
            .from("book_requests")
            .update({
              status: "rejected",
              processed_at: new Date().toISOString(),
              decision_message: "You already reached the book limit",
            })
            .eq("id", requestId)
            .select("*")
            .single();
          return buildResponse(updated);
        }

        const { data: book, error: bookError } = await supabase
          .from("books")
          .select("id, available_copies")
          .eq("id", requestRow.book_id)
          .single();

        if (bookError) return buildError(bookError.message, 400);
        if ((book.available_copies ?? 0) <= 0) return buildError("Book is currently not available", 400);

        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + 14);

        const { error: txError } = await supabase.from("transactions").insert({
          book_id: requestRow.book_id,
          member_id: member.id,
          borrow_date: today.toISOString().slice(0, 10),
          due_date: dueDate.toISOString().slice(0, 10),
          status: "BORROWED",
          fine_amount: 0,
        });

        if (txError) return buildError(txError.message, 400);

        const { error: bookUpdateError } = await supabase
          .from("books")
          .update({ available_copies: Math.max(0, (book.available_copies ?? 0) - 1) })
          .eq("id", requestRow.book_id);

        if (bookUpdateError) return buildError(bookUpdateError.message, 400);

        const { data: updatedRequest, error: approveError } = await supabase
          .from("book_requests")
          .update({
            status: "approved",
            processed_at: new Date().toISOString(),
            decision_message: "Approved by librarian",
          })
          .eq("id", requestId)
          .select("*")
          .single();

        if (approveError) return buildError(approveError.message, 400);
        return buildResponse(updatedRequest);
      }

      return buildError(`Unsupported endpoint: ${endpoint}`, 404);
    } catch (error: any) {
      return buildError(error.message || "Request failed", 500);
    }
  },

  put: async () => buildError("PUT is not implemented in this client", 405),
  delete: async () => buildError("DELETE is not implemented in this client", 405),
};
