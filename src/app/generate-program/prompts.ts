/* eslint-disable @typescript-eslint/no-explicit-any */
export function getWorkoutPrompt({
  age,
  height,
  weight,
  physical_limitations,
  workout_days_per_week,
  fitness_goal,
  fitness_level,
  gender,
}: {
  age: number | string;
  height: number | string;
  weight: number | string;
  physical_limitations: string;
  workout_days_per_week: number | string;
  fitness_goal: string;
  fitness_level: string;
  gender: string;
}) {
  return `You are an experienced fitness coach creating a personalized workout plan based on:
      Age: ${age}
      Height: ${height}
      Weight: ${weight}
      Injuries or limitations: ${physical_limitations}
      Available days for workout: ${workout_days_per_week}
      Fitness goal: ${fitness_goal}
      Fitness level: ${fitness_level}
      Gender: ${gender}
      
      As a professional coach:
      - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
      - Design exercises that match the fitness level and account for any injuries
      - Structure the workouts to specifically target the user's fitness goal
      
      CRITICAL SCHEMA INSTRUCTIONS:
      - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
      - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
      - For example: "sets": 3, "reps": 10
      - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
      - Instead use specific numbers like "reps": 12 or "reps": 15
      - For cardio, use "sets": 1, "reps": 1 or another appropriate number
      - NEVER include strings for numerical fields
      - NEVER add extra fields not shown in the example below
      
      Return a JSON object with this EXACT structure:
      {
        "schedule": ["Monday", "Wednesday", "Friday"],
        "exercises": [
          {
            "day": "Monday",
            "routines": [
              {
                "name": "Exercise Name",
                "sets": 3,
                "reps": 10
              }
            ]
          }
        ]
      }
      
      DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;
}

export function validateWorkoutPlan(plan: any) {
  return {
    schedule: Array.isArray(plan.schedule) ? plan.schedule : [],
    exercises: Array.isArray(plan.exercises)
      ? plan.exercises.map((exercise: any) => ({
          day: exercise.day,
          workoutComplete: false,
          routines: Array.isArray(exercise.routines)
            ? exercise.routines.map((routine: any) => ({
                name: routine.name,
                sets:
                  typeof routine.sets === "number"
                    ? routine.sets
                    : parseInt(routine.sets) || 1,
                reps:
                  typeof routine.reps === "number"
                    ? routine.reps
                    : parseInt(routine.reps) || 10,
              }))
            : [],
        }))
      : [],
  };
}

export function getMealPlanPrompt({
  age,
  height,
  weight,
  fitness_goal,
  dietary_restrictions,
  gender,
}: {
  age: number | string;
  height: number | string;
  weight: number | string;
  fitness_goal: string;
  dietary_restrictions: string;
  gender: string;
}) {
  return `You are an experienced nutrition coach creating a personalized diet plan based on:
        Age: ${age}
        Height: ${height}
        Weight: ${weight}
        Fitness goal: ${fitness_goal}
        Dietary restrictions: ${dietary_restrictions}
        Gender: ${gender}
      
        As a professional nutrition coach:
         - Calculate appropriate daily calorie intake, protein intake (grams), carbs (grams), and fat (grams) based on the person's stats and goals
        - Create a balanced meal plan with proper macronutrient distribution
        - Include a variety of nutrient-dense foods while respecting dietary restrictions
        - Consider meal timing around workouts for optimal performance and recovery
        - Provide a grocery list for the week with all ingredients needed for the meal plan
        - Structure the meal plan so that each day of the week (Sunday through Saturday) has its own set of meals
        
        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "dailyCalories" MUST be a NUMBER, not a string
        - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
        - ONLY include the EXACT fields shown in the example below
        - "groceryList" MUST be an array of strings, each string is a grocery item
        - "weeklyMeals" MUST be an array of 7 objects, one for each day of the week, each with a "day" and "meals" array
        - Each meal should include ONLY a "name" and "foods" array
      
        Return a JSON object with this EXACT structure and no other fields:
        {
          "dailyCalories": 2000,
          "dailyProtein": 150,
          "dailyCarbs": 250,
          "dailyFat": 70,
          "groceryList": [
            "Oatmeal",
            "Berries",
            "Greek yogurt",
            "Chicken breast",
            "Quinoa",
            "Broccoli",
            "Almonds",
            "Eggs",
            "Spinach"
          ],
          "weeklyMeals": [
            {
              "day": "Monday",
              "meals": [
                {
                  "name": "Breakfast",
                  "foods": ["Oatmeal with berries", "Greek yogurt"]
                },
                {
                  "name": "Lunch",
                  "foods": ["Grilled chicken salad", "Whole grain bread"]
                },
                {
                  "name": "Dinner",
                  "foods": ["Baked salmon", "Quinoa", "Steamed broccoli"]
                },
                {
                  "name": "Snacks",
                  "foods": ["Almonds", "Protein shake", "Fruit"]
                }
              ]
            },
            // ...repeat for each day of the week (Tuesday, Wednesday, etc.)...
          ]
        }
        
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;
}

export function validateMealPlan(plan: any) {
  return {
    dailyCalories:
      typeof plan.dailyCalories === "number"
        ? plan.dailyCalories
        : parseInt(plan.dailyCalories) || 2000,
    dailyProtein:
      typeof plan.dailyProtein === "number"
        ? plan.dailyProtein
        : parseInt(plan.dailyProtein) || 100,
    dailyCarbs:
      typeof plan.dailyCarbs === "number"
        ? plan.dailyCarbs
        : parseInt(plan.dailyCarbs) || 200,
    dailyFat:
      typeof plan.dailyFat === "number"
        ? plan.dailyFat
        : parseInt(plan.dailyFat) || 50,
    groceryList: Array.isArray(plan.groceryList) ? plan.groceryList : [],
    weeklyMeals: Array.isArray(plan.weeklyMeals)
      ? plan.weeklyMeals.map((day: any) => ({
          day: day.day,
          meals: Array.isArray(day.meals)
            ? day.meals.map((meal: any) => ({
                name: meal.name,
                foods: Array.isArray(meal.foods) ? meal.foods : [],
              }))
            : [],
        }))
      : [],
  };
}
