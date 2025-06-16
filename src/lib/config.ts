export const config = {
  app: {
    name: 'NutriSnap',
    description: 'AI-powered nutritional tracking application',
    version: '1.0.0',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds
  },
  auth: {
    providers: ['google', 'github'],
    session: {
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  },
  ai: {
    model: 'gpt-4-vision-preview',
    maxTokens: 1000,
  },
  nutrition: {
    defaultGoals: {
      calories: 2000,
      protein: 150, // grams
      carbs: 250, // grams
      fat: 65, // grams
    },
  },
  storage: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;

export type Config = typeof config; 