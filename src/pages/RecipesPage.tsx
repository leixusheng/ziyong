import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, Clock, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { recipeStorage } from '@/services/storage'
import { Recipe } from '@/types'
import AddRecipeModal from '@/components/AddRecipeModal'
import RecipeDetailModal from '@/components/RecipeDetailModal'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = () => {
    const allRecipes = recipeStorage.getAll()
    setRecipes(allRecipes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: 'all', label: '全部', emoji: '📋' },
    { value: 'breakfast', label: '早餐', emoji: '🌅' },
    { value: 'lunch', label: '午餐', emoji: '☀️' },
    { value: 'dinner', label: '晚餐', emoji: '🌙' },
    { value: 'snack', label: '加餐', emoji: '🍪' },
  ]

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个菜谱吗？')) {
      recipeStorage.delete(id)
      loadRecipes()
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索菜谱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <Button
              key={cat.value}
              size="sm"
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.value)}
              className={`whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : ''
              }`}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Recipe Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          共 <span className="font-semibold text-orange-500">{filteredRecipes.length}</span> 个菜谱
        </p>
        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加菜谱
        </Button>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecipes.map(recipe => (
            <Card
              key={recipe.id}
              className="border-orange-100 hover:border-orange-300 transition-all cursor-pointer hover:shadow-md"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg line-clamp-1">{recipe.name}</h3>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Edit functionality
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(recipe.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{recipe.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{recipe.prepTime + recipe.cookTime}分钟</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{recipe.servings}人份</span>
                  </div>
                </div>

                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{recipe.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {searchTerm || selectedCategory !== 'all' ? '没有找到匹配的菜谱' : '还没有收藏菜谱'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all'
              ? '试试其他搜索词或分类'
              : '开始添加您的第一个菜谱吧！'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加菜谱
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddRecipeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onRecipeAdded={loadRecipes}
      />

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          open={!!selectedRecipe}
          onOpenChange={(open) => !open && setSelectedRecipe(null)}
        />
      )}
    </div>
  )
}
