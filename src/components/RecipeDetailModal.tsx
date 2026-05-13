import { Clock, Users, Tag } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Recipe } from '@/types'

interface RecipeDetailModalProps {
  recipe: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RecipeDetailModal({ recipe, open, onOpenChange }: RecipeDetailModalProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background shadow-lg animate-fade-in">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm opacity-90">
                  {getCategoryEmoji(recipe.category)} {getCategoryName(recipe.category)}
                </span>
                <h2 className="text-2xl font-bold mt-1">{recipe.name}</h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            {recipe.description && (
              <p className="text-gray-600">{recipe.description}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>准备 {recipe.prepTime} 分钟</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>烹饪 {recipe.cookTime} 分钟</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span>{recipe.servings} 人份</span>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs"
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">🥘</span>
                食材清单
              </h3>
              <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-orange-100 last:border-0">
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-gray-600">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            {recipe.instructions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">👨‍🍳</span>
                  制作步骤
                </h3>
                <div className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="flex-1 pt-1 text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Info */}
            {recipe.nutrition && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  营养信息
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{recipe.nutrition.calories}</p>
                    <p className="text-xs text-gray-600">卡路里</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{recipe.nutrition.protein}g</p>
                    <p className="text-xs text-gray-600">蛋白质</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{recipe.nutrition.carbs}g</p>
                    <p className="text-xs text-gray-600">碳水</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{recipe.nutrition.fat}g</p>
                    <p className="text-xs text-gray-600">脂肪</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
