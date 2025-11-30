"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, User } from "lucide-react";
import { Card } from "@repo/design-system/components/Card";
import { Button } from "@repo/design-system/components/Button";
import { Input } from "@repo/design-system/components/Input";
import { Alert } from "@repo/design-system/components/Alert";
import { NavBar } from "@repo/design-system/components/NavBar";
import { PageContainer } from "@repo/design-system/layout/PageContainer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  error?: boolean;
  structuredData?: {
    message?: string;
    plan?: {
      exercise?: string;
      next_load?: string;
      sets?: string;
      reps?: string;
      duration?: string;
      frequency?: string;
    };
    insights?: string[];
    next_action?: string;
    track_metric?: string[];
  };
}

interface CoachResponse {
  success: boolean;
  format?: "extended" | "legacy";
  data?: {
    message?: string;
    plan?: {
      exercise?: string;
      next_load?: string;
      sets?: string;
      reps?: string;
      duration?: string;
      frequency?: string;
    };
    insights?: string[];
    next_action?: string;
    track_metric?: string[];
    summary?: string;
    training_advice?: string;
    progression_plan?: {
      exercise: string;
      next_load: string;
      sets: string;
      reps: string;
    };
  };
  error?: string;
  message?: string;
}

export default function CoachPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello, how can I help?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      });

      const data: CoachResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data?.message || data.data?.summary || "Response received",
        timestamp: new Date(),
        structuredData: data.data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      
      <PageContainer>
        <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#1D1F21] transition-colors mb-4"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
            <span>Back</span>
          </Link>
          
          <div className="mb-2">
            <h2>AI Coach</h2>
          </div>
          <p className="text-[#6B7280]">Your personal fitness assistant</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4B75FF] flex items-center justify-center">
                  <Bot size={16} strokeWidth={1.5} className="text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] md:max-w-[70%] ${
                  message.role === "user" ? "order-2" : ""
                }`}
              >
                {message.role === "user" ? (
                  <div className="bg-[#4B75FF] text-white rounded-[10px] px-4 py-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                ) : message.error ? (
                  <Alert variant="error">
                    {message.content}
                  </Alert>
                ) : (
                  <Card>
                    <p className="text-sm mb-3">{message.content}</p>
                    
                    {/* Structured Response */}
                    {message.structuredData && (
                      <div className="space-y-3 mt-3 pt-3 border-t border-[#E4E7EB]">
                        {/* Training Advice / Insights */}
                        {(message.structuredData.insights?.length || message.structuredData.training_advice) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Training Advice</h4>
                            <ul className="text-sm text-[#6B7280] space-y-1">
                              {message.structuredData.insights?.map((insight, i) => (
                                <li key={i}>• {insight}</li>
                              ))}
                              {message.structuredData.training_advice && !message.structuredData.insights && (
                                <li>{message.structuredData.training_advice}</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Progression Plan */}
                        {(message.structuredData.plan?.exercise || message.structuredData.progression_plan?.exercise) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Progression Plan</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {message.structuredData.plan?.exercise && (
                                <>
                                  {message.structuredData.plan.next_load && (
                                    <div className="bg-[#F3F4F6] rounded-[8px] p-2">
                                      <div className="text-xs text-[#6B7280] mb-1">Load</div>
                                      <div className="text-sm font-medium">{message.structuredData.plan.next_load}</div>
                                    </div>
                                  )}
                                  {message.structuredData.plan.sets && (
                                    <div className="bg-[#F3F4F6] rounded-[8px] p-2">
                                      <div className="text-xs text-[#6B7280] mb-1">Sets</div>
                                      <div className="text-sm font-medium">{message.structuredData.plan.sets}</div>
                                    </div>
                                  )}
                                </>
                              )}
                              {message.structuredData.progression_plan?.exercise && (
                                <>
                                  {message.structuredData.progression_plan.next_load && (
                                    <div className="bg-[#F3F4F6] rounded-[8px] p-2">
                                      <div className="text-xs text-[#6B7280] mb-1">Load</div>
                                      <div className="text-sm font-medium">{message.structuredData.progression_plan.next_load}</div>
                                    </div>
                                  )}
                                  {message.structuredData.progression_plan.sets && (
                                    <div className="bg-[#F3F4F6] rounded-[8px] p-2">
                                      <div className="text-xs text-[#6B7280] mb-1">Sets</div>
                                      <div className="text-sm font-medium">{message.structuredData.progression_plan.sets}</div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Next Action */}
                        {message.structuredData.next_action && (
                          <div className="text-sm">
                            <span className="font-medium">Next Action: </span>
                            <span className="text-[#6B7280]">{message.structuredData.next_action}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                )}
              </div>

              {/* User Avatar */}
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B7280] flex items-center justify-center">
                  <User size={16} strokeWidth={1.5} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4B75FF] flex items-center justify-center">
                <Bot size={16} strokeWidth={1.5} className="text-white" />
              </div>
              <Card>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#4B75FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-[#4B75FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-[#4B75FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="bg-white border-t border-[#E5E7EB] pt-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about training..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Send
            </Button>
          </div>
        </form>
        </main>
      </PageContainer>
    </div>
  );
}
