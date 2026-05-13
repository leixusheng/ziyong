import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Utensils, ShoppingCart, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mealPlanStorage, recipeStorage, shoppingListStorage } from '@/services/storage'

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    plannedDays: 0,
    completedShopping: 0,
    totalShoppingItems: 0,
    weeklyMeals: 0,
    favoriteCategories: [] as Array<{ category: string; count: number }>,
  })

  useEffect(() => {
    calculateStats()
  }, [])

  const calculateStats = () => {
    const recipes = recipeStorage.getAll()
    const plans = mealPlanStorage.getAll()
    const shopping = shoppingListStorage.getAll()

    // Calculate weekly meals
    const today = new Date()
    let weeklyMeals = 0
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const plan = mealPlanStorage.getByDate(dateStr)
      if (plan) {
        weeklyMeals += plan.breakfast.length + plan.lunch.length + plan.dinner.length + plan.snacks.length
      }
    }

    // Calculate favorite categories
    const categoryCount: Record<string, number> = {}
    recipes.forEach(recipe => {
      categoryCount[recipe.category] = (categoryCount[recipe.category] || 0) + 1
    })
    const favoriteCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    setStats({
      totalRecipes: recipes.length,
      plannedDays: plans.length,
      completedShopping: shopping.filter(i => i.purchased).length,
      totalShoppingItems: shopping.length,
      weeklyMeals,
      favoriteCategories,
    })
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'breakfast': return '早餐'
      case 'lunch': return '午餐'
      case 'dinner': return '晚餐'
      case 'snack': return '加餐'
      default: return category
    }
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'breakfast': return '🌅'
      case 'lunch': return '☀️'
      case 'dinner': return '🌙'
      case 'snack': return '🍪'
      default: return '🍽️'
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Utensils className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.totalRecipes}</p>
            <p className="text-sm text-gray-600">收藏菜谱</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-green-500" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.plannedDays}</p>
            <p className="text-sm text-gray-600">已规划天数</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 text-purple-500" />
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.completedShopping}</p>
            <p className="text-sm text-gray-600">已购物品</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-orange-500" />
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.weeklyMeals}</p>
            <p className="text-sm text-gray-600">本周餐数</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card className="border-orange-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-xl">📊</span>
            菜谱分类统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.favoriteCategories.length > 0 ? (
            <div className="space-y-3">
              {stats.favoriteCategories.map(({ category, count }) => {
                const percentage = stats.totalRecipes > 0
                  ? Math.round((count / stats.totalRecipes) * 100)
                  : 0
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">
                        {getCategoryEmoji(category)} {getCategoryName(category)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count}个 ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">暂无数据，先添加一些菜谱吧！</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shopping Progress */}
      <Card className="border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-xl">🛒</span>
            购物进度
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.totalShoppingItems > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">完成进度</span>
                <span className="text-sm font-semibold">
                  {Math.round((stats.completedShopping / stats.totalShoppingItems) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                  style={{
                    width: `${(stats.completedShopping / stats.totalShoppingItems) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>已购买: {stats.completedShopping}</span>
                <span>待购买: {stats.totalShoppingItems - stats.completedShopping}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">暂无购物清单</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-amber-800">使用提示</p>
              <p className="text-sm text-amber-700 mt-1">
                定期查看统计数据，了解您的饮食习惯。保持菜谱多样性，让家人吃得更健康！
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
