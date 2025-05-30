"use client";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs"; // Assuming Clerk is used for user management

const ProfilePage = () => {
  const { user } = useUser(); // Assuming useUser is a custom hook to get user data
  const userId = user?.id ?? "";
  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return <section></section>;
};

export default ProfilePage;
