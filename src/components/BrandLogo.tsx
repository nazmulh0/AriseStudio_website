import Image from "next/image";

export default function BrandLogo({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <span className="relative block h-10 w-40 shrink-0">
      <Image
        src="/brand/arisestudio-logo.png"
        alt="AriseStudio"
        fill
        sizes="160px"
        className="brand-logo-light object-contain"
        priority={priority}
      />
      <Image
        src="/brand/arisestudio-logo-darkmode.png"
        alt="AriseStudio"
        fill
        sizes="160px"
        className="brand-logo-dark object-contain"
        priority={priority}
      />
    </span>
  );
}
