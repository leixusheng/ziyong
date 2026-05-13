import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Calendar, ShoppingCart, BarChart3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HomePage from '@/pages/HomePage'
import RecipesPage from '@/pages/RecipesPage'
import MealPlanPage from '@/pages/MealPlanPage'
import ShoppingListPage from '@/pages/ShoppingListPage'
import StatsPage from '@/pages/StatsPage'
import AddRecipeModal from '@/components/AddRecipeModal'
import { initializePregnancyRecipes } from '@/data/pregnancy-recipes'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // 初始化孕妇营养菜谱
  useEffect(() => {
    if (!initialized) {
      const count = initializePregnancyRecipes()
      if (count > 0) {
        console.log(`已自动添加 ${count} 个孕妇营养菜谱`)
      }
      setInitialized(true)
    }
  }, [initialized])

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/recipes', icon: BookOpen, label: '菜谱' },
    { path: '/meal-plan', icon: Calendar, label: '餐单' },
    { path: '/shopping', icon: ShoppingCart, label: '购物' },
    { path: '/stats', icon: BarChart3, label: '统计' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            🍽️ 家庭餐单
          </h1>
          <Button
            size="sm"
            onClick={() => setShowAddRecipe(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            添加菜谱
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/meal-plan" element={<MealPlanPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-orange-100 shadow-lg safe-area-bottom">
        <div className="container mx-auto px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                    isActive
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-gray-500 hover:text-orange-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Add Recipe Modal */}
      <AddRecipeModal
        open={showAddRecipe}
        onOpenChange={setShowAddRecipe}
      />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
