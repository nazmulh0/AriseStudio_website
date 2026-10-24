import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default async function Footer() {
  "use cache";
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" aria-label="AriseStudio home" className="inline-flex"><BrandLogo /></Link>
          <p>Automation, custom software and managed IT. Built around your business.</p>
          <address>
            <span><MapPin aria-hidden="true" />Dhaka, Bangladesh</span>
            <a href="mailto:contact@arisestudio.com"><Mail aria-hidden="true" />contact@arisestudio.com</a>
          </address>
        </div>
        <nav aria-labelledby="footer-services">
          <h2 id="footer-services">Core Services</h2>
          <ul>
            <li><Link href="/services#ecommerce">E-commerce automation</Link></li>
            <li><Link href="/services#erp-crm">Custom ERP & CRM</Link></li>
            <li><Link href="/services#business-automation">Business automation</Link></li>
            <li><Link href="/services#it-support">24/7 managed IT support</Link></li>
            <li><Link href="/services#it-support">DevOps & cloud resilience</Link></li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-products">
          <h2 id="footer-products">Products & Solutions</h2>
          <ul>
            <li><Link href="/#products" className="footer-product">AriseSell Platform</Link></li>
            <li><Link href="/solutions#retail">Retail & omnichannel</Link></li>
            <li><Link href="/solutions#logistics">Supply chain & logistics</Link></li>
            <li><Link href="/solutions#finance">Finance & invoicing</Link></li>
            <li><Link href="/case-studies">Project examples</Link></li>
          </ul>
        </nav>
      </div>
      <div className="footer-bottom-wrap">
        <div className="footer-bottom">
          {/* Profile URLs are pending; never send visitors to an unrelated account. */}
          <div className="footer-social" aria-label="Social profiles coming soon">
            <span>LinkedIn</span><span>YouTube</span><span>X</span>
          </div>
          <p className="footer-copyright">© {new Date().getFullYear()} AriseStudio. All rights reserved.</p>
          <nav className="footer-legal" aria-label="Footer information">
            <Link href="/privacy">Privacy</Link>
            <Link href="/case-studies">Examples</Link>
            <Link href="/contact">Direct Desk</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
