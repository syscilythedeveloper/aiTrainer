"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Circle } from "lucide-react"; // Add at the top

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const userId = user?.id as string;
  const allPlans = useQuery(
    api.plans.getUserPlans,
    isLoaded && userId ? { userId } : "skip"
  );
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [activeTab, setActiveTab] = useState("workout");
  const [checkedDays, setCheckedDays] = useState<Record<string, boolean>>({});

  const activePlan = allPlans?.find((plan) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  const allDaysChecked =
    currentPlan &&
    currentPlan.workoutPlan.exercises.every((day) => checkedDays[day.day]);

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      {allPlans && allPlans?.length > 0 ? (
        <div className="space-y-8">
          {/* PLAN SELECTOR */}
          <div className="relative backdrop-blur-sm border border-border p-6">
            <CornerElements />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-primary">Your</span>{" "}
                <span className="text-foreground">Fitness Plans</span>
              </h2>
              <div className="font-mono text-xs text-muted-foreground">
                TOTAL: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allPlans.map((plan) => (
                <Button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`text-foreground border hover:text-white ${
                    selectedPlanId === plan._id
                      ? "bg-primary/20 text-primary border-primary"
                      : "bg-transparent border-border hover:border-primary/50"
                  }`}
                >
                  {plan.name}
                  {plan.isActive && (
                    <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* PLAN DETAILS */}

          {currentPlan && (
            <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
              <CornerElements />

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h3 className="text-lg font-bold">
                  PLAN: <span className="text-primary">{currentPlan.name}</span>
                </h3>
              </div>

              <Tabs
                defaultValue="workout"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border">
                  <TabsTrigger
                    value="workout"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <DumbbellIcon
                      className={`mr-2 h-4 w-4 ${
                        activeTab === "workout"
                          ? "text-yellow-500"
                          : "text-foreground"
                      }`}
                    />
                    Workout Plan
                  </TabsTrigger>

                  <TabsTrigger
                    value="diet"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <AppleIcon
                      className={`mr-2 h-4 w-4 ${
                        activeTab === "diet"
                          ? "text-yellow-500"
                          : "text-foreground"
                      }`}
                    />
                    Diet Plan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm text-muted-foreground">
                        SCHEDULE: {currentPlan.workoutPlan.schedule.join(", ")}
                      </span>
                    </div>

                    <Accordion
                      type="single"
                      collapsible
                      className="space-y-4"
                    >
                      {currentPlan.workoutPlan.exercises.map(
                        (exerciseDay, index) => (
                          <AccordionItem
                            key={index}
                            value={exerciseDay.day}
                            className="border rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                              <div className="flex justify-between w-full items-center">
                                <span
                                  className="flex items-center gap-3 text-primary cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent accordion toggle
                                    setCheckedDays((prev) => ({
                                      ...prev,
                                      [exerciseDay.day]: !prev[exerciseDay.day],
                                    }));
                                  }}
                                  tabIndex={0}
                                  role="checkbox"
                                  aria-checked={!!checkedDays[exerciseDay.day]}
                                  onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                      e.preventDefault();
                                      setCheckedDays((prev) => ({
                                        ...prev,
                                        [exerciseDay.day]:
                                          !prev[exerciseDay.day],
                                      }));
                                    }
                                  }}
                                >
                                  {checkedDays[exerciseDay.day] ||
                                  exerciseDay.workoutComplete ? (
                                    <CheckCircle2 className="h-7 w-7 text-green-400" />
                                  ) : (
                                    <Circle className="h-7 w-7 text-green-400" />
                                  )}

                                  <span
                                    className={
                                      exerciseDay.workoutComplete
                                        ? "line-through"
                                        : ""
                                    }
                                  >
                                    {exerciseDay.day}
                                  </span>
                                </span>
                                <div className="text-xs text-muted-foreground">
                                  {exerciseDay.routines.length} EXERCISES
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-4 px-4">
                              <div className="space-y-3 mt-2">
                                {exerciseDay.routines.map(
                                  (routine, routineIndex) => (
                                    <div
                                      key={routineIndex}
                                      className="border border-border rounded p-3 bg-background/50"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-foreground">
                                          {routine.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                            {routine.sets} SETS
                                          </div>
                                          <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                            {routine.reps} REPS
                                          </div>
                                        </div>
                                      </div>
                                      {routine.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {routine.description}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                      onClick={() => {
                        if (allDaysChecked) {
                          setCheckedDays({});
                        } else {
                          const allChecked: Record<string, boolean> = {};
                          currentPlan.workoutPlan.exercises.forEach((day) => {
                            allChecked[day.day] = true;
                          });
                          setCheckedDays(allChecked);
                        }
                      }}
                    >
                      {allDaysChecked ? "Reset All" : "Mark All as Complete"}
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition">
                      {" "}
                      Save Progress
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="diet">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Grocery List - left column */}
                    <div className="md:w-1/3 w-full">
                      <h4 className="text-lg font-bold text-primary mb-2">
                        Grocery List
                      </h4>
                      <div className="max-h-145 overflow-y-auto border rounded bg-background/50 mb-4 px-3 py-2">
                        <ul className="list-disc list-inside text-xl text-foreground">
                          {currentPlan.dietPlan.groceryList
                            .slice()
                            .sort((a, b) => a.localeCompare(b))
                            .map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    {/* Daily intake goals and meal plan - right column */}
                    <div className="md:w-2/3 w-full space-y-4">
                      <h4 className="text-lg font-bold text-primary mb-2">
                        Daily intake goals
                      </h4>
                      <table className="w-full mb-4 text-sm border rounded">
                        <thead>
                          <tr className="bg-primary/10 text-primary font-mono">
                            <th className="py-2 px-4 text-left">Calories</th>
                            <th className="py-2 px-4 text-left">Protein (g)</th>
                            <th className="py-2 px-4 text-left">Carbs (g)</th>
                            <th className="py-2 px-4 text-left">Fat (g)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="font-mono text-foreground">
                            <td className="py-2 px-4">
                              {currentPlan.dietPlan.dailyCalories}
                            </td>
                            <td className="py-2 px-4">
                              {currentPlan.dietPlan.dailyProtein}
                            </td>
                            <td className="py-2 px-4">
                              {currentPlan.dietPlan.dailyCarbs}
                            </td>
                            <td className="py-2 px-4">
                              {currentPlan.dietPlan.dailyFat}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="h-px w-full bg-border my-4"></div>
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-4"
                      >
                        {currentPlan.dietPlan.weeklyMeals.map((meal, index) => (
                          <AccordionItem
                            key={index}
                            value={meal.day}
                            className="border rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <h4 className="text-primary">{meal.day}</h4>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 px-4">
                              <ul className="space-y-4">
                                {meal.meals.map((mealItem, mealItemIndex) => (
                                  <li key={mealItemIndex}>
                                    <div className="font-semibold text-foreground mb-1">
                                      {mealItem.name}
                                    </div>
                                    <ul className="space-y-1 pl-4">
                                      {mealItem.foods.map((food, foodIndex) => (
                                        <li
                                          key={foodIndex}
                                          className="flex items-center gap-2 text-sm text-muted-foreground"
                                        >
                                          <span className="text-xs text-primary font-mono">
                                            {String(foodIndex + 1).padStart(
                                              2,
                                              "0"
                                            )}
                                          </span>
                                          {food}
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};
export default ProfilePage;
