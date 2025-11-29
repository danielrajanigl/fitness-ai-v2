import Link from "next/link";
import { getServerUserOptional } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const user = await getServerUserOptional();

  if (user) {
    redirect("/dashboard");
  }

  const features = [
    {
      title: "Guided workouts",
      description: "Clear plans with video demonstrations and progress tracking.",
    },
    {
      title: "Nutrition tracking",
      description: "Simple meal logging with mindful guidance, not calorie obsession.",
    },
    {
      title: "Wellness tools",
      description: "Timers, breathing exercises, and recovery support.",
    },
  ];

  const stats = [
    { value: "10k+", label: "Active users" },
    { value: "50k+", label: "Workouts completed" },
    { value: "4.8", label: "Average rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="text-xl font-semibold text-[#1F2937]">Flow</div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="mb-4">Your fitness journey, simplified.</h1>
          <p className="text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Workouts, nutrition, and wellness tools designed for clarity and consistency.
          </p>
          <Link href="/login">
            <Button className="inline-flex items-center gap-2">
              Get started
              <ArrowRight size={18} strokeWidth={2} />
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index}>
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-[#6B7280]">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-12">
          <p className="text-[#6B7280] mb-8">
            Trusted by people who value intentional movement.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-semibold text-[#4B75FF] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
