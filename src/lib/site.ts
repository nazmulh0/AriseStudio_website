import type { Metadata } from "next";

export function siteOrigin(): string {
  const configured = process.env.SITE_URL?.trim().replace(
    /^(["'])(.*)\1$/,
    "$2",
  );
  const url = new URL(
    configured ||
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "arise-studio-website.vercel.app"}`,
  );
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("SITE_URL must be an HTTP(S) origin without credentials.");
  return url.origin;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "AriseStudio",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "AriseStudio — automation and custom software",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
