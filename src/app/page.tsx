import { MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { SceneryIntro } from "./scenery-intro";
import { MaeulLogo } from "@/components/maeul-logo";

export default function StartPage() {
  const apiBaseUrl =
    process.env.MAEUL_API_BASE_URL ?? "https://api.maeul.duckdns.org";
  const kakaoLoginUrl = new URL(
    "/oauth2/authorization/kakao",
    apiBaseUrl
  ).toString();

  return (
    <main className="h-dvh overflow-y-auto bg-[#e2ebe5] text-[#16211a]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-[#F6FAF7] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <section className="relative flex flex-1 flex-col overflow-hidden px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#F7FCF8_0%,#EAF5EE_56%,#D4EADB_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[#c8e2cf]" />
          <div className="absolute right-[-90px] bottom-[18%] h-[220px] w-[220px] rounded-full border-[42px] border-white/36" />

          <header className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MaeulLogo />
              <span className="text-[17px] font-black tracking-[0.08em] text-[#12592C]">
                MAEUL
              </span>
            </div>
            <span className="rounded-full bg-white/72 px-3 py-1.5 text-[11px] font-bold text-[#3d6b4d] shadow-[0_8px_20px_rgba(20,34,25,0.05)]">
              Local Mission
            </span>
          </header>

          <div className="relative z-10 mt-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-black tracking-[0.06em] text-[#12592C]">
              <Sparkles size={13} />
              취향으로 시작하는 체류
            </div>
            <h1 className="mt-5 text-[42px] leading-[1.08] font-black text-[#102819] motion-safe:animate-[riseIn_.72s_ease-out_.1s_both]">
              머무는 여행,
              <br />
              미션으로 시작
            </h1>
            <p
              id="intro-description"
              className="mt-5 max-w-[320px] text-[15px] leading-[1.75] font-semibold text-[#52685a] motion-safe:animate-[riseIn_.72s_ease-out_.35s_both]"
            >
              취향을 고르면 마을의 행사, 장소, 미션이 하나의 체류 루트로
              이어져요.
            </p>
          </div>

          <div className="relative z-10 mt-auto shrink-0 pt-6 md:my-auto">
            <SceneryIntro>
              <SceneryWindow />
            </SceneryIntro>
          </div>

          <div className="relative z-10 mt-4 shrink-0">
            <Link
              href={kakaoLoginUrl}
              className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[17px] bg-[#FEE500] text-[16px] font-black text-[#191919] shadow-[0_12px_28px_rgba(82,73,0,0.18)] transition-transform active:scale-[0.98]"
            >
              <MessageCircle size={19} fill="currentColor" strokeWidth={2} />
              카카오로 시작하기
            </Link>
            <p className="mt-3 text-center text-[11px] leading-relaxed font-medium text-[#617467]">
              로그인하면 나만의 마을 취향과 여행 기록을 이어갈 수 있어요.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function SceneryWindow() {
  return (
    <div className="relative h-[clamp(160px,calc(100dvh-440px),500px)] overflow-hidden rounded-[32px] border border-white/70 bg-[#eef8f1] md:max-h-[450px]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fafcf9_0%,#eef6ee_30%,#e2efe3_60%,#c7e2cf_100%)]" />
      <div
        aria-hidden="true"
        className="absolute top-[12%] right-[14%] size-12 rounded-full bg-[#f3dca0]/75 shadow-[0_0_0_12px_rgba(243,220,160,0.12),0_0_42px_rgba(243,220,160,0.2)]"
      />

      <div className="absolute top-[10%] left-0 flex w-[200%] animate-[cloudDrift_32s_linear_infinite] gap-16 opacity-70">
        <Cloud />
        <Cloud className="mt-10 scale-75" />
        <Cloud className="scale-90" />
        <Cloud className="mt-7 scale-80" />
      </div>

      <div className="absolute bottom-0 left-0 flex h-[78%] w-[200%] animate-[mountainDrift_30s_linear_infinite] opacity-62">
        <MountainRange />
        <MountainRange />
      </div>

      <div className="absolute bottom-0 left-0 flex w-[200%] min-w-[1200px] animate-[villageDrift_19s_linear_infinite] items-end opacity-80">
        <VillageStrip />
        <VillageStrip />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-2.5 bg-[#8fc49b]/72" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/65" />
      <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.44),inset_0_-46px_58px_rgba(18,89,44,0.1)]" />
    </div>
  );
}

function Cloud({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 128 48"
      aria-hidden="true"
      className={`h-10 w-28 shrink-0 ${className}`}
      fill="none"
    >
      <path
        d="M24 42C13 44 5 38 6 29C6 21 13 16 22 18C23 8 33 3 43 8C50 -1 65 1 70 12C81 5 96 11 98 22C109 17 121 23 122 32C123 41 113 46 102 42C93 48 82 46 76 42C66 48 54 47 47 42C39 47 29 46 24 42Z"
        fill="#ffffff"
        fillOpacity="0.85"
      />
    </svg>
  );
}

function MountainRange() {
  return (
    <svg
      viewBox="0 0 900 260"
      className="h-full w-1/2 shrink-0"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0 222 C76 172 118 151 174 101 C225 55 267 43 322 84 C378 126 414 151 468 116 C538 70 596 55 656 106 C724 164 790 174 900 222 L900 260 L0 260 Z"
        fill="#9ccda7"
      />
      <path
        d="M0 194 C82 164 139 117 205 126 C256 133 290 55 361 36 C438 15 484 144 548 130 C618 115 653 60 722 81 C788 101 822 153 900 194 L900 260 L0 260 Z"
        fill="#78b686"
      />
      <path
        d="M0 219 C78 190 132 178 194 192 C261 208 316 154 390 162 C481 171 512 199 585 184 C664 167 721 157 797 183 C843 199 872 205 900 219 L900 260 L0 260 Z"
        fill="#6aa878"
      />
    </svg>
  );
}

function VillageStrip() {
  return (
    <svg
      viewBox="0 0 900 210"
      className="h-auto w-1/2 shrink-0"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <path
        d="M0 180 C105 149 195 158 297 180 C409 204 491 151 604 166 C716 181 803 162 900 180 L900 210 L0 210 Z"
        fill="#79b987"
      />
      <g opacity="0.85">
        <Tree x={126} y={108} color="#80ab82" />
        <Tree x={523} y={102} color="#8ab28c" />
        <Tree x={794} y={108} color="#7fa67c" />
      </g>
      <Hanok x={45} y={115} body="#fff6df" roof="#4f8f5d" />
      <LowHouse x={174} y={108} body="#ffffff" roof="#7db98a" />
      <Apartment x={292} y={54} body="#edf8f1" roof="#6aa878" />
      <Shop x={430} y={112} body="#fff1d6" roof="#4f8f5d" />
      <Hanok x={568} y={104} body="#ffffff" roof="#79b987" />
      <Apartment x={710} y={66} body="#f7fbf8" roof="#5d9f6c" />
      <LowHouse x={818} y={120} body="#fff6df" roof="#7db98a" />
      {[224, 492, 776].map((x) => (
        <g key={x} transform={`translate(${x} 177)`}>
          <path
            d="M0 17V3M0 12L-6 7M0 9L6 4"
            stroke="#77985f"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="0" cy="2" r="4" fill="#f3dca0" />
          <circle cx="7" cy="3" r="3" fill="#fff9e9" />
        </g>
      ))}
    </svg>
  );
}

function LowHouse({
  x,
  y,
  body,
  roof
}: Readonly<{
  x: number;
  y: number;
  body: string;
  roof: string;
}>) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M8 34 L42 6 L76 34 Z" fill={roof} />
      <rect x="15" y="33" width="54" height="48" rx="7" fill={body} />
      <rect x="36" y="52" width="13" height="29" rx="5" fill="#3f7650" />
      <rect x="24" y="43" width="10" height="10" rx="3" fill="#b8d7c0" />
      <rect x="53" y="43" width="10" height="10" rx="3" fill="#b8d7c0" />
    </g>
  );
}

function Hanok({
  x,
  y,
  body,
  roof
}: Readonly<{
  x: number;
  y: number;
  body: string;
  roof: string;
}>) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M2 35 C22 18 48 18 68 35 C54 29 16 29 2 35 Z" fill={roof} />
      <rect x="11" y="35" width="48" height="38" rx="6" fill={body} />
      <rect x="28" y="49" width="14" height="24" rx="5" fill="#3f7650" />
      <rect x="16" y="45" width="9" height="9" rx="2" fill="#b8d7c0" />
      <rect x="45" y="45" width="9" height="9" rx="2" fill="#b8d7c0" />
    </g>
  );
}

function Apartment({
  x,
  y,
  body,
  roof
}: Readonly<{
  x: number;
  y: number;
  body: string;
  roof: string;
}>) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="6" y="12" width="62" height="101" rx="9" fill={body} />
      <rect x="6" y="12" width="62" height="13" rx="6" fill={roof} />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={17 + col * 15}
            y={37 + row * 21}
            width="8"
            height="10"
            rx="2"
            fill="#b8d7c0"
          />
        ))
      )}
      <rect x="32" y="91" width="12" height="22" rx="4" fill="#3f7650" />
    </g>
  );
}

function Shop({
  x,
  y,
  body,
  roof
}: Readonly<{
  x: number;
  y: number;
  body: string;
  roof: string;
}>) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="7" y="26" width="76" height="50" rx="7" fill={body} />
      <path d="M2 28 H88 L78 9 H14 Z" fill={roof} />
      <rect x="16" y="43" width="19" height="18" rx="4" fill="#b8d7c0" />
      <rect x="45" y="43" width="25" height="33" rx="5" fill="#3f7650" />
      <path d="M10 29 H80 V36 H10 Z" fill="#ffffff" opacity="0.7" />
    </g>
  );
}

function Tree({
  x,
  y,
  color
}: Readonly<{
  x: number;
  y: number;
  color: string;
}>) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="16" y="42" width="8" height="31" rx="4" fill="#926b38" />
      <circle cx="20" cy="20" r="20" fill={color} />
      <circle cx="8" cy="33" r="15" fill={color} opacity="0.9" />
      <circle cx="32" cy="34" r="16" fill={color} opacity="0.92" />
      <path
        d="M20 48V22M20 38L10 30M20 31L28 24"
        stroke="#c7dcbb"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </g>
  );
}
