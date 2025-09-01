"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { Card } from "@/components/ui"
import { 
  Mail, 
  Send, 
  CheckCircle, 
  Gift, 
  Bell,
  Sparkles,
  Star,
  Trophy
} from "lucide-react"

interface FormState {
  email: string
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}

const benefits = [
  {
    icon: Trophy,
    text: "Exclusive tournament updates",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Gift,
    text: "Special offers & bonuses",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Bell,
    text: "Player transfer alerts",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Star,
    text: "Weekly strategy tips",
    color: "from-green-400 to-emerald-500"
  }
]

export function Newsletter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const [formState, setFormState] = useState<FormState>({
    email: "",
    isSubmitting: false,
    isSuccess: false,
    error: null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formState.email || !formState.email.includes("@")) {
      setFormState(prev => ({ ...prev, error: "Please enter a valid email address" }))
      return
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, error: null }))

    // Simulate API call
    setTimeout(() => {
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        isSuccess: true,
        email: ""
      }))
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setFormState(prev => ({ ...prev, isSuccess: false }))
      }, 3000)
    }, 1500)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ 
      ...prev, 
      email: e.target.value, 
      error: null 
    }))
  }

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <Card variant="glass-strong" className="relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5" />
            
            {/* Floating Elements */}
            <motion.div
              className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-lg"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1,
              }}
            />

            <div className="relative z-10 p-8 lg:p-12">
              {/* Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">Stay Updated</span>
                </motion.div>

                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Join the
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                    {" "}Dream Team{" "}
                  </span>
                  Newsletter
                </h2>
                
                <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                  Get exclusive updates, pro tips, and be the first to know about 
                  new tournaments and features
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-white font-medium group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Newsletter Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <AnimatePresence mode="wait">
                  {formState.isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 360, 0]
                        }}
                        transition={{ duration: 1 }}
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Welcome to the Team! 🎉
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        Thank you for subscribing! You'll receive your first newsletter 
                        with exclusive content and tips soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                          <motion.div
                            className="relative"
                            whileFocus={{ scale: 1.02 }}
                          >
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                            <input
                              type="email"
                              value={formState.email}
                              onChange={handleEmailChange}
                              placeholder="Enter your email address"
                              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/30 transition-all duration-300"
                              disabled={formState.isSubmitting}
                            />
                          </motion.div>
                          
                          <AnimatePresence>
                            {formState.error && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-400 text-sm mt-2 ml-2"
                              >
                                {formState.error}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={formState.isSubmitting}
                          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                          whileHover={{ scale: formState.isSubmitting ? 1 : 1.05 }}
                          whileTap={{ scale: formState.isSubmitting ? 1 : 0.95 }}
                        >
                          {formState.isSubmitting ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                          <span>
                            {formState.isSubmitting ? "Subscribing..." : "Subscribe"}
                          </span>
                        </motion.button>
                      </div>

                      <motion.p
                        className="text-white/60 text-sm text-center leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        By subscribing, you agree to receive marketing emails from Dream Badminton.
                        <br />
                        You can unsubscribe at any time. We respect your privacy.
                      </motion.p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center justify-center gap-8 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>10K+ subscribers</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span>Weekly updates</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}