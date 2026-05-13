import { useState, useEffect } from 'react'
import { Check, Trash2, Plus, ShoppingCart, Sparkles, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { shoppingListStorage, mealPlanStorage, recipeStorage } from '@/services/storage'
import { ShoppingListItem } from '@/types'

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [newItemUnit, setNewItemUnit] = useState('克')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    const allItems = shoppingListStorage.getAll()
    setItems(allItems)
  }

  const handleAddItem = () => {
    if (!newItemName.trim()) return

    shoppingListStorage.addItem({
      name: newItemName,
      quantity: newItemQuantity,
      unit: newItemUnit,
      purchased: false,
    })

    setNewItemName('')
    setNewItemQuantity(1)
    loadItems()
  }

  const handleTogglePurchased = (id: string) => {
    shoppingListStorage.togglePurchased(id)
    loadItems()
  }

  const handleDeleteItem = (id: string) => {
    shoppingListStorage.deleteItem(id)
    loadItems()
  }

  const generateFromMealPlan = () => {
    // Get next 7 days meal plans
    const today = new Date()
    const ingredientsMap = new Map<string, { quantity: number; unit: string }>()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const plan = mealPlanStorage.getByDate(dateStr)

      if (plan) {
        const allMeals = [...plan.breakfast, ...plan.lunch, ...plan.dinner, ...plan.snacks]
        allMeals.forEach(meal => {
          const recipe = recipeStorage.getById(meal.recipeId)
          if (recipe) {
            const servingMultiplier = meal.servings / recipe.servings
            recipe.ingredients.forEach(ingredient => {
              const key = `${ingredient.name}-${ingredient.unit}`
              const existing = ingredientsMap.get(key)
              if (existing) {
                existing.quantity += ingredient.quantity * servingMultiplier
              } else {
                ingredientsMap.set(key, {
                  quantity: ingredient.quantity * servingMultiplier,
                  unit: ingredient.unit,
                })
              }
            })
          }
        })
      }
    }

    // Clear existing items and add generated ones
    shoppingListStorage.clearAll()
    ingredientsMap.forEach(({ quantity, unit }, key) => {
      const name = key.split('-')[0]
      shoppingListStorage.addItem({
        name,
        quantity: Math.round(quantity * 10) / 10,
        unit,
        purchased: false,
      })
    })

    loadItems()
    alert('已根据未来7天的餐单生成购物清单！')
  }

  const clearPurchased = () => {
    const remaining = items.filter(item => !item.purchased)
    shoppingListStorage.save(remaining)
    loadItems()
  }

  const pendingItems = items.filter(i => !i.purchased)
  const purchasedItems = items.filter(i => i.purchased)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Generate Button */}
      <Card className="border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">智能生成购物清单</p>
                <p className="text-xs text-gray-600">根据未来7天餐单自动生成</p>
              </div>
            </div>
            <Button
              onClick={generateFromMealPlan}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              生成
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Item */}
      <Card className="border-orange-100">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="添加物品名称..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1"
            />
            <Input
              type="number"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseFloat(e.target.value) || 1)}
              className="w-20"
            />
            <Input
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="w-20"
            />
            <Button
              onClick={handleAddItem}
              size="icon"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shopping List */}
      <Card className="border-orange-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              <span>购物清单</span>
            </div>
            {purchasedItems.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearPurchased}
                className="text-gray-500"
              >
                清除已购
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="space-y-2">
              {/* Pending Items */}
              {pendingItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:border-orange-200 transition-colors"
                >
                  <button
                    onClick={() => handleTogglePurchased(item.id)}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 flex items-center justify-center transition-colors"
                  >
                  </button>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Purchased Items */}
              {purchasedItems.length > 0 && (
                <>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">已购买</p>
                  </div>
                  {purchasedItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg opacity-60"
                    >
                      <button
                        onClick={() => handleTogglePurchased(item.id)}
                        className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>
                      <div className="flex-1">
                        <p className="font-medium line-through text-gray-500">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">购物清单为空</p>
              <p className="text-sm text-gray-400 mt-1">
                手动添加或点击"智能生成"按钮
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
