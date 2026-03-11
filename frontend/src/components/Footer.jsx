import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiMail, FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-midnight-truffle pt-12 pb-6 border-t border-velvet-rose-mist/10 text-velvet-rose-mist font-poppins text-sm relative z-50">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand & About */}
          <div className="flex flex-col gap-4">
            <h3 className="font-montserrat font-bold text-xl text-ivory-blush mb-2">
              Juvelle
            </h3>
            <p className="text-velvet-rose-mist/80 leading-relaxed max-w-sm">
              Your premier destination for elegant, meticulously woven clothing.
              We believe that fashion is an art form - a delicate balance of
              intricate design, quality threads, and timeless style.
            </p>
            <div className="flex gap-4 mt-2">
              <a
                href="https://www.instagram.com/juvelle.store/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-velvet-rose-mist/20 flex items-center justify-center text-ivory-blush hover:bg-royal-plum-veil hover:border-royal-plum-veil transition-all duration-300"
                aria-label="Instagram"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/people/JuvelleStore/61586948523920"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-velvet-rose-mist/20 flex items-center justify-center text-ivory-blush hover:bg-royal-plum-veil hover:border-royal-plum-veil transition-all duration-300"
                aria-label="Facebook"
              >
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-montserrat font-semibold text-ivory-blush text-base mb-2">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/store"
                  className="text-velvet-rose-mist/80 hover:text-ivory-blush transition-colors"
                >
                  Store
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-velvet-rose-mist/80 hover:text-ivory-blush transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/legal"
                  className="text-velvet-rose-mist/80 hover:text-ivory-blush transition-colors"
                >
                  Legal & Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="font-montserrat font-semibold text-ivory-blush text-base mb-2">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="text-royal-plum-veil mt-1">
                  <FiPhone size={16} />
                </span>
                <div className="flex flex-col">
                  <span className="text-velvet-rose-mist/60 text-xs mb-1">
                    Phone & WhatsApp
                  </span>
                  <a
                    href="tel:+919061506630"
                    className="text-ivory-blush hover:text-velvet-rose-mist transition-colors"
                  >
                    +91 9061506630
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-royal-plum-veil mt-1">
                  <FiMail size={16} />
                </span>
                <div className="flex flex-col">
                  <span className="text-velvet-rose-mist/60 text-xs mb-1">
                    Email
                  </span>
                  <a
                    href="mailto:juvelle.store@gmail.com"
                    className="text-ivory-blush hover:text-velvet-rose-mist transition-colors"
                  >
                    juvelle.store@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-velvet-rose-mist/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-velvet-rose-mist/60">
          <p>© {new Date().getFullYear()} Juvelle. All rights reserved.</p>
          <p>Designed with elegance in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
