import { useState } from 'react'
import { X, Plus, Minus, Save } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { recipeStorage } from '@/services/storage'
import { Recipe, Ingredient } from '@/types'

interface AddRecipeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRecipeAdded?: () => void
}

export default function AddRecipeModal({ open, onOpenChange, onRecipeAdded }: AddRecipeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'breakfast' as Recipe['category'],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    tags: '',
  })

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: 1, unit: '克' },
  ])

  const [instructions, setInstructions] = useState<string[]>([''])

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 1, unit: '克' }])
  }

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: any) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  const handleAddInstruction = () => {
    setInstructions([...instructions, ''])
  }

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('请输入菜谱名称')
      return
    }

    const validIngredients = ingredients.filter(i => i.name.trim())
    const validInstructions = instructions.filter(i => i.trim())

    if (validIngredients.length === 0) {
      alert('请至少添加一个食材')
      return
    }

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      ingredients: validIngredients,
      instructions: validInstructions,
      prepTime: formData.prepTime,
      cookTime: formData.cookTime,
      servings: formData.servings,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    recipeStorage.add(newRecipe)
    onRecipeAdded?.()
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'breakfast',
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      tags: '',
    })
    setIngredients([{ name: '', quantity: 1, unit: '克' }])
    setInstructions([''])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background shadow-lg animate-fade-in">
          <DialogHeader className="sticky top-0 bg-background z-10 border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">添加新菜谱</DialogTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <DialogContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">菜谱名称 *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：番茄炒蛋"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">描述</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简单描述一下这道菜..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="breakfast">早餐</option>
                    <option value="lunch">午餐</option>
                    <option value="dinner">晚餐</option>
                    <option value="snack">加餐</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">标签</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="用逗号分隔，如：快手,低脂"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">准备时间(分)</label>
                  <Input
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">烹饪时间(分)</label>
                  <Input
                    type="number"
                    value={formData.cookTime}
                    onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">份量(人)</label>
                  <Input
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">食材 *</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddIngredient}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="食材名称"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="数量"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20"
                    />
                    <Input
                      placeholder="单位"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      className="w-20"
                    />
                    {ingredients.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-500"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">制作步骤</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddInstruction}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
              <div className="space-y-2">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="flex items-center text-sm text-gray-500 w-6">{index + 1}.</span>
                    <Textarea
                      placeholder={`步骤 ${index + 1}`}
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    {instructions.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveInstruction(index)}
                        className="text-red-500 self-start"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>

          <DialogFooter className="sticky bottom-0 bg-background border-t px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Save className="w-4 h-4 mr-2" />
              保存菜谱
            </Button>
          </DialogFooter>
        </div>
      </div>
    </Dialog>
  )
}
