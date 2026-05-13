import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChefHat, ShoppingCart, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { recipeStorage, mealPlanStorage, shoppingListStorage } from '@/services/storage'
import { DailyMealPlan } from '@/types'

export default function HomePage() {
  const navigate = useNavigate()
  const [todayPlan, setTodayPlan] = useState<DailyMealPlan | null>(null)
  const [stats, setStats] = useState({
    recipes: 0,
    plannedDays: 0,
    shoppingItems: 0,
  })

  useEffect(() => {
    // 获取今日餐单
    const today = new Date().toISOString().split('T')[0]
    const plan = mealPlanStorage.getByDate(today)
    setTodayPlan(plan || null)

    // 获取统计数据
    const recipes = recipeStorage.getAll()
    const plans = mealPlanStorage.getAll()
    const shopping = shoppingListStorage.getAll()

    setStats({
      recipes: recipes.length,
      plannedDays: plans.length,
      shoppingItems: shopping.filter(i => !i.purchased).length,
    })
  }, [])

  const getMealEmoji = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅'
      case 'lunch': return '☀️'
      case 'dinner': return '🌙'
      case 'snacks': return '🍪'
      default: return '🍽️'
    }
  }

  const getMealName = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '早餐'
      case 'lunch': return '午餐'
      case 'dinner': return '晚餐'
      case 'snacks': return '加餐'
      default: return ''
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">欢迎使用家庭餐单 👋</h2>
          <p className="text-orange-50 opacity-90">智能规划每日饮食，让家人吃得更健康</p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 opacity-20">
          <ChefHat className="w-full h-full" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => navigate('/meal-plan')}
          className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-sm font-medium">随机生成菜单</span>
        </Button>
        <Button
          onClick={() => navigate('/recipes')}
          className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <Plus className="w-6 h-6" />
          <span className="text-sm font-medium">添加新菜谱</span>
        </Button>
      </div>

      {/* Today's Meal Plan */}
      <Card className="border-orange-100 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">今日餐单</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/meal-plan')}
              className="text-orange-500"
            >
              查看全部 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayPlan ? (
            <div className="space-y-3">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                const meals = todayPlan[mealType]
                return (
                  <div key={mealType} className="flex items-center gap-3 p-3 rounded-lg bg-orange-50/50">
                    <span className="text-2xl">{getMealEmoji(mealType)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{getMealName(mealType)}</p>
                      {meals.length > 0 ? (
                        <p className="text-sm text-gray-600">
                          {meals.map(m => {
                            const recipe = recipeStorage.getById(m.recipeId)
                            return recipe?.name
                          }).filter(Boolean).join(', ') || '未设置'}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">暂未安排</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">今日暂无餐单安排</p>
              <Button
                size="sm"
                onClick={() => navigate('/meal-plan')}
                className="mt-3 bg-orange-500 hover:bg-orange-600"
              >
                去规划
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-blue-100">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-blue-600">{stats.recipes}</p>
            <p className="text-xs text-gray-500">收藏菜谱</p>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-green-600">{stats.plannedDays}</p>
            <p className="text-xs text-gray-500">已规划天数</p>
          </CardContent>
        </Card>
        <Card className="border-purple-100">
          <CardContent className="p-4 text-center">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-purple-600">{stats.shoppingItems}</p>
            <p className="text-xs text-gray-500">待购物品</p>
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-amber-800">小贴士</p>
              <p className="text-sm text-amber-700 mt-1">
                点击底部导航栏的"菜谱"可以管理您的菜谱库，然后点击"随机生成菜单"让系统为您智能搭配一周餐单！
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BookOpen(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function Plus(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
