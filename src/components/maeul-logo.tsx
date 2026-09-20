import Image from "next/image";

export function MaeulLogo({
  size = 36,
  className = ""
}: Readonly<{
  size?: number;
  className?: string;
}>) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#478264] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/maeul-logo-mark.png"
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-contain p-[17%]"
      />
    </span>
  );
}
