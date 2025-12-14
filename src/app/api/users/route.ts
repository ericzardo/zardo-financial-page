import { NextResponse } from "next/server";
import { createUser, listUsers } from "@/services/user";
import { handleError } from "@/errors/api-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  const users = await listUsers();
  return NextResponse.json(users);
}