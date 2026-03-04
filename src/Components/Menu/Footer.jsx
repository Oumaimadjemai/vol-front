import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
    id="contact"
     className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#00C0E8] font-playfair">
              Traveling!
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("footer_description", "Discover the world with us. We provide the best travel experiences tailored just for you.")}
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00C0E8] transition-all duration-300 group"
              >
                <Facebook size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00C0E8] transition-all duration-300 group"
              >
                <Twitter size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00C0E8] transition-all duration-300 group"
              >
                <Instagram size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00C0E8] transition-all duration-300 group"
              >
                <Youtube size={18} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold relative pb-2">
              {t("footer_quick_links", "Quick Links")}
              <span className="absolute left-0 bottom-0 w-12 h-0.5 bg-[#00C0E8]"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/#hero" className="text-gray-400 hover:text-[#00C0E8] transition flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#00C0E8] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t("accueil")}
                </Link>
              </li>
              <li>
                <Link to="/#destinations" className="text-gray-400 hover:text-[#00C0E8] transition flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#00C0E8] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t("voyage")}
                </Link>
              </li>
              <li>
                <Link to="/#offres" className="text-gray-400 hover:text-[#00C0E8] transition flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#00C0E8] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t("offres")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#00C0E8] transition flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#00C0E8] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {t("apropos")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold relative pb-2">
              {t("footer_contact", "Contact Us")}
              <span className="absolute left-0 bottom-0 w-12 h-0.5 bg-[#00C0E8]"></span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#00C0E8] flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Travel Street, Algiers, Algeria
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-[#00C0E8] flex-shrink-0" />
                <a href="tel:+213123456789" className="text-gray-400 hover:text-[#00C0E8] transition text-sm">
                  +213 (0) 123 456 789
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-[#00C0E8] flex-shrink-0" />
                <a href="mailto:info@traveling.com" className="text-gray-400 hover:text-[#00C0E8] transition text-sm">
                  info@traveling.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold relative pb-2">
              {t("footer_newsletter", "Newsletter")}
              <span className="absolute left-0 bottom-0 w-12 h-0.5 bg-[#00C0E8]"></span>
            </h4>
            <p className="text-gray-400 text-sm">
              {t("footer_newsletter_desc", "Subscribe to get special offers and travel inspirations.")}
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("footer_email_placeholder", "Your email address")}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C0E8] text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#00C0E8] rounded-lg hover:bg-sky-500 transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Traveling! {t("footer_rights", "All rights reserved.")}
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-[#00C0E8] text-sm transition">
                {t("footer_privacy", "Privacy Policy")}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-[#00C0E8] text-sm transition">
                {t("footer_terms", "Terms of Service")}
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-[#00C0E8] text-sm transition">
                {t("footer_cookies", "Cookie Policy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}