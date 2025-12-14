import { NextResponse } from "next/server";
import { loginService } from "@/services/auth/login";
import { handleError } from "@/errors/api-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await loginService({
      email: body.email,
      password: body.password,
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    return handleError(error);
  }
}