import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

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
  return new Response("Webhook processed successfully", { status: 200 });
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});
const generateRequest = httpAction(async (ctx, request) => {
  console.log("Recieved request", request);
  console.log("Request headers", request.headers);
  const age = request.headers.get("age");
  console.log("Age from headers:", age);

  try {
    // const planId = await ctx.runMutation(api.plans.createPlan, {
    //   userId,
    //   name,
    //   workoutPlan,
    //   dietPlan,
    //   isActive: true,
    // });

    return new Response(JSON.stringify({ request }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
