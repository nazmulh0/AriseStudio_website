import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/services",
    "/solutions",
    "/case-studies",
    "/careers",
    "/contact",
    "/schedule",
    "/privacy",
  ].map((path) => ({
    url: `${siteOrigin()}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
