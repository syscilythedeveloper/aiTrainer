/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { vapi } from "@/lib/vapi";

import { useState } from "react";

const GenerateProgram = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const TOTAL_QUESTIONS = 10;
  const [userStep, setUserStep] = useState(0);
  const progressPercent = Math.min((userStep / TOTAL_QUESTIONS) * 100, 100);

  const { user } = useUser();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  const handleCallStart = () => {
    console.log("Call started");
    setConnecting(false);
    setCallActive(true);
    setCallEnded(false);
  };
  const handleCallEnd = async () => {
    console.log("Call ended");

    setCallActive(false);
    setConnecting(false);
    setIsSpeaking(false);
    setCallEnded(true);
    setUserStep(TOTAL_QUESTIONS);
  };
  const handleSpeechStart = () => {
    console.log("AI started Speaking");
    setIsSpeaking(true);
  };
  const handleSpeechEnd = () => {
    console.log("AI stopped Speaking");
    setIsSpeaking(false);
  };

  const handleError = (error: any) => {
    console.log("Vapi Error", error);
    setConnecting(false);
    setCallActive(false);
  };
  const handleMessage = (message: any) => {
    if (message.type === "transcript" && message.transcriptType === "final") {
      const newMessage = { content: message.transcript, role: message.role };
      console.log("New message:", newMessage);
      setMessages((prev: any) => [...prev, newMessage]);
      if (message.role === "user") {
        setUserStep((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setCallEnded(false);
        const userId = user?.id || "guest";
        const name = user?.firstName ? user.firstName.trim() : "Friend";

        const assistantOverrides = {
          variableValues: {
            userId,
            name,
          },
        };

        await vapi.start(
          process.env.NEXT_PUBLIC_ASSISTANT_ID,
          //@ts-expect-error vapi.start expects a string, but we are passing an object
          assistantOverrides
        );
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  useEffect(() => {
    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)

      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("message", handleMessage)
        .off("speech-end", handleSpeechEnd)
        .off("error", handleError);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden  pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Buid Your </span>
            <span className="text-primary uppercase">Personal Plan</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Chat with myTrainer+ to create your training and nutrition plan
          </p>
        </div>
        <div className="mb-6 p-4 bg-card/50 border border-border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Plan Creation Progress</span>
            <span className="text-xs text-primary">{progressPercent}%</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
              }}
            ></div>
          </div>
        </div>

        {/* VIDEO CALL AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI ASSISTANT CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="flex flex-col items-center justify-center p-6 relative">
              {/* AI VOICE ANIMATION */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking
                          ? `${Math.random() * 50 + 20}%`
                          : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI IMAGE */}
              <div className="relative size-20 mb-4">
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                />

                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10"></div>
                  <Image
                    width={128}
                    height={128}
                    src="/ai_assistant.png"
                    alt="AI Assistant"
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">myTrAIner+</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fitness & Diet Coach
              </p>

              {/* SPEAKING INDICATOR */}

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isSpeaking ? "border-primary" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                />

                <span className="text-xs text-muted-foreground">
                  {isSpeaking
                    ? "Speaking..."
                    : callActive
                      ? "Listening..."
                      : callEnded
                        ? "Redirecting to profile..."
                        : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card
            className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}
          >
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-20 mb-4">
                <Image
                  src={user?.imageUrl || "/default-user.png"}
                  alt="User"
                  width={80}
                  height={80}
                  className="size-full object-cover object-top rounded-full"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user
                  ? (user.firstName + " " + (user.lastName || "")).trim()
                  : "Guest"}
              </p>

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
              >
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>
        </div>

        {/* MESSAGE CONTAINER  */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full h-96 overflow-y-auto bg-card/80 border border-border rounded-xl px-4 py-2 mb-8"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 animate-fadeIn ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-lg flex-shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground border-2 border-primary/30 shadow-lg shadow-primary/20"
                      : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Image
                      width={40}
                      height={40}
                      src="/ai_assistant.png"
                      alt="AI Assistant"
                      className="w-full h-full object-cover object-[center_20%] rounded-full"
                    />
                  ) : (
                    <Image
                      width={40}
                      height={40}
                      src={user?.imageUrl || "/default-user.png"}
                      alt="User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.role === "assistant"
                      ? "bg-green-900 border border-green-700 rounded-bl-sm"
                      : "bg-blue-500/20 border border-blue-500/30 rounded-br-sm"
                  }`}
                >
                  {/* Sender Name */}
                  <div
                    className={`text-xs font-semibold mb-2 opacity-80 ${
                      msg.role === "assistant"
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {msg.role === "assistant" ? "myTrainer+ AI" : "You"}
                  </div>

                  {/* Message Text */}
                  <p className="text-foreground text-sm leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {/* System Message (Call Ended) */}
            {callEnded && (
              <div className="flex gap-4 animate-fadeIn">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  ✓
                </div>
                <div className="max-w-[70%] p-4 rounded-2xl bg-green-500/10 border border-green-500/20 rounded-bl-sm">
                  <div className="text-xs font-semibold mb-2 opacity-80 text-green-400">
                    System
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    Your fitness program has been created! Redirecting to your
                    profile...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CALL CONTROLS */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-40 text-xl rounded-3xl ${
              callActive
                ? "bg-destructive hover:bg-destructive/90"
                : callEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
            } text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}

            <span>
              {callActive
                ? "End Call"
                : connecting
                  ? "Connecting..."
                  : callEnded
                    ? "View Profile"
                    : "Start Call"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateProgram;
