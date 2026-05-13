import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Recipe } from '@/types'

interface SelectRecipeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipes: Recipe[]
  onSelectRecipe: (recipe: Recipe) => void
  categoryFilter?: string
}

export default function SelectRecipeModal({
  open,
  onOpenChange,
  recipes,
  onSelectRecipe,
  categoryFilter,
}: SelectRecipeModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  if (!open) return null

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || recipe.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-t-lg sm:rounded-lg bg-background shadow-lg animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 border-b px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">选择菜谱</h3>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索菜谱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recipe List */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {filteredRecipes.length > 0 ? (
            <div className="space-y-2">
              {filteredRecipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => {
                    onSelectRecipe(recipe)
                    onOpenChange(false)
                  }}
                  className="w-full text-left p-3 rounded-lg border hover:border-orange-300 hover:bg-orange-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{recipe.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {recipe.prepTime + recipe.cookTime}分钟 · {recipe.servings}人份
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                      {recipe.category === 'breakfast' ? '早餐' :
                       recipe.category === 'lunch' ? '午餐' :
                       recipe.category === 'dinner' ? '晚餐' : '加餐'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">没有找到匹配的菜谱</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
