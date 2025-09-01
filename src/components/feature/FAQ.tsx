"use client"

import { motion, AnimatePresence, useInView } from "framer-motion"
import { useState, useRef } from "react"
import { Card } from "@/components/ui"
import { 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  Shield, 
  Gamepad2,
  Trophy,
  Users,
  CreditCard
} from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  icon: React.ComponentType<{ className?: string }>
  category: "gameplay" | "technical" | "account" | "payments"
}

const faqs: FAQ[] = [
  {
    id: "getting-started",
    question: "How do I get started with Dream Badminton?",
    answer: "Getting started is simple! Download our app from the App Store or Google Play, create your account, and you'll be guided through a comprehensive tutorial. You'll learn how to draft your first team, understand player pricing, and join your first contest. We also provide beginner-friendly leagues to help you practice.",
    icon: Gamepad2,
    category: "gameplay"
  },
  {
    id: "team-selection",
    question: "How does the player selection and team building work?",
    answer: "You have a budget to select 6 players for your fantasy team: 2 singles players and 4 doubles players. Each player has a price based on their current form and ranking. You can make transfers between matches, but each transfer costs points. Strategy is key - balance star players with value picks to maximize your team's potential.",
    icon: Users,
    category: "gameplay"
  },
  {
    id: "scoring-system",
    question: "How is the scoring system calculated?",
    answer: "Points are awarded based on real match performance: wins (+50 points), games won (+10 each), sets won (+25 each), and bonus points for exceptional performances like straight-set victories (+20). Defensive stats like saves and rallies won also contribute. The system is transparent and updates in real-time during matches.",
    icon: Trophy,
    category: "gameplay"
  },
  {
    id: "live-updates",
    question: "Are match updates and scores provided in real-time?",
    answer: "Yes! We provide real-time updates for all major tournaments and leagues. Our advanced tracking system monitors every point, game, and set, updating your fantasy scores instantly. You can watch your team's performance live with detailed match statistics and commentary.",
    icon: Zap,
    category: "technical"
  },
  {
    id: "data-security",
    question: "How secure is my personal and payment information?",
    answer: "We use bank-level encryption (SSL 256-bit) and comply with international data protection standards including GDPR. All payment processing is handled by certified secure payment gateways. We never store your complete payment details on our servers, and your personal information is protected with multi-factor authentication.",
    icon: Shield,
    category: "account"
  },
  {
    id: "withdrawals",
    question: "How do withdrawals and prize distributions work?",
    answer: "Winnings are typically credited to your account within 24 hours of contest completion. You can withdraw funds to your bank account, which usually takes 2-5 business days depending on your bank. We support multiple payment methods including UPI, bank transfers, and digital wallets. Minimum withdrawal amounts may apply.",
    icon: CreditCard,
    category: "payments"
  },
  {
    id: "tournaments",
    question: "What types of contests and tournaments are available?",
    answer: "We offer various contest formats: Head-to-Head battles, small group leagues (3-10 players), mega contests (1000+ players), and season-long championships. Entry fees range from free contests to high-stakes tournaments. Each format has different prize structures and difficulty levels to suit all player types.",
    icon: Trophy,
    category: "gameplay"
  },
  {
    id: "mobile-app",
    question: "Is the mobile app available on both iOS and Android?",
    answer: "Yes! Our app is available on both iOS (App Store) and Android (Google Play Store). Both versions offer the complete fantasy experience with real-time updates, team management, live scoring, and social features. We regularly update both apps with new features and improvements.",
    icon: Gamepad2,
    category: "technical"
  }
]

const categoryColors = {
  gameplay: "from-blue-400 to-cyan-500",
  technical: "from-green-400 to-emerald-500", 
  account: "from-purple-400 to-pink-500",
  payments: "from-yellow-400 to-orange-500"
}

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

export function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [openItems, setOpenItems] = useState<string[]>(["getting-started"])
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">FAQ</span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Got Questions?
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about Dream Badminton
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="group"
            >
              <Card 
                variant="glass-strong"
                className="overflow-hidden transition-all duration-300 hover:bg-white/15"
              >
                <motion.button
                  className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-2xl transition-all duration-300"
                  onClick={() => toggleItem(faq.id)}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Category Icon */}
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${categoryColors[faq.category]} rounded-xl flex items-center justify-center shadow-lg`}
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <faq.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      {/* Question */}
                      <h3 className="text-lg lg:text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron */}
                    <motion.div
                      animate={{ 
                        rotate: openItems.includes(faq.id) ? 180 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Answer */}
                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        exit={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <div className="pl-16 pr-10">
                          <div className="h-px bg-gradient-to-r from-white/10 via-white/20 to-white/10 mb-6" />
                          <motion.p 
                            className="text-white/80 leading-relaxed text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {faq.answer}
                          </motion.p>
                          
                          {/* Helpful Links */}
                          <motion.div
                            className="mt-4 flex gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <motion.button
                              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Was this helpful?
                            </motion.button>
                            <span className="text-white/30">•</span>
                            <motion.button
                              className="text-sm text-white/60 hover:text-white/80 transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Need more help?
                            </motion.button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Our support team is available 24/7 to help you with any queries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
              <motion.button
                className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Community
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}