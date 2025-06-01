import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPlan = mutation({
  args: {
    //userId: v.id("users"),
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
              sets: v.number(),
              reps: v.number(),
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
  },
  handler: async (ctx, args) => {
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    const planId = await ctx.db.insert("plans", args);
    return planId;
  },
});

export const getUserPlans = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return plans;
  },
});

export const updatePlan = mutation({
  args: {
    planId: v.id("plans"),
    updatedDays: v.record(v.string(), v.boolean()), // e.g. { Monday: true, Tuesday: false }
  },
  handler: async (ctx, args) => {
    // Fetch the existing plan
    const plan = await ctx.db.get(args.planId);
    if (!plan) return;

    // Update workoutComplete for each day in exercises
    const updatedExercises = plan.workoutPlan.exercises.map((exerciseDay) => ({
      ...exerciseDay,
      workoutComplete: args.updatedDays.hasOwnProperty(exerciseDay.day)
        ? args.updatedDays[exerciseDay.day]
        : exerciseDay.workoutComplete,
    }));

    // Patch the plan with the updated exercises
    await ctx.db.patch(args.planId, {
      workoutPlan: {
        ...plan.workoutPlan,
        exercises: updatedExercises,
      },
    });

    return { success: true };
  },
});
