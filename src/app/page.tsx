"use client";

import React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton, SignUpButton } from "@clerk/nextjs";

const HomePage = () => {
  return (
    <>
      <div>
        Home Page
        <Authenticated>
          <UserButton />
        </Authenticated>
        <Unauthenticated>
          <div>
            <SignInButton />
          </div>
          <div>
            <SignUpButton />
          </div>
        </Unauthenticated>
      </div>
    </>
  );
};

export default HomePage;
