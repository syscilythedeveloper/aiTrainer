import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getWorkoutPrompt,
  getMealPlanPrompt,
  validateWorkoutPlan,
  validateMealPlan,
} from "@/app/generate-program/prompts";

const http = httpRouter();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }
  const headers = {
    "svix-id": request.headers.get("svix-id") || "",
    "svix-timestamp": request.headers.get("svix-timestamp") || "",
    "svix-signature": request.headers.get("svix-signature") || "",
  };

  if (!headers) {
    return new Response("No svix headers", {
      status: 400,
    });
  }
  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, headers) as WebhookEvent;
    console.log("Webhook verified successfully");
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return new Response("Error occur", {
      status: 400,
    });
  }

  const eventType = evt.type;
  if (eventType === "user.created") {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data;
    const email = email_addresses[0].email_address;

    const name = `${first_name || ""} ${last_name || ""}`.trim();
    try {
      await ctx.runMutation(api.users.syncUser, {
        email,
        name,
        image: image_url,
        clerkId: id,
      });
    } catch (error) {
      console.log("error creating user", error);
      return new Response("Error creating user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0].email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      await ctx.runMutation(api.users.updateUser, {
        clerkId: id,
        email,
        name,
        image: image_url,
      });
    } catch (error) {
      console.log("Error updating user:", error);
      return new Response("Error updating user", { status: 500 });
    }
  }
  return new Response("Webhook processed successfully", { status: 200 });
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});
const generateRequest = httpAction(async (ctx, request) => {
  try {
    const bodyText = await request.text();
    console.log("Request Body:", bodyText);
    const params = new URLSearchParams(bodyText);

    // Extract and decode parameters
    const age = params.get("age");
    const gender = params.get("gender") || "not specified";
    const userId = params.get("userId");
    const height = params.get("height");
    const weight = params.get("weight");
    const fitness_goal = params.get("fitness_goal") || "Tone Up";
    const fitness_level = params.get("fitness_level") || "Beginner";
    const dietary_restrictions = params.get("dietary_restrictions") || "None";
    const physical_limitations = params.get("physical_limitations") || "None";
    const workout_days_per_week = params.get("workout_days_per_week") || 3;

    if (
      !age ||
      !height ||
      !weight ||
      !physical_limitations ||
      !workout_days_per_week ||
      !fitness_goal ||
      !fitness_level ||
      !gender
    ) {
      throw new Error("Missing required parameters for workout prompt.");
    }

    const workOutPrompt = getWorkoutPrompt({
      age,
      height,
      gender,
      weight,
      physical_limitations,
      workout_days_per_week,
      fitness_goal,
      fitness_level,
    });
    const mealPlanPrompt = getMealPlanPrompt({
      age,
      height,
      gender,
      weight,
      fitness_goal,
      dietary_restrictions,
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 0.4, // lower temperature for more predictable outputs
        topP: 0.9,
        responseMimeType: "application/json",
      },
    });
    const workoutResult = await model.generateContent(workOutPrompt);
    const workoutPlanText = workoutResult.response.text();

    const workoutPlan = validateWorkoutPlan(JSON.parse(workoutPlanText));

    const mealPlanResult = await model.generateContent(mealPlanPrompt);
    const mealPlanText = mealPlanResult.response.text();
    const dietPlan = validateMealPlan(JSON.parse(mealPlanText));

    // save to our DB: CONVEX

    if (!userId) {
      throw new Error("Missing required parameter: userId");
    }
    const planId = await ctx.runMutation(api.plans.createPlan, {
      userId,
      dietPlan,
      isActive: true,
      workoutPlan,
      name: `${fitness_goal} Plan - ${new Date().toLocaleDateString()}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          planId,
          workoutPlan,
          dietPlan,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating plan:", error);
    return new Response("Error creating plan", { status: 500 });
  }
});
http.route({
  path: "/vapi-generate-program",
  method: "POST",
  handler: generateRequest,
});

export default http;
