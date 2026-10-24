import Image from "next/image";

export default function BrandLogo({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <span className="relative block h-12 w-48 max-w-full shrink-0">
      <Image
        src="/brand/arisestudio-logo.png"
        alt="AriseStudio"
        fill
        sizes="192px"
        className="brand-logo-light object-contain"
        priority={priority}
      />
      <Image
        src="/brand/arisestudio-logo-darkmode.png"
        alt="AriseStudio"
        fill
        sizes="192px"
        className="brand-logo-dark object-contain"
        priority={priority}
      />
    </span>
  );
}
