import { getServerUser } from "@/lib/auth";
import { NavBar } from "@repo/design-system/components/NavBar";
import { PageContainer } from "@repo/design-system/layout/PageContainer";
import { Card } from "@repo/design-system/components/Card";
import { tokens } from "@repo/design-system/tokens/design-tokens";
import { Dumbbell, Apple, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getServerUser();

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.background }}>
      <NavBar />
      
      <PageContainer>
        <main className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="mb-2">Welcome back, {user.email?.split("@")[0] || "User"}</h2>
          <p style={{ color: tokens.colors.textMuted }}>Your fitness overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <div className="text-center">
              <div className="mb-2" style={{ 
                color: tokens.colors.textMuted,
                fontSize: tokens.font.size.sm,
                fontFamily: tokens.font.family,
              }}>
                Total Workouts
              </div>
              <h3>12</h3>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="mb-2" style={{ 
                color: tokens.colors.textMuted,
                fontSize: tokens.font.size.sm,
                fontFamily: tokens.font.family,
              }}>
                Streak Days
              </div>
              <h3>7</h3>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="mb-2" style={{ 
                color: tokens.colors.textMuted,
                fontSize: tokens.font.size.sm,
                fontFamily: tokens.font.family,
              }}>
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
              <Card interactive className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderRadius: tokens.radius.full,
                      backgroundColor: `rgba(75, 117, 255, 0.1)`, // primary with 10% opacity
                    }}
                  >
                    <Dumbbell size={20} strokeWidth={1.5} style={{ color: tokens.colors.primary }} />
                  </div>
                  <div>
                    <h3>Start Workout</h3>
                  </div>
                </div>
                <p style={{ color: tokens.colors.textMuted }}>Begin a new training session</p>
              </Card>
            </Link>

            <Link href="/nutrition" className="block">
              <Card interactive className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderRadius: tokens.radius.full,
                      backgroundColor: `rgba(139, 198, 168, 0.1)`, // accentSuccess with 10% opacity
                    }}
                  >
                    <Apple size={20} strokeWidth={1.5} style={{ color: tokens.colors.accentSuccess }} />
                  </div>
                  <div>
                    <h3>Track Nutrition</h3>
                  </div>
                </div>
                <p style={{ color: tokens.colors.textMuted }}>Log your meals and macros</p>
              </Card>
            </Link>

            <Link href="/progress" className="block">
              <Card interactive className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderRadius: tokens.radius.full,
                      backgroundColor: `rgba(75, 117, 255, 0.1)`, // primary with 10% opacity
                    }}
                  >
                    <BarChart3 size={20} strokeWidth={1.5} style={{ color: tokens.colors.primary }} />
                  </div>
                  <div>
                    <h3>View Progress</h3>
                  </div>
                </div>
                <p style={{ color: tokens.colors.textMuted }}>See your fitness journey</p>
              </Card>
            </Link>

            <Link href="/coach" className="block">
              <Card interactive className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderRadius: tokens.radius.full,
                      backgroundColor: `rgba(75, 117, 255, 0.1)`, // primary with 10% opacity
                    }}
                  >
                    <MessageSquare size={20} strokeWidth={1.5} style={{ color: tokens.colors.primary }} />
                  </div>
                  <div>
                    <h3>AI Coach</h3>
                  </div>
                </div>
                <p style={{ color: tokens.colors.textMuted }}>Get personalized advice</p>
              </Card>
            </Link>
          </div>
        </div>
        </main>
      </PageContainer>
    </div>
  );
}