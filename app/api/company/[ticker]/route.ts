import { NextResponse } from "next/server";
import { getDeepDive } from "@/lib/discovery";

export async function GET(_req: Request, { params }: { params: { ticker: string } }) {
  try {
    const deepDive = await getDeepDive(params.ticker);
    if (!deepDive) {
      return NextResponse.json({ error: "기업을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(deepDive);
  } catch (err) {
    console.error(`[/api/company/${params.ticker}]`, err);
    return NextResponse.json(
      { error: "기업 분석 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 },
    );
  }
}
