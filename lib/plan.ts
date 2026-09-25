export type PlanTier = 'free' | 'basic' | 'premium'

export const PLAN_LIMITS = {
  free: {
    name: 'Starter',
    receiptsLimit: 15, // Evaluated as LIFETIME
    maxCustomers: 5,
    maxProducts: 5,
    features: {
      customLogo: false,
      removeWatermark: false,
      advancedDashboard: false, 
      dataExport: false,
      sidebarApps: false // 🚀 NEW: Controls Expenses & Analytics
    }
  },
  basic: {
    name: 'Growing Business',
    receiptsLimit: 100, // Evaluated as PER MONTH
    maxCustomers: 200,
    maxProducts: 100,
    features: {
      customLogo: true, // Basic gets branding!
      removeWatermark: true,
      advancedDashboard: true,
      dataExport: true,
      sidebarApps: false // 🚀 STRICT: Basic does NOT get Expenses/Analytics
    }
  },
  premium: {
    name: 'Serious Business',
    receiptsLimit: -1, // Unlimited
    maxCustomers: -1,
    maxProducts: -1,
    features: {
      customLogo: true,
      removeWatermark: true,
      advancedDashboard: true,
      dataExport: true,
      sidebarApps: true // 🚀 ONLY Premium gets everything
    }
  }
} as const

export function getPlanLimits(tier: string | null | undefined) {
  const safeTier = (tier === 'basic' || tier === 'premium') ? tier : 'free'
  return PLAN_LIMITS[safeTier]
}