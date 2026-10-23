import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Contact | AriseStudio",
  "Tell us about your workflow, discuss a software project or book a discovery call with AriseStudio.",
  "/contact",
);
export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
