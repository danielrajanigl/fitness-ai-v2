import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@repo/design-system/components/NavBar";
import { PageContainer } from "@repo/design-system/layout/PageContainer";
import { Card } from "@repo/design-system/components/Card";
import { Button } from "@repo/design-system/components/Button";
import { ProgressBar } from "@repo/design-system/components/ProgressBar";
import { ArrowLeft, Check } from "lucide-react";

export default async function WorkoutSessionPage() {
  const user = await getServerUser();

  // Mock workout data
  const workout = {
    name: "Upper Body Strength",
    totalExercises: 6,
    currentExercise: 1,
    exercises: [
      {
        id: 1,
        name: "Push-ups",
        sets: 3,
        reps: 12,
        rest: 60,
        completed: false,
        active: true,
      },
      {
        id: 2,
        name: "Dumbbell rows",
        sets: 3,
        reps: 10,
        rest: 60,
        completed: false,
        active: false,
      },
      {
        id: 3,
        name: "Shoulder press",
        sets: 3,
        reps: 12,
        rest: 60,
        completed: false,
        active: false,
      },
      {
        id: 4,
        name: "Bicep curls",
        sets: 3,
        reps: 12,
        rest: 60,
        completed: false,
        active: false,
      },
      {
        id: 5,
        name: "Tricep dips",
        sets: 3,
        reps: 10,
        rest: 60,
        completed: false,
        active: false,
      },
      {
        id: 6,
        name: "Plank hold",
        sets: 3,
        reps: 1,
        rest: 60,
        completed: false,
        active: false,
      },
    ],
  };

  const progress = Math.round((workout.currentExercise / workout.totalExercises) * 100);
  const currentExercise = workout.exercises.find((e) => e.active) || workout.exercises[0];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <NavBar />
      
      <PageContainer>
        <main className="max-w-[800px] mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#4B75FF] transition-colors mb-8"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h2 className="mb-2">{workout.name}</h2>
          <p className="text-[#6B7280]">
            Exercise {workout.currentExercise} of {workout.totalExercises}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar value={progress} />
          <div 
            className="mt-2 text-right" 
            style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-family)'
            }}
          >
            {progress}% complete
          </div>
        </div>

        {/* Current Exercise Card */}
        <Card 
          className="mb-8" 
          style={{ border: `2px solid var(--color-primary)` }}
        >
          <div className="text-[#6B7280] mb-2" style={{ fontSize: '14px' }}>
            CURRENT EXERCISE
          </div>
          <h3 className="mb-6">{currentExercise.name}</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Sets</span>
              <span>{currentExercise.sets} sets</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Reps</span>
              <span>{currentExercise.reps} reps</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Rest between sets</span>
              <span>{currentExercise.rest}s</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <Check size={18} strokeWidth={1.5} />
                Mark complete
              </div>
            </Button>
            <Button variant="secondary" className="flex-1">
              Skip exercise
            </Button>
          </div>
        </Card>

        {/* Exercise List */}
        <div className="mb-6">
          <h3 className="mb-4">All exercises</h3>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => {
              const isActive = exercise.active;
              const isCompleted = exercise.completed;

              return (
                <Card
                  key={exercise.id}
                  style={{
                    border: isActive 
                      ? `2px solid var(--color-primary)` 
                      : `1px solid var(--color-stroke)`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-[#8BC6A8]' : 'bg-[#F3F4F6]'
                      }`}>
                        {isCompleted ? (
                          <Check size={16} strokeWidth={2} className="text-white" />
                        ) : (
                          <span className="text-[#6B7280]" style={{ fontSize: '14px' }}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="mb-1">{exercise.name}</div>
                        <div className="text-[#6B7280]" style={{ fontSize: '14px' }}>
                          {exercise.sets} sets × {exercise.reps} reps
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Complete Workout Button */}
        <Button className="w-full">
          Complete workout
        </Button>
        </main>
      </PageContainer>
    </div>
  );
}
