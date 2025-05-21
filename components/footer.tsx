import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const footerCategories = [
    {
      id: 1,
      title: "phone cases",
      link: "/collections/phone-cases?category=phone-cases",
    },
    {
      id: 2,
      title: "Airpod cases",
      link: "/collections/airpod-cases?category=airpod-cases",
    },
    {
      id: 3,
      title: "Headphones and Audio",
      link: "/collections/headphones?category=headphones",
    },
    {
      id: 4,
      title: "Chargers",
      link: "/collections/chargers?category=chargers",
    },
    {
      id: 5,
      title: "Watch Straps",
      link: "/collections/watch-straps?category=watch-straps",
    },
    {
      id: 6,
      title: "Screen Protectors",
      link: "/collections/screen-protectors?category=screen-protectors",
    },
  ];
  return (
    <footer className="bg-[#111111] text-white">
      {/* Newsletter Section */}
      <div className="bg-[#9BEC00] py-10">
        <div className="max-w-[100rem] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-black text-xl md:text-2xl font-bold">
                Subscribe to our newsletter
              </h3>
              <p className="text-black/80 mt-2">
                Get the latest updates, news and special offers
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 w-full sm:w-64 focus:outline-none bg-white text-black"
                />
                <button className="bg-black text-white px-6 py-3 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[100rem] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">About Shop</h2>
            <p className="text-gray-300 mb-6">
              We are dedicated to providing high-quality products and
              exceptional customer service. Our mission is to make technology
              accessories affordable and accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-[#9BEC00]"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-[#9BEC00]"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-[#9BEC00]"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-[#9BEC00]"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Categories */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">Categories</h2>
            <ul className="space-y-3">
              <li className="flex flex-col gap-3">
                {footerCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.link}
                    className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2" /> {category.title}
                  </Link>
                ))}
              </li>
              <li>
                <Link
                  href="/collections/watch-straps"
                  className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" /> Watch Straps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Information */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">Information</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" /> About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" /> Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" /> Returns &
                  Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" /> Shipping &
                  Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-[#9BEC00] flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" /> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">Contact Info</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={20} className="text-[#9BEC00] flex-shrink-0" />
                <span className="text-gray-300">
                  123 Street Name, City, Country
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={20} className="text-[#9BEC00] flex-shrink-0" />
                <span className="text-gray-300">+233 (0) 123 456 789</span>
              </li>
              <li className="flex gap-3">
                <Mail size={20} className="text-[#9BEC00] flex-shrink-0" />
                <a
                  href="mailto:info@example.com"
                  className="text-gray-300 hover:text-[#9BEC00]"
                >
                  info@example.com
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={20} className="text-[#9BEC00] flex-shrink-0" />
                <span className="text-gray-300">Mon-Fri: 9am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[100rem] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Shop. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <img src="/images/payment-visa.png" alt="Visa" className="h-8" />
              <img
                src="/images/payment-mastercard.png"
                alt="Mastercard"
                className="h-8"
              />
              <img
                src="/images/payment-paypal.png"
                alt="PayPal"
                className="h-8"
              />
              <img
                src="/images/payment-apple.png"
                alt="Apple Pay"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
