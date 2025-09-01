"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { 
  Plus, 
  MessageCircle, 
  Download, 
  Share2,
  PlayCircle,
  X,
  Headphones,
  BookOpen,
  Zap
} from "lucide-react"

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  action: () => void
}

const actionItems: ActionItem[] = [
  {
    icon: Download,
    label: "Download App",
    color: "from-blue-500 to-cyan-500",
    action: () => {
      // Handle app download
      window.open("#", "_blank")
    }
  },
  {
    icon: PlayCircle,
    label: "Watch Tutorial",
    color: "from-green-500 to-emerald-500",
    action: () => {
      // Handle tutorial video
      console.log("Opening tutorial")
    }
  },
  {
    icon: MessageCircle,
    label: "Live Support",
    color: "from-purple-500 to-pink-500",
    action: () => {
      // Handle live chat
      console.log("Opening support chat")
    }
  },
  {
    icon: Share2,
    label: "Share App",
    color: "from-orange-500 to-red-500",
    action: () => {
      // Handle sharing
      if (navigator.share) {
        navigator.share({
          title: "Dream Badminton - Fantasy Sports",
          text: "Join me on Dream Badminton, the ultimate fantasy badminton experience!",
          url: window.location.href,
        })
      }
    }
  }
]

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle scroll to show/hide FAB
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show FAB when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setIsOpen(false) // Close menu when hiding
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const mainButtonVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
      y: 100,
    },
    visible: { 
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.3,
      }
    }
  }

  const menuItemVariants = {
    hidden: (index: number) => ({
      scale: 0,
      opacity: 0,
      y: 20,
      x: 20,
    }),
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: index * 0.1,
      }
    }),
    exit: (index: number) => ({
      scale: 0,
      opacity: 0,
      y: 20,
      x: 20,
      transition: {
        duration: 0.2,
        delay: (actionItems.length - index - 1) * 0.05,
      }
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Menu Items */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute bottom-20 right-0 space-y-4"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {actionItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    custom={index}
                    variants={menuItemVariants}
                    className="flex items-center gap-4"
                  >
                    {/* Label */}
                    <motion.div
                      className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg border border-white/10"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {item.label}
                    </motion.div>

                    {/* Action Button */}
                    <motion.button
                      onClick={() => {
                        item.action()
                        setIsOpen(false)
                      }}
                      className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 group`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      
                      {/* Ripple Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/20"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            variants={mainButtonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={toggleMenu}
            className={`w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 group relative overflow-hidden`}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 20px 40px -12px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Background Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
              animate={{
                rotate: isOpen ? 180 : 0,
                scale: isOpen ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Icon */}
            <motion.div
              className="relative z-10"
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Plus className="w-7 h-7" />
              )}
            </motion.div>

            {/* Pulse Animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Success Indicator */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Zap className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Quick Actions Hint */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: 2 }}
              >
                Quick Actions
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Backdrop for mobile */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}