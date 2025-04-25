import { Link } from "wouter";
import { RecycleIcon } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdMailOutline, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-text py-12 px-4 text-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold font-poppins mr-2">WasteWise</span>
              <RecycleIcon className="text-primary h-5 w-5" />
            </div>
            <p className="text-gray-400 mb-4">
              Making waste management smarter and more accessible through technology.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-all"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-all"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-xl font-bold font-poppins mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scan" className="text-gray-400 hover:text-primary transition-all">
                  Classify Waste
                </Link>
              </li>
              <li>
                <Link href="/learning" className="text-gray-400 hover:text-primary transition-all">
                  Learning Center
                </Link>
              </li>
              <li>
                <Link href="/recycling-centers" className="text-gray-400 hover:text-primary transition-all">
                  Recycling Centers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-all">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-xl font-bold font-poppins mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/learning" className="text-gray-400 hover:text-primary transition-all">
                  Waste Classification Guide
                </Link>
              </li>
              <li>
                <Link href="/learning" className="text-gray-400 hover:text-primary transition-all">
                  Recycling Tips
                </Link>
              </li>
              <li>
                <Link href="/learning" className="text-gray-400 hover:text-primary transition-all">
                  Composting Basics
                </Link>
              </li>
              <li>
                <Link href="/learning" className="text-gray-400 hover:text-primary transition-all">
                  E-Waste Management
                </Link>
              </li>
              <li>
                <Link href="/learning" className="text-gray-400 hover:text-primary transition-all">
                  Educational Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-xl font-bold font-poppins mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MdLocationOn className="mt-1 mr-3 text-primary" />
                <span className="text-gray-400">123 Eco Street, Green City, Earth</span>
              </li>
              <li className="flex items-center">
                <MdMailOutline className="mr-3 text-primary" />
                <a
                  href="mailto:info@wastewise.com"
                  className="text-gray-400 hover:text-primary transition-all"
                >
                  info@wastewise.com
                </a>
              </li>
              <li className="flex items-center">
                <MdPhone className="mr-3 text-primary" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-primary transition-all"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} WasteWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
