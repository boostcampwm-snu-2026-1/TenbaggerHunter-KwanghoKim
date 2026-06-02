import { ThemeSearchForm } from "@/components/theme-search-form";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl pt-16">
      <h1 className="text-3xl font-bold tracking-tight">
        10배 오를 기업을, <span className="text-emerald-400">테마</span>로 찾는다.
      </h1>
      <p className="mt-3 text-neutral-400">
        자연어로 테마를 입력하면 AI가 관련 기업 후보를 발굴하고
        Tenbagger Score와 Bull/Bear/Verdict로 설명합니다.
      </p>
      <div className="mt-8">
        <ThemeSearchForm />
      </div>
    </div>
  );
}
