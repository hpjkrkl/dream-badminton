"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui"
import { 
  Zap, 
  Shield, 
  Target, 
  Gamepad2, 
  TrendingUp, 
  Users2,
  Star,
  Award,
  Clock
} from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  gradient: string
  delay: number
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Real-time updates and blazing fast performance for seamless gameplay experience",
    color: "from-yellow-400 to-orange-500",
    gradient: "from-yellow-400/20 to-orange-500/20",
    delay: 0.1
  },
  {
    icon: Shield,
    title: "Secure & Fair",
    description: "Advanced security protocols and fair play algorithms ensure a safe gaming environment",
    color: "from-green-400 to-emerald-500",
    gradient: "from-green-400/20 to-emerald-500/20",
    delay: 0.2
  },
  {
    icon: Target,
    title: "Precision Analytics",
    description: "Deep insights and analytics to help you make smarter team selection decisions",
    color: "from-blue-400 to-cyan-500",
    gradient: "from-blue-400/20 to-cyan-500/20",
    delay: 0.3
  },
  {
    icon: Gamepad2,
    title: "Immersive Experience",
    description: "Engaging gameplay with stunning visuals and smooth interactions",
    color: "from-purple-400 to-pink-500",
    gradient: "from-purple-400/20 to-pink-500/20",
    delay: 0.4
  },
  {
    icon: TrendingUp,
    title: "Smart Predictions",
    description: "AI-powered insights and predictions to enhance your strategic planning",
    color: "from-indigo-400 to-purple-500",
    gradient: "from-indigo-400/20 to-purple-500/20",
    delay: 0.5
  },
  {
    icon: Users2,
    title: "Community Driven",
    description: "Join a thriving community of badminton enthusiasts and fantasy players",
    color: "from-rose-400 to-pink-500",
    gradient: "from-rose-400/20 to-pink-500/20",
    delay: 0.6
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

const cardHoverVariants = {
  rest: { 
    scale: 1,
    rotateY: 0,
    rotateX: 0,
  },
  hover: { 
    scale: 1.05,
    rotateY: 5,
    rotateX: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
}

export function FeatureShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">Premium Features</span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Unlock the Power of
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Advanced Gaming
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience badminton fantasy like never before with cutting-edge features 
            designed for the ultimate competitive advantage
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              custom={index}
              className="group"
            >
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                className="h-full perspective-1000"
              >
                <Card 
                  variant="glass-strong" 
                  className="relative p-8 text-white h-full overflow-hidden cursor-pointer transform-gpu transition-all duration-500"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-6">
                    {/* Icon */}
                    <motion.div
                      className="relative"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-shadow duration-500`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Animated Ring */}
                      <motion.div
                        className={`absolute inset-0 w-16 h-16 rounded-2xl border-2 border-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                    </motion.div>

                    {/* Text Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-500">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                        {feature.description}
                      </p>
                    </div>

                    {/* Interactive Element */}
                    <motion.div
                      className="flex items-center gap-2 text-white/60 group-hover:text-white/90 transition-colors duration-500"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-sm font-medium">Learn more</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/10 rounded-full group-hover:bg-white/30 transition-colors duration-500" />
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(251, 146, 60, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              <Award className="w-6 h-6" />
              Explore All Features
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}