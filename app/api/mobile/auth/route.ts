// app/api/mobile/auth/route.ts
import { NextRequest } from "next/server";
import { GET as mainGet, POST as mainPost } from "../../auth/route";

export async function GET() {
  return mainGet();
}

export async function POST(req: NextRequest) {
  return mainPost(req);
}