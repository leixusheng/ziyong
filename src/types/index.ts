// 菜谱类型定义
export interface Recipe {
  id: string
  name: string
  description: string
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ingredients: Ingredient[]
  instructions: string[]
  prepTime: number // 准备时间（分钟）
  cookTime: number // 烹饪时间（分钟）
  servings: number // 份量
  nutrition?: NutritionInfo
  tags: string[]
  image?: string
  createdAt: string
  updatedAt: string
}

// 食材
export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

// 营养信息
export interface NutritionInfo {
  calories: number
  protein: number // 蛋白质(g)
  carbs: number // 碳水化合物(g)
  fat: number // 脂肪(g)
  fiber?: number // 纤维(g)
}

// 每日餐单
export interface DailyMealPlan {
  date: string // YYYY-MM-DD
  breakfast: MealItem[]
  lunch: MealItem[]
  dinner: MealItem[]
  snacks: MealItem[]
}

// 餐单项
export interface MealItem {
  recipeId: string
  servings: number
}

// 购物清单项
export interface ShoppingListItem {
  id: string
  name: string
  quantity: number
  unit: string
  purchased: boolean
  category?: string
}

// 用户偏好
export interface UserPreferences {
  dietaryRestrictions: string[]
  favoriteRecipes: string[]
  excludedIngredients: string[]
  targetCalories?: number
}
