import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { recipeStorage, mealPlanStorage } from '@/services/storage'
import { Recipe, DailyMealPlan, MealItem } from '@/types'
import SelectRecipeModal from '@/components/SelectRecipeModal'

export default function MealPlanPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [mealPlan, setMealPlan] = useState<DailyMealPlan | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showSelectModal, setShowSelectModal] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast')

  useEffect(() => {
    loadRecipes()
    loadMealPlan()
  }, [currentDate])

  const loadRecipes = () => {
    const allRecipes = recipeStorage.getAll()
    setRecipes(allRecipes)
  }

  const loadMealPlan = () => {
    const dateStr = formatDate(currentDate)
    const plan = mealPlanStorage.getByDate(dateStr)
    setMealPlan(plan || {
      date: dateStr,
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    })
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getDisplayDate = () => {
    const today = new Date()
    const isToday = formatDate(today) === formatDate(currentDate)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = formatDate(yesterday) === formatDate(currentDate)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isTomorrow = formatDate(tomorrow) === formatDate(currentDate)

    if (isToday) return '今天'
    if (isYesterday) return '昨天'
    if (isTomorrow) return '明天'

    return `${currentDate.getMonth() + 1}月${currentDate.getDate()}日`
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const handleAddMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    setSelectedMealType(mealType)
    setShowSelectModal(true)
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!mealPlan) return

    const newItem: MealItem = {
      recipeId: recipe.id,
      servings: recipe.servings,
    }

    const updatedPlan = {
      ...mealPlan,
      [selectedMealType]: [...mealPlan[selectedMealType], newItem],
    }

    mealPlanStorage.setDayPlan(updatedPlan)
    setMealPlan(updatedPlan)
    setShowSelectModal(false)
  }

  const handleRemoveMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', index: number) => {
    if (!mealPlan) return

    const updatedPlan = {
      ...mealPlan,
      [mealType]: mealPlan[mealType].filter((_, i) => i !== index),
    }

    mealPlanStorage.setDayPlan(updatedPlan)
    setMealPlan(updatedPlan)
  }

  const generateRandomPlan = () => {
    if (recipes.length === 0) {
      alert('请先添加一些菜谱！')
      return
    }

    const breakfastRecipes = recipes.filter(r => r.category === 'breakfast')
    const lunchRecipes = recipes.filter(r => r.category === 'lunch')
    const dinnerRecipes = recipes.filter(r => r.category === 'dinner')
    const snackRecipes = recipes.filter(r => r.category === 'snack')

    const getRandomRecipe = (pool: Recipe[]) => {
      if (pool.length === 0) return null
      return pool[Math.floor(Math.random() * pool.length)]
    }

    const breakfast = getRandomRecipe(breakfastRecipes)
    const lunch = getRandomRecipe(lunchRecipes)
    const dinner = getRandomRecipe(dinnerRecipes)
    const snack = getRandomRecipe(snackRecipes)

    const dateStr = formatDate(currentDate)
    const newPlan: DailyMealPlan = {
      date: dateStr,
      breakfast: breakfast ? [{ recipeId: breakfast.id, servings: breakfast.servings }] : [],
      lunch: lunch ? [{ recipeId: lunch.id, servings: lunch.servings }] : [],
      dinner: dinner ? [{ recipeId: dinner.id, servings: dinner.servings }] : [],
      snacks: snack ? [{ recipeId: snack.id, servings: snack.servings }] : [],
    }

    mealPlanStorage.setDayPlan(newPlan)
    setMealPlan(newPlan)
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

  const getMealEmoji = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅'
      case 'lunch': return '☀️'
      case 'dinner': return '🌙'
      case 'snacks': return '🍪'
      default: return '🍽️'
    }
  }

  if (!mealPlan) return null

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Date Navigation */}
      <Card className="border-orange-100 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold">{getDisplayDate()}</h2>
              <p className="text-sm text-gray-500">
                {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Random Generate Button */}
      <Button
        onClick={generateRandomPlan}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-6"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        ✨ 智能生成今日菜单
      </Button>

      {/* Meal Sections */}
      <div className="space-y-3">
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map(mealType => (
          <Card key={mealType} className="border-orange-100 hover:border-orange-200 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMealEmoji(mealType)}</span>
                  <span>{getMealName(mealType)}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddMeal(mealType)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mealPlan[mealType].length > 0 ? (
                <div className="space-y-2">
                  {mealPlan[mealType].map((item, index) => {
                    const recipe = recipeStorage.getById(item.recipeId)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{recipe?.name || '未知菜谱'}</p>
                          <p className="text-xs text-gray-500">
                            {recipe ? `${recipe.prepTime + recipe.cookTime}分钟 · ${item.servings}人份` : ''}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveMeal(mealType, index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂未安排</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Select Recipe Modal */}
      <SelectRecipeModal
        open={showSelectModal}
        onOpenChange={setShowSelectModal}
        recipes={recipes}
        onSelectRecipe={handleSelectRecipe}
        categoryFilter={selectedMealType === 'snacks' ? 'snack' : selectedMealType}
      />
    </div>
  )
}
