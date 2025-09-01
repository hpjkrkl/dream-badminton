"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui"
import { 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Smartphone,
  Monitor,
  Download,
  Apple,
  Play,
  Shield,
  Award,
  Heart
} from "lucide-react"

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Tournaments", href: "#tournaments" },
      { name: "Leaderboards", href: "#leaderboards" },
      { name: "Pricing", href: "#pricing" },
      { name: "Mobile App", href: "#mobile-app" }
    ]
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press Kit", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "Partners", href: "/partners" }
    ]
  },
  support: {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "FAQ", href: "/faq" },
      { name: "Community", href: "/community" },
      { name: "Live Chat", href: "/chat" },
      { name: "Report Bug", href: "/report" },
      { name: "Feature Request", href: "/feature-request" }
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Fair Play", href: "/fair-play" },
      { name: "Responsible Gaming", href: "/responsible-gaming" },
      { name: "Licenses", href: "/licenses" }
    ]
  }
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/dreambadminton", color: "from-blue-600 to-blue-700" },
  { icon: Twitter, href: "https://twitter.com/dreambadminton", color: "from-sky-400 to-sky-600" },
  { icon: Instagram, href: "https://instagram.com/dreambadminton", color: "from-pink-500 to-purple-600" },
  { icon: Youtube, href: "https://youtube.com/dreambadminton", color: "from-red-500 to-red-600" },
  { icon: Linkedin, href: "https://linkedin.com/company/dreambadminton", color: "from-blue-700 to-blue-800" }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <footer ref={ref} className="relative mt-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Brand Section */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-4 space-y-6"
            >
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-white text-2xl font-bold">🏸</span>
                </motion.div>
                <div className="text-white font-bold text-3xl tracking-tight">
                  Dream Badminton
                </div>
              </div>

              <p className="text-white/80 leading-relaxed text-lg">
                The ultimate fantasy badminton experience. Build your dream team, 
                compete with friends, and rise through the ranks in the most 
                exciting sports fantasy platform.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="w-5 h-5" />
                  <span>support@dreambadminton.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <MapPin className="w-5 h-5" />
                  <span>San Francisco, CA</span>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([key, section]) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <h3 className="text-white font-bold text-lg mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <motion.a
                          href={link.href}
                          className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                          whileHover={{ x: 5 }}
                        >
                          {link.name}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* App Download Section */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <h3 className="text-white font-bold text-lg mb-4">Download App</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Get the full experience on your mobile device
              </p>
              
              <div className="space-y-4">
                {/* iOS App Store */}
                <motion.a
                  href="#"
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/60 text-xs">Download on the</div>
                    <div className="text-white font-semibold">App Store</div>
                  </div>
                  <Download className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-300" />
                </motion.a>

                {/* Google Play Store */}
                <motion.a
                  href="#"
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/60 text-xs">Get it on</div>
                    <div className="text-white font-semibold">Google Play</div>
                  </div>
                  <Download className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-300" />
                </motion.a>

                {/* Desktop App */}
                <motion.a
                  href="#"
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/60 text-xs">Available for</div>
                    <div className="text-white font-semibold">Desktop</div>
                  </div>
                  <Download className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-300" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Security and Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="border-t border-white/10 pt-8 mb-8"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-white/80 font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="text-white/80 font-medium">Certified Fair Play</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10">
                <Heart className="w-6 h-6 text-red-400" />
                <span className="text-white/80 font-medium">Responsible Gaming</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            variants={itemVariants}
            className="border-t border-white/10 pt-8 pb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-sm">
                © 2024 Dream Badminton. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-white/60 text-sm">
                <motion.a 
                  href="/privacy" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2 }}
                >
                  Privacy
                </motion.a>
                <motion.a 
                  href="/terms" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2 }}
                >
                  Terms
                </motion.a>
                <motion.a 
                  href="/cookies" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2 }}
                >
                  Cookies
                </motion.a>
                <motion.a 
                  href="/sitemap" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2 }}
                >
                  Sitemap
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}