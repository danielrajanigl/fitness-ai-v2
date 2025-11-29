```typescript
import { getServerUser } from "@/lib/auth";
import { NextNavigation } from "@/components/NextNavigation";
import { Card } from "@/components/Card";
import { Dumbbell, Apple, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getServerUser();

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <NextNavigation />
      
      <main className="max-w-[1200px] mx-auto px-6 py-12 pb-24 md:pb-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="mb-2">Welcome back, {user.email?.split("@")[0] || "User"}</h2>
          <p className="text-[#6B7280]">Your fitness overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <div className="text-center">
              <div className="text-[#6B7280] mb-2" style={{ fontSize: '14px' }}>
                Total Workouts
              </div>
              <h3>12</h3>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-[#6B7280] mb-2" style={{ fontSize: '14px' }}>
                Streak Days
              </div>
              <h3>7</h3>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-[#6B7280] mb-2" style={{ fontSize: '14px' }}>
                Avg Time
              </div>
              <h3>45m</h3>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="mb-6">Quick actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/workout" className="block">
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#4B75FF] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <Dumbbell size={20} strokeWidth={1.5} className="text-[#4B75FF]" />
                  </div>
                  <div>
                    <h3>Start Workout</h3>
                  </div>
                </div>
                <p className="text-[#6B7280]">Begin a new training session</p>
              </Card>
            </Link>

            <Link href="/nutrition" className="block">
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8BC6A8] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <Apple size={20} strokeWidth={1.5} className="text-[#8BC6A8]" />
                  </div>
                  <div>
                    <h3>Track Nutrition</h3>
                  </div>
                </div>
                <p className="text-[#6B7280]">Log your meals and macros</p>
              </Card>
            </Link>

            <Link href="/progress" className="block">
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#4B75FF] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={20} strokeWidth={1.5} className="text-[#4B75FF]" />
                  </div>
                  <div>
                    <h3>View Progress</h3>
                  </div>
                </div>
                <p className="text-[#6B7280]">See your fitness journey</p>
              </Card>
            </Link>

            <Link href="/coach" className="block">
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#4B75FF] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={20} strokeWidth={1.5} className="text-[#4B75FF]" />
                  </div>
                  <div>
                    <h3>AI Coach</h3>
                  </div>
                </div>
                <p className="text-[#6B7280]">Get personalized advice</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
```