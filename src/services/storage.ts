import { Recipe, DailyMealPlan, ShoppingListItem, UserPreferences } from '@/types'

const STORAGE_KEYS = {
  RECIPES: 'meal-planner-recipes',
  MEAL_PLANS: 'meal-planner-meal-plans',
  SHOPPING_LIST: 'meal-planner-shopping-list',
  PREFERENCES: 'meal-planner-preferences',
}

// 菜谱存储
export const recipeStorage = {
  getAll(): Recipe[] {
    const data = localStorage.getItem(STORAGE_KEYS.RECIPES)
    return data ? JSON.parse(data) : []
  },

  save(recipes: Recipe[]) {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes))
  },

  add(recipe: Recipe) {
    const recipes = this.getAll()
    recipes.push(recipe)
    this.save(recipes)
  },

  update(id: string, updates: Partial<Recipe>) {
    const recipes = this.getAll()
    const index = recipes.findIndex(r => r.id === id)
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...updates, updatedAt: new Date().toISOString() }
      this.save(recipes)
    }
  },

  delete(id: string) {
    const recipes = this.getAll()
    this.save(recipes.filter(r => r.id !== id))
  },

  getById(id: string): Recipe | undefined {
    return this.getAll().find(r => r.id === id)
  },
}

// 餐单存储
export const mealPlanStorage = {
  getAll(): DailyMealPlan[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_PLANS)
    return data ? JSON.parse(data) : []
  },

  save(plans: DailyMealPlan[]) {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(plans))
  },

  getByDate(date: string): DailyMealPlan | undefined {
    return this.getAll().find(p => p.date === date)
  },

  setDayPlan(plan: DailyMealPlan) {
    const plans = this.getAll()
    const index = plans.findIndex(p => p.date === plan.date)
    if (index !== -1) {
      plans[index] = plan
    } else {
      plans.push(plan)
    }
    this.save(plans)
  },

  deleteDate(date: string) {
    const plans = this.getAll()
    this.save(plans.filter(p => p.date !== date))
  },
}

// 购物清单存储
export const shoppingListStorage = {
  getAll(): ShoppingListItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST)
    return data ? JSON.parse(data) : []
  },

  save(items: ShoppingListItem[]) {
    localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items))
  },

  addItem(item: Omit<ShoppingListItem, 'id'>) {
    const items = this.getAll()
    const newItem: ShoppingListItem = {
      ...item,
      id: Date.now().toString(),
    }
    items.push(newItem)
    this.save(items)
    return newItem
  },

  togglePurchased(id: string) {
    const items = this.getAll()
    const item = items.find(i => i.id === id)
    if (item) {
      item.purchased = !item.purchased
      this.save(items)
    }
  },

  deleteItem(id: string) {
    const items = this.getAll()
    this.save(items.filter(i => i.id !== id))
  },

  clearAll() {
    this.save([])
  },
}

// 用户偏好存储
export const preferencesStorage = {
  get(): UserPreferences {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
    return data ? JSON.parse(data) : {
      dietaryRestrictions: [],
      favoriteRecipes: [],
      excludedIngredients: [],
    }
  },

  save(preferences: UserPreferences) {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
  },
}
