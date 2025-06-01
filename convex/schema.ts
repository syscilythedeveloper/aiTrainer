import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    // userId: v.id("users"),
    userId: v.string(),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          workoutComplete: v.optional(v.boolean()),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.number()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),

    dietPlan: v.object({
      dailyCalories: v.number(),
      dailyProtein: v.optional(v.number()),
      dailyCarbs: v.optional(v.number()),
      dailyFat: v.optional(v.number()),
      groceryList: v.optional(v.array(v.string())),
      weeklyMeals: v.array(
        v.object({
          day: v.string(),
          meals: v.array(
            v.object({
              name: v.string(),
              foods: v.array(v.string()),
            })
          ),
        })
      ),
    }),
    isActive: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),
});
