import { NextResponse } from "next/server";
import { z } from "zod";
import { searchTheme } from "@/lib/discovery";

const bodySchema = z.object({
  theme: z.string().min(1).max(200),
  market: z.enum(["US", "KR", "ALL"]).default("US"),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "테마를 올바르게 입력해주세요." }, { status: 400 });
  }

  try {
    const result = await searchTheme(parsed.theme, parsed.market);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/search]", err);
    return NextResponse.json(
      { error: "탐색 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 },
    );
  }
}
