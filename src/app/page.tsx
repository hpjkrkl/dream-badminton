import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { FeatureShowcase, Statistics, FAQ, Newsletter, Footer, FloatingActionButton, Testimonials } from "@/components/feature"
import { NavBarClerk } from "@/components/NavBar-clerk"
import { Trophy, Users, Activity, Search, BarChart3, Menu, Play, Download } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 relative overflow-hidden transition-colors duration-700">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 dark:bg-white/3 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/5 dark:bg-white/3 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/5 dark:bg-white/3 rounded-full blur-xl"></div>
      </div>

      {/* Navigation */}
      <NavBarClerk />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-white dark:text-white space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight">
                Draft Your <span className="bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">Dream</span> Badminton Team
              </h1>
              <p className="text-2xl lg:text-3xl font-semibold text-white/90 dark:text-white/90 leading-relaxed">
                Play. <span className="text-yellow-300 dark:text-yellow-400">Smash.</span> <span className="text-green-300 dark:text-green-400">Win.</span>
              </p>
              <p className="text-lg text-white/80 dark:text-white/80 leading-relaxed max-w-md">
                Build your ultimate badminton squad, compete with friends, and climb the leaderboards in the most exciting fantasy sports experience.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button size="lg" variant="glass-primary" className="group">
                <Download className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Download App
              </Button>
              <Button size="lg" variant="accent" className="group">
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Play Store
              </Button>
            </div>
          </div>
          
          {/* Enhanced Shuttlecock Animation */}
          <div className="flex justify-center lg:justify-end relative">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-400/30 to-green-400/30 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Main Shuttlecock */}
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 animate-float">
                <div className="w-full h-full bg-gradient-to-br from-white/25 to-white/10 rounded-full backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-2xl">
                  <div className="text-7xl lg:text-9xl animate-bounce">🏸</div>
                </div>
                
                {/* Orbiting Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400/80 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400/80 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-6 w-4 h-4 bg-blue-400/80 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white dark:text-white mb-6">Why Choose Dream Badminton?</h2>
          <p className="text-xl text-white/80 dark:text-white/80 max-w-2xl mx-auto">Experience the ultimate fantasy badminton platform with cutting-edge features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card variant="glass-strong" className="group p-8 text-white hover:scale-[1.02] transition-all duration-500 cursor-pointer hover:rotate-1">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold">Build Your Squad</h3>
              <p className="text-white/90 text-base leading-relaxed">
                Pick from thousands of professional players and create your dream team with strategic formations
              </p>
            </div>
          </Card>

          <Card variant="glass-strong" className="group p-8 text-white hover:scale-[1.02] transition-all duration-500 cursor-pointer hover:-rotate-1">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl transform group-hover:-rotate-12 transition-transform duration-500">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold">Track Live Matches</h3>
              <p className="text-white/90 text-base leading-relaxed">
                Get real-time updates, detailed statistics, and live scoring from tournaments worldwide
              </p>
            </div>
          </Card>

          <Card variant="glass-strong" className="group p-8 text-white hover:scale-[1.02] transition-all duration-500 cursor-pointer hover:rotate-1">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
              </div>
              <h3 className="text-2xl font-bold">Climb Leaderboards</h3>
              <p className="text-white/90 text-base leading-relaxed">
                Compete globally, challenge friends, and earn rewards as you rise through the ranks
              </p>
            </div>
          </Card>
        </div>

        {/* App Screenshots */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white dark:text-white mb-6">Experience the App</h2>
          <p className="text-xl text-white/80 dark:text-white/80 max-w-2xl mx-auto">Take a look at our beautifully designed mobile experience</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Builder Screenshot */}
          <Card variant="mockup" className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            {/* Phone Frame */}
            <div className="bg-black rounded-3xl p-2 mx-auto w-80">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                {/* Status Bar */}
                <div className="bg-black px-6 py-3 flex justify-between items-center text-white text-sm">
                  <span className="font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white/60 rounded-sm">
                      <div className="w-3 h-1 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Search className="w-5 h-5 text-gray-400" />
                    <div className="bg-gray-800 rounded-xl px-4 py-3 flex-1 text-gray-400 text-sm">
                      Search players...
                    </div>
                  </div>
                  
                  {/* Enhanced Player Cards */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                          <span className="text-lg font-bold">S</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg">Stonens</div>
                          <div className="text-blue-100 text-sm">Rank #38 • 2.4M pts</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">$12.5</div>
                          <div className="text-blue-100 text-xs">Price</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                          <span className="text-lg font-bold">F</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg">Feccy</div>
                          <div className="text-green-100 text-sm">Rank #6 • 3.1M pts</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">$15.2</div>
                          <div className="text-green-100 text-xs">Price</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">🏆</div>
                      <span className="text-gray-300">Smash Master Achievement</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">👑</div>
                      <span className="text-gray-300">Rally King Champion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* My Team Screenshot */}
          <Card variant="mockup" className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className="bg-black rounded-3xl p-2 mx-auto w-80">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                {/* Status Bar */}
                <div className="bg-black px-6 py-3 flex justify-between items-center text-white text-sm">
                  <span className="font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white/60 rounded-sm">
                      <div className="w-3 h-1 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-2xl text-white">My Team</h3>
                    <div className="bg-green-500 px-3 py-1 rounded-full text-white text-sm font-semibold">
                      Live
                    </div>
                  </div>
                  
                  {/* Team Performance */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
                        <div className="text-sm text-blue-100 mb-2">Stonens</div>
                        <div className="text-3xl font-bold mb-1">156</div>
                        <div className="text-blue-100 text-xs">Fantasy Points</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
                        <div className="text-sm text-green-100 mb-2">Team Total</div>
                        <div className="text-3xl font-bold mb-1">892</div>
                        <div className="text-green-100 text-xs">Points</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Match */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300 text-sm">Last Match</span>
                      <span className="text-green-400 text-sm font-semibold">+45 pts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">🏸</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Championship Final</div>
                        <div className="text-gray-400 text-sm">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Leaderboard Screenshot */}
          <Card variant="mockup" className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className="bg-black rounded-3xl p-2 mx-auto w-80">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                {/* Status Bar */}
                <div className="bg-black px-6 py-3 flex justify-between items-center text-white text-sm">
                  <span className="font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white/60 rounded-sm">
                      <div className="w-3 h-1 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">👑</span>
                    </div>
                    <h3 className="font-bold text-xl text-white mb-1">byrarch</h3>
                    <p className="text-gray-400 text-sm">Rank #1 Global</p>
                  </div>
                  
                  {/* Performance Chart */}
                  <div className="bg-gray-800 rounded-xl p-5">
                    <div className="text-white font-semibold mb-4">Weekly Performance</div>
                    <div className="flex items-end gap-2 h-16 mb-4">
                      {[65, 80, 55, 90, 75, 95, 85].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm transition-all duration-500 hover:from-green-500 hover:to-green-300"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-gray-400">{['M','T','W','T','F','S','S'][i]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">1,247</div>
                      <div className="text-green-400 text-sm">+12.5% this week</div>
                    </div>
                  </div>

                  {/* Tournament Joins */}
                  <div className="space-y-3">
                    <div className="text-white font-semibold">Active Tournaments</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white text-sm font-semibold hover:shadow-lg transition-all">
                        Elite Pro
                      </button>
                      <button className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white text-sm font-semibold hover:shadow-lg transition-all">
                        Champion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Advanced Feature Showcase */}
      <FeatureShowcase />

      {/* Live Statistics Section */}
      <Statistics />

      {/* User Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter Subscription */}
      <Newsletter />

      {/* Enhanced Footer */}
      <Footer />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  )
}
