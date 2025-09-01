"use client"

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Card } from "@/components/ui"
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Star,
  Globe,
  Gamepad2,
  Clock,
  Award
} from "lucide-react"

interface Statistic {
  icon: React.ComponentType<{ className?: string }>
  value: number
  suffix: string
  title: string
  subtitle: string
  color: string
  gradient: string
  delay: number
}

const statistics: Statistic[] = [
  {
    icon: Users,
    value: 50000,
    suffix: "K+",
    title: "Active Players",
    subtitle: "Growing community worldwide",
    color: "from-blue-400 to-cyan-500",
    gradient: "from-blue-400/20 to-cyan-500/20",
    delay: 0.1
  },
  {
    icon: Trophy,
    value: 100,
    suffix: "+",
    title: "Tournaments",
    subtitle: "Live and upcoming events",
    color: "from-yellow-400 to-orange-500",
    gradient: "from-yellow-400/20 to-orange-500/20",
    delay: 0.2
  },
  {
    icon: Award,
    value: 1000000,
    suffix: "M+",
    title: "Prize Pool",
    subtitle: "Total rewards distributed",
    color: "from-green-400 to-emerald-500",
    gradient: "from-green-400/20 to-emerald-500/20",
    delay: 0.3
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    title: "User Rating",
    subtitle: "App store average rating",
    color: "from-purple-400 to-pink-500",
    gradient: "from-purple-400/20 to-pink-500/20",
    delay: 0.4
  },
  {
    icon: Globe,
    value: 25,
    suffix: "+",
    title: "Countries",
    subtitle: "Global player base",
    color: "from-indigo-400 to-purple-500",
    gradient: "from-indigo-400/20 to-purple-500/20",
    delay: 0.5
  },
  {
    icon: Gamepad2,
    value: 500,
    suffix: "K+",
    title: "Matches Played",
    subtitle: "Total fantasy matches",
    color: "from-rose-400 to-pink-500",
    gradient: "from-rose-400/20 to-pink-500/20",
    delay: 0.6
  }
]

function Counter({ 
  value, 
  suffix, 
  duration = 2000 
}: { 
  value: number
  suffix: string
  duration?: number 
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration,
    bounce: 0.1
  })
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])
  
  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        let displayValue: string
        
        if (suffix === "M+") {
          displayValue = (latest / 1000000).toFixed(1)
        } else if (suffix === "K+") {
          displayValue = (latest / 1000).toFixed(0)
        } else if (suffix === "/5") {
          displayValue = latest.toFixed(1)
        } else {
          displayValue = latest.toFixed(0)
        }
        
        ref.current.textContent = displayValue
      }
    })
  }, [springValue, suffix])
  
  return <span ref={ref} />
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
    y: 30,
    scale: 0.95,
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

export function Statistics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
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
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Live Statistics</span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Numbers That
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Tell Our Story
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Join a thriving community of badminton enthusiasts and see why we're the 
            leading fantasy sports platform
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              className="group"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Card 
                variant="glass-strong" 
                className="relative p-8 text-white h-full overflow-hidden cursor-pointer transform-gpu transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Gradient Background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} transition-opacity duration-500`}
                  animate={{ 
                    opacity: hoveredIndex === index ? 1 : 0 
                  }}
                />
                
                {/* Animated Border */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `linear-gradient(45deg, transparent, transparent)`,
                    backgroundImage: `conic-gradient(from 0deg, transparent, var(--tw-gradient-stops), transparent)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Icon and Value */}
                  <div className="flex items-start justify-between">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-xl`}
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </motion.div>

                    <motion.div 
                      className="text-right"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl lg:text-4xl font-black text-white flex items-baseline">
                        <Counter value={stat.value} suffix={stat.suffix} />
                        <span className="text-2xl lg:text-3xl text-white/80 ml-1">
                          {stat.suffix}
                        </span>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <motion.div 
                        className="h-1 bg-white/20 rounded-full mt-2 overflow-hidden"
                        initial={{ width: 0 }}
                      >
                        <motion.div
                          className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                          initial={{ width: "0%" }}
                          animate={isInView ? { width: "100%" } : { width: "0%" }}
                          transition={{ 
                            duration: 1.5, 
                            delay: stat.delay + 0.5,
                            ease: "easeOut"
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-500">
                      {stat.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                      {stat.subtitle}
                    </p>
                  </div>

                  {/* Floating Particles */}
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: stat.delay,
                    }}
                  >
                    <div className="w-2 h-2 bg-white/30 rounded-full" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-6 left-6"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: stat.delay + 1,
                    }}
                  >
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Badges */}
        <motion.div
          className="mt-20 flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {["#1 Fantasy App", "Editor's Choice", "5M+ Downloads", "99.9% Uptime"].map((badge, index) => (
            <motion.div
              key={badge}
              className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 text-white font-semibold"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
            >
              {badge}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, -20px) rotate(-120deg); }
          66% { transform: translate(20px, 30px) rotate(-240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}