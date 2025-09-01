"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui"
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Trophy,
  Heart,
  ThumbsUp,
  Award,
  Users
} from "lucide-react"

interface Testimonial {
  id: string
  name: string
  username: string
  role: string
  avatar: string
  rating: number
  review: string
  date: string
  verified: boolean
  platform: "app_store" | "google_play" | "community"
  achievement?: string
  stats?: {
    wins: number
    rank: string
    points: string
  }
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Alex Chen",
    username: "@alexbadmintonpro",
    role: "Professional Player",
    avatar: "AC",
    rating: 5,
    review: "Dream Badminton has completely transformed how I engage with the sport I love. The analytics are incredible, and the real-time updates keep me hooked during every tournament. It's like having a premium sports platform right in your pocket!",
    date: "2024-01-15",
    verified: true,
    platform: "app_store",
    achievement: "Tournament Champion",
    stats: { wins: 342, rank: "#8", points: "2.4M" }
  },
  {
    id: "2",
    name: "Sarah Johnson",
    username: "@sarahsmashes",
    role: "Fantasy Enthusiast",
    avatar: "SJ",
    rating: 5,
    review: "I've tried many fantasy sports apps, but Dream Badminton stands out with its beautiful interface and engaging gameplay. The community is amazing, and the weekly tournaments add so much excitement to watching badminton matches.",
    date: "2024-01-12",
    verified: true,
    platform: "google_play",
    achievement: "Rising Star",
    stats: { wins: 128, rank: "#45", points: "850K" }
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    username: "@miketheace",
    role: "Fantasy League Manager",
    avatar: "MR",
    rating: 5,
    review: "Managing my fantasy team has never been more fun! The player statistics are detailed, the scoring system is fair, and the app's performance is flawless. My friends and I are completely addicted to the head-to-head battles.",
    date: "2024-01-10",
    verified: true,
    platform: "community",
    achievement: "League Master",
    stats: { wins: 256, rank: "#22", points: "1.8M" }
  },
  {
    id: "4",
    name: "Emily Zhang",
    username: "@emilyshuttles",
    role: "Badminton Coach",
    avatar: "EZ",
    rating: 5,
    review: "As a coach, I love how this app helps my students stay engaged with professional badminton. The educational content and real-time statistics make it perfect for understanding player performance and match dynamics.",
    date: "2024-01-08",
    verified: true,
    platform: "app_store",
    achievement: "Mentor Badge",
    stats: { wins: 189, rank: "#31", points: "1.2M" }
  },
  {
    id: "5",
    name: "David Kumar",
    username: "@davidplays",
    role: "Weekend Warrior",
    avatar: "DK",
    rating: 4,
    review: "Great app with smooth gameplay and excellent graphics. The tutorial was helpful for getting started, and the customer support team is very responsive. Looking forward to more features and tournaments!",
    date: "2024-01-05",
    verified: true,
    platform: "google_play",
    achievement: "Quick Learner",
    stats: { wins: 67, rank: "#156", points: "420K" }
  },
  {
    id: "6",
    name: "Lisa Thompson",
    username: "@lisaaces",
    role: "Tournament Organizer",
    avatar: "LT",
    rating: 5,
    review: "The tournament features are outstanding! Creating and managing fantasy leagues for our local badminton community has never been easier. The app handles everything seamlessly, from player drafts to final rankings.",
    date: "2024-01-03",
    verified: true,
    platform: "community",
    achievement: "Community Leader",
    stats: { wins: 298, rank: "#15", points: "2.1M" }
  }
]

const platformIcons = {
  app_store: "🍎",
  google_play: "🤖",
  community: "👥"
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

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 2))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 2))
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2))
    setIsAutoPlaying(false)
  }

  const getVisibleTestimonials = () => {
    const testimonialsPerView = 2
    const startIndex = currentIndex * testimonialsPerView
    return testimonials.slice(startIndex, startIndex + testimonialsPerView)
  }

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
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
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-white font-semibold">Testimonials</span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            What Our Players
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied players who have made Dream Badminton 
            their go-to fantasy sports platform
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            { icon: Star, value: "4.9", label: "Average Rating", color: "from-yellow-400 to-orange-500" },
            { icon: Users, value: "50K+", label: "Happy Players", color: "from-blue-400 to-cyan-500" },
            { icon: ThumbsUp, value: "98%", label: "Satisfaction", color: "from-green-400 to-emerald-500" },
            { icon: Award, value: "#1", label: "Fantasy App", color: "from-purple-400 to-pink-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Testimonials Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card 
                    variant="glass-strong" 
                    className="p-8 text-white h-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <motion.div
                            className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {testimonial.avatar}
                          </motion.div>
                          
                          {/* User Info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{testimonial.name}</h3>
                              {testimonial.verified && (
                                <motion.div
                                  className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                  whileHover={{ scale: 1.2 }}
                                >
                                  ✓
                                </motion.div>
                              )}
                            </div>
                            <p className="text-white/70 text-sm">{testimonial.username}</p>
                            <p className="text-white/60 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        
                        {/* Platform Badge */}
                        <motion.div
                          className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 text-xs font-medium border border-white/20"
                          whileHover={{ scale: 1.05 }}
                        >
                          {platformIcons[testimonial.platform]} {testimonial.platform.replace('_', ' ')}
                        </motion.div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }, (_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <Star 
                              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-white/30'}`}
                            />
                          </motion.div>
                        ))}
                        <span className="ml-2 text-white/70 text-sm">({testimonial.rating}/5)</span>
                      </div>

                      {/* Quote */}
                      <div className="relative mb-6">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/20" />
                        <p className="text-white/90 leading-relaxed pl-6 italic">
                          "{testimonial.review}"
                        </p>
                      </div>

                      {/* Stats and Achievement */}
                      {testimonial.stats && (
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-white font-bold">{testimonial.stats.wins}</div>
                              <div className="text-white/60 text-xs">Wins</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-bold">{testimonial.stats.rank}</div>
                              <div className="text-white/60 text-xs">Rank</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-bold">{testimonial.stats.points}</div>
                              <div className="text-white/60 text-xs">Points</div>
                            </div>
                          </div>
                          
                          {testimonial.achievement && (
                            <motion.div
                              className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium border border-yellow-400/30"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Trophy className="w-3 h-3 inline mr-1 text-yellow-400" />
                              {testimonial.achievement}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(testimonials.length / 2) }, (_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h3>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the excitement that thousands of players are talking about. 
            Download Dream Badminton today and start your fantasy journey!
          </p>
          <motion.button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              <Play className="w-6 h-6" />
              Start Playing Now
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}