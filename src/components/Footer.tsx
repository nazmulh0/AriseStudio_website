import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { 
  Mail, 
  MapPin, 
  ArrowRight,
} from "lucide-react";

export default async function Footer() {
  "use cache";
  return (
    <footer className="site-footer bg-surface-muted border-t border-line text-muted">
      {/* Top Banner / Pre-footer Call to Action */}
      <div className="footer-cta max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-line">
        <div className="relative rounded-2xl bg-surface border border-line hover:border-accent/30 transition-colors p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-accent">
              Start a conversation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-ink mt-3 tracking-tight">
              Good systems start with a conversation.
            </h3>
            <p className="text-muted mt-2 text-sm sm:text-base leading-relaxed">
              Tell us what’s slowing your team down. We’ll explore what a better workflow could look like.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors shadow-sm  text-sm whitespace-nowrap"
            >
              Book a discovery call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group py-1">
              <BrandLogo />
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              AriseStudio builds mission-critical automation systems, custom ERP/CRM platforms, e-commerce synchronizers, and provides 24/7 managed enterprise IT support engineered for stability and scale.
            </p>


          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ink mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services#ecommerce" className="hover:text-accent transition-colors">
                  E-Commerce Automation
                </Link>
              </li>
              <li>
                <Link href="/services#erp-crm" className="hover:text-accent transition-colors">
                  Custom ERP & CRM
                </Link>
              </li>
              <li>
                <Link href="/services#business-automation" className="hover:text-accent transition-colors">
                  Business Process Automation
                </Link>
              </li>
              <li>
                <Link href="/services#it-support" className="hover:text-accent transition-colors">
                  24/7 Managed IT Support
                </Link>
              </li>
              <li>
                <Link href="/services#it-support" className="hover:text-accent transition-colors">
                  DevOps & Cloud Resilience
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & In-House Ventures */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ink mb-4">
              Products & Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#products" className="text-accent font-semibold hover:text-ink transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  AriseSell Platform
                </Link>
              </li>
              <li>
                <Link href="/solutions#retail" className="hover:text-accent transition-colors">
                  Retail & Omnichannel
                </Link>
              </li>
              <li>
                <Link href="/solutions#logistics" className="hover:text-accent transition-colors">
                  Supply Chain & Logistics
                </Link>
              </li>
              <li>
                <Link href="/solutions#finance" className="hover:text-accent transition-colors">
                  Financial & Automated Invoicing
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-accent transition-colors">
                  Verified Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ink mb-4">
              Studio Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:contact@arisestudio.com" className="hover:text-ink transition-colors">
                  contact@arisestudio.com
                </a>
              </li>

              <li className="pt-2 text-xs text-subtle">
                Support coverage agreed for each project
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line py-6 text-xs text-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AriseStudio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            <Link href="/case-studies" className="hover:text-muted transition-colors">Client Studies</Link>
            <Link href="/contact" className="hover:text-muted transition-colors">Direct Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
