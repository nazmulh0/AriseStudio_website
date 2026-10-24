"use client";

import {
  siNextdotjs,
  siTypescript,
  siNodedotjs,
  siNestjs,
  siPython,
  siFastapi,
  siPostgresql,
  siRedis,
  siDocker,
  siKubernetes,
  siCloudflare,
  siGooglecloud,
  siShopify,
  siTailwindcss
} from "simple-icons";

interface TechIconItem {
  name: string;
  path: string;
  brandColor?: string;
}

const techIcons: TechIconItem[] = [
  {
    name: "Next.js",
    path: siNextdotjs.path,
    brandColor: "#ffffff"
  },
  {
    name: "TypeScript",
    path: siTypescript.path,
    brandColor: "#3178C6"
  },
  {
    name: "Node.js",
    path: siNodedotjs.path,
    brandColor: "#5FA04E"
  },
  {
    name: "NestJS",
    path: siNestjs.path,
    brandColor: "#E0234E"
  },
  {
    name: "Python",
    path: siPython.path,
    brandColor: "#3776AB"
  },
  {
    name: "FastAPI",
    path: siFastapi.path,
    brandColor: "#05998B"
  },
  {
    name: "PostgreSQL",
    path: siPostgresql.path,
    brandColor: "#4169E1"
  },
  {
    name: "Redis",
    path: siRedis.path,
    brandColor: "#DC382D"
  },
  {
    name: "Docker",
    path: siDocker.path,
    brandColor: "#2496ED"
  },
  {
    name: "Kubernetes",
    path: siKubernetes.path,
    brandColor: "#326CE5"
  },
  {
    name: "Amazon Web Services",
    path: "M6.27 10.45c-.34 0-.66.04-.97.12-.3.08-.57.21-.79.39-.23.18-.4.4-.53.68-.12.27-.19.59-.19.95 0 .44.08.82.25 1.14.16.32.39.58.68.78.29.2.62.35 1 .43.37.08.77.13 1.2.13.56 0 1.07-.08 1.52-.25.46-.17.84-.4 1.15-.71v-2.92c-.34-.23-.74-.4-1.22-.53-.46-.14-.99-.21-1.61-.21zm.33 3.65c-.24 0-.46-.02-.67-.07-.2-.05-.38-.13-.52-.23-.15-.1-.26-.23-.34-.39-.08-.16-.12-.36-.12-.6 0-.32.09-.57.27-.75.18-.18.42-.27.71-.27.28 0 .54.04.78.11.23.07.44.17.61.31v1.54c-.21.16-.44.27-.72.35zm5.55-3.65c-.35 0-.68.04-.99.12-.31.08-.57.21-.8.39-.22.18-.4.4-.52.68-.12.27-.18.59-.18.95 0 .44.08.82.25 1.14.17.32.39.58.68.78.29.2.62.35 1 .43.38.08.78.13 1.2.13.57 0 1.07-.08 1.53-.25.46-.17.84-.4 1.15-.71v-2.92c-.34-.23-.74-.4-1.22-.53-.47-.14-.99-.21-1.6-.21zm.33 3.65c-.24 0-.46-.02-.66-.07-.2-.05-.37-.13-.52-.23-.15-.1-.26-.23-.34-.39-.08-.16-.12-.36-.12-.6 0-.32.09-.57.27-.75.18-.18.42-.27.71-.27.28 0 .54.04.78.11.24.07.44.17.61.31v1.54c-.2.16-.44.27-.73.35zm9.53 4.19c-3.13 2.1-7.51 3.22-12.03 3.22-5.74 0-10.9-2.07-14.81-5.54-.31-.28-.05-.66.32-.45 4.22 2.37 9.38 3.79 14.77 3.79 4.02 0 8.35-.91 12.3-2.79.59-.28 1.08.38.45.77zm1.19-1.22c-.39-.49-2.58-.23-3.57-.12-.3.04-.35-.22-.08-.41 1.76-1.24 4.65-.89 4.98-.48.33.42-.1 3.32-1.76 4.7-.26.21-.5.1-.38-.18.4-1.04 1.2-3.02.81-3.51z",
    brandColor: "#FF9900"
  },
  {
    name: "Cloudflare",
    path: siCloudflare.path,
    brandColor: "#F38020"
  },
  {
    name: "Google Cloud",
    path: siGooglecloud.path,
    brandColor: "#4285F4"
  },
  {
    name: "Shopify API",
    path: siShopify.path,
    brandColor: "#96BF48"
  },
  {
    name: "Tailwind CSS",
    path: siTailwindcss.path,
    brandColor: "#06B6D4"
  }
];

export default function TechStackIcons() {
  return (
    <div className="tech-stack max-w-5xl mx-auto">
      {techIcons.map((tech) => (
        <div
          key={tech.name}
          className="group flex items-center gap-2 rounded-xl border border-line/70 bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface hover:text-ink hover:shadow-xs cursor-default"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 fill-current transition-transform duration-200 group-hover:scale-110 group-hover:text-accent"
          >
            <path d={tech.path} />
          </svg>
          <span>{tech.name}</span>
        </div>
      ))}
    </div>
  );
}

