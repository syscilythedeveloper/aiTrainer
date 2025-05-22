"use client";

import React, { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClerkProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CONVEX_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk
        client={convex}
        useAuth={useAuth}
      >
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
