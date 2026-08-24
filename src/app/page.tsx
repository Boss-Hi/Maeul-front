import { Leaf, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="h-lvh overflow-hidden bg-[#f7fbf8] text-[#111827]">
      <section className="relative isolate mx-auto flex h-full w-full max-w-6xl items-center px-6 py-12 sm:px-10">
        <div className="absolute top-[-10rem] left-1/2 -z-10 h-[36rem] w-[68rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(31,212,129,0.16),rgba(31,212,129,0.08)_38%,transparent_72%)] blur-sm" />
        <div className="absolute right-[-6rem] bottom-[-8rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-[#20d485]/8 blur-3xl" />

        <div className="relative w-full">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-10">
            <div
              aria-label="MAEUL"
              className="flex size-24 shrink-0 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-[#24d17d] via-[#20ce79] to-[#18c66d] shadow-[0_20px_42px_rgba(22,163,92,0.22)] sm:size-32 sm:rounded-[2.25rem]"
            >
              <Leaf
                strokeWidth={2.7}
                className="size-14 -rotate-12 fill-white text-white sm:size-20"
              />
            </div>

            <div className="max-w-4xl">
              <h1 className="text-5xl leading-none font-black tracking-normal text-[#111827] sm:text-6xl md:text-7xl">
                MAEUL
              </h1>
              <p className="mt-5 max-w-3xl text-2xl leading-tight font-bold text-[#66758a] sm:text-4xl">
                체류형 관광 로컬 라이프 큐레이션 플래너
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-4xl rounded-[1.25rem] border border-[#d7eee1] bg-white/72 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur sm:ml-[10.5rem] sm:p-6">
            <p className="flex items-center gap-2 text-sm font-bold text-[#16a35c]">
              <Sparkles size={16} />
              Preferred stack applied
            </p>

            <div className="mt-5 grid gap-3 text-sm font-bold text-[#111827] sm:grid-cols-3">
              <div className="rounded-2xl border border-[#d8f0e2] bg-[#f8fffb] px-4 py-3">
                Next 16.2.2
              </div>
              <div className="rounded-2xl border border-[#d8f0e2] bg-[#f8fffb] px-4 py-3">
                React 19.2.4
              </div>
              <div className="rounded-2xl border border-[#d8f0e2] bg-[#f8fffb] px-4 py-3">
                Tailwind 4
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
