# Complete Implementation Plan - Fitness AI Coach V2

## 📊 Database Schema Summary

Based on the provided schema and database connection:

### Key Tables
- **profiles** - User profile data with goals, preferences, premium status
- **fitness_embeddings** - Vector embeddings for RAG (vector dimension: 4096)
- **training_logs** - Workout tracking data
- **meal_logs** - Nutrition tracking
- **measurements** - Body measurements over time
- **training_plans** - User workout plans
- **fitness_goals** - User goals
- **exercise_library** - Exercise database with embeddings
- **foods** - Food database with embeddings
- **meal_templates** - Meal templates with embeddings

### RPC Function: `match_fitness_context`
- **Parameters:**
  - `query_embedding` (vector(4096))
  - `user_id_input` (uuid)
  - `match_count` (integer, default: 3)
- **Returns:** Content from `fitness_embeddings` ordered by similarity
- **Note:** Function has multiple overloads - need to call with named parameters

### RLS Policies (from config)
- `profiles`: `auth.uid() = user_id`
- `fitness_embeddings`: `auth.uid() = user_id OR auth.role() = 'service_role'`
- `training_logs`: `auth.uid() = user_id`
- `meal_logs`: `auth.uid() = user_id`
- `measurements`: `auth.uid() = user_id`

---

## 🔧 Current Issues & Fixes Needed

### 1. **Ollama Configuration** ⚠️ CRITICAL
**Issue:** Ollama client not configured for remote/local host
**Fix:** Update `packages/ai/src/model.ts` to use `OLLAMA_HOST` env variable

### 2. **Package Exports** ⚠️ CRITICAL
**Issue:** `askCoach` not exported from `@repo/ai/src/index.ts`
**Fix:** Add export statement

### 3. **Embedding Dimension Mismatch** ⚠️ CRITICAL
**Issue:** Code may assume wrong embedding dimension
**Fix:** Ensure all code uses 4096 dimension (from qwen2:7b)

### 4. **TypeScript Types** ⚠️ HIGH
**Issue:** Missing proper types throughout
**Fix:** Create comprehensive type definitions

### 5. **Authentication** ⚠️ HIGH
**Issue:** No auth system, hardcoded user_id
**Fix:** Implement Supabase Auth with SSR

### 6. **RPC Function Call** ⚠️ MEDIUM
**Issue:** Function has multiple overloads causing ambiguity
**Fix:** Ensure parameter order matches function signature

### 7. **Error Handling** ⚠️ MEDIUM
**Issue:** Limited error handling
**Fix:** Add comprehensive error handling

---

## 🎯 Implementation Phases

### Phase 1: Core Infrastructure Fixes (IMMEDIATE)

#### 1.1 Fix Ollama Configuration
- [ ] Add `OLLAMA_HOST` to environment variables
- [ ] Update `packages/ai/src/model.ts` to configure Ollama client
- [ ] Add connection health check
- [ ] Handle connection errors gracefully

#### 1.2 Fix Package Exports
- [ ] Export `askCoach` from `@repo/ai/src/index.ts`
- [ ] Export `CoachResponseSchema` from `@repo/ai/src/index.ts`
- [ ] Export model functions if needed
- [ ] Verify all imports work

#### 1.3 Fix Embedding Dimension
- [ ] Update retriever to use correct dimension (4096)
- [ ] Verify RPC function call uses correct vector size
- [ ] Add dimension validation

#### 1.4 Fix RPC Function Call
- [ ] Update `packages/ai/src/retriever.ts` to use named parameters correctly
- [ ] Test function call with proper parameter order
- [ ] Handle function overload ambiguity

---

### Phase 2: TypeScript & Type Safety

#### 2.1 Create Type Definitions
- [ ] Create `packages/ai/src/types.ts` with all AI-related types
- [ ] Create database type definitions matching Supabase schema
- [ ] Add types for API requests/responses
- [ ] Remove all `any` types

#### 2.2 Update Existing Code with Types
- [ ] Add types to `askCoach` function
- [ ] Add types to `getRelevantContext` function
- [ ] Add types to API routes
- [ ] Add types to model functions

---

### Phase 3: Authentication System

#### 3.1 Supabase Auth Setup
- [ ] Create auth context/provider
- [ ] Create login page (`/app/login/page.tsx`)
- [ ] Create signup page (`/app/signup/page.tsx`)
- [ ] Add protected route middleware
- [ ] Update API routes to use authenticated user

#### 3.2 Session Management
- [ ] Update `supabaseServer.ts` to use proper SSR auth
- [ ] Create user context hook
- [ ] Add logout functionality
- [ ] Handle session refresh

#### 3.3 API Route Protection
- [ ] Update `/api/coach` to extract user from session
- [ ] Remove `user_id` from request body
- [ ] Add authentication checks
- [ ] Return proper error for unauthenticated users

---

### Phase 4: UI/UX Implementation

#### 4.1 Setup UI Framework
- [ ] Install and configure Tailwind CSS
- [ ] Install shadcn/ui components
- [ ] Create design system/tokens
- [ ] Setup responsive layout

#### 4.2 Main Coach Interface
- [ ] Create `/app/coach/page.tsx` - Main coach chat interface
- [ ] Create chat message components
- [ ] Add loading states
- [ ] Add error display
- [ ] Format coach responses nicely
- [ ] Add message history

#### 4.3 Navigation & Layout
- [ ] Create app layout with navigation
- [ ] Add user menu/profile dropdown
- [ ] Add protected route wrapper
- [ ] Create dashboard/home page

#### 4.4 Response Formatting
- [ ] Parse JSON responses from coach
- [ ] Display summary, training_advice, progression_plan
- [ ] Format progression plans as cards
- [ ] Add copy/share functionality

---

### Phase 5: Context & Embeddings Management

#### 5.1 Embedding Generation
- [ ] Create API route to generate embeddings (`/api/embeddings/generate`)
- [ ] Create function to process training logs into embeddings
- [ ] Create function to process user profile into embeddings
- [ ] Create function to process goals into embeddings

#### 5.2 Context Population
- [ ] Create background job/function to populate `fitness_embeddings`
- [ ] Process `training_logs` into context entries
- [ ] Process `profiles` into context entries
- [ ] Process `fitness_goals` into context entries
- [ ] Create API to manually trigger embedding generation

#### 5.3 Context Retrieval Enhancement
- [ ] Improve `getRelevantContext` to handle empty results
- [ ] Add fallback when no embeddings exist
- [ ] Combine multiple context sources
- [ ] Add context metadata filtering

---

### Phase 6: Error Handling & Validation

#### 6.1 Comprehensive Error Handling
- [ ] Create error handling utilities
- [ ] Add retry logic for Ollama calls
- [ ] Handle network errors
- [ ] Handle authentication errors
- [ ] Handle database errors

#### 6.2 Input Validation
- [ ] Add Zod schemas for all API inputs
- [ ] Validate user questions
- [ ] Validate embeddings
- [ ] Add rate limiting

#### 6.3 User-Friendly Errors
- [ ] Create error message components
- [ ] Translate technical errors to user-friendly messages
- [ ] Add error logging
- [ ] Add error reporting

---

### Phase 7: Testing & Optimization

#### 7.1 Testing
- [ ] Test Ollama connection
- [ ] Test RPC function calls
- [ ] Test authentication flow
- [ ] Test coach API end-to-end
- [ ] Test error scenarios

#### 7.2 Performance
- [ ] Optimize embedding generation
- [ ] Add response caching
- [ ] Optimize database queries
- [ ] Add request rate limiting

#### 7.3 Monitoring
- [ ] Add logging
- [ ] Monitor Ollama connection health
- [ ] Track API response times
- [ ] Monitor error rates

---

## 📝 Detailed Implementation Steps

### Step 1: Environment Variables

Create `.env.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dzwytgfiztnlreiglvxl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://dzwytgfiztnlreiglvxl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Ollama
OLLAMA_HOST=http://localhost:11434
# Or for remote: OLLAMA_HOST=http://192.168.x.x:11434

# App
NODE_ENV=development
```

### Step 2: Fix Ollama Client

Update `packages/ai/src/model.ts`:
```typescript
import ollama from "ollama";

// Configure Ollama client
const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';

// Create client with custom host
const client = new ollama.Client({
  host: ollamaHost
});

export async function runChat(messages) {
  return await client.chat({
    model: "mistral:latest",
    messages,
    stream: false,
    options: { temperature: 0.4 }
  });
}

export async function embed(text) {
  const res = await client.embeddings({
    model: "qwen2:7b",
    prompt: text
  });

  return res.embeddings?.[0];
}
```

### Step 3: Fix Package Exports

Update `packages/ai/src/index.ts`:
```typescript
export * from "./pipeline";
export * from "./validator";
export { askCoach } from "./pipeline";
export { CoachResponseSchema } from "./validator";
```

### Step 4: Fix RPC Function Call

Update `packages/ai/src/retriever.ts`:
```typescript
import { supabaseServer } from "@repo/supabase/server";

export async function getRelevantContext(embedding: number[], userId: string) {
  const { data, error } = await supabaseServer.rpc("match_fitness_context", {
    query_embedding: embedding,
    user_id_input: userId,
    match_count: 3
  });

  if (error) {
    console.error("RPC Error:", error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return "No relevant context found.";
  }
  
  return data.map(d => d.content).join("\n");
}
```

### Step 5: Create Type Definitions

Create `packages/ai/src/types.ts`:
```typescript
export interface CoachRequest {
  question: string;
}

export interface CoachResponse {
  summary: string;
  training_advice: string;
  progression_plan: {
    exercise: string;
    next_load: string;
    sets: string;
    reps: string;
  };
}

export interface EmbeddingResult {
  embedding: number[];
  error?: string;
}
```

---

## 🚀 Next Steps Priority Order

1. **Fix Ollama configuration** - Critical for AI to work
2. **Fix package exports** - Critical for imports to work
3. **Fix RPC function call** - Critical for context retrieval
4. **Add TypeScript types** - Important for code quality
5. **Implement authentication** - Required for production
6. **Build UI** - Required for user interaction
7. **Add error handling** - Important for reliability
8. **Optimize and test** - Polish before launch

---

## 📚 Key Files to Create/Update

### Files to Create:
- `packages/ai/src/types.ts` - Type definitions
- `apps/web/app/login/page.tsx` - Login page
- `apps/web/app/signup/page.tsx` - Signup page
- `apps/web/app/coach/page.tsx` - Main coach interface
- `apps/web/components/ui/` - shadcn/ui components
- `apps/web/lib/auth.ts` - Auth utilities
- `.env.example` - Environment template

### Files to Update:
- `packages/ai/src/model.ts` - Fix Ollama config
- `packages/ai/src/index.ts` - Add exports
- `packages/ai/src/retriever.ts` - Fix RPC call
- `packages/ai/src/pipeline.ts` - Add types
- `apps/web/app/api/coach/route.ts` - Add auth, fix types
- `apps/web/lib/supabaseServer.ts` - Fix auth handling
- `apps/web/app/layout.tsx` - Add providers

---

## ✅ Success Criteria

- [ ] Ollama connects successfully (local or remote)
- [ ] Embeddings generate correctly (4096 dimensions)
- [ ] RPC function returns relevant context
- [ ] Coach API returns valid JSON responses
- [ ] Authentication works end-to-end
- [ ] UI displays coach responses correctly
- [ ] Error handling covers all scenarios
- [ ] TypeScript compiles without errors

---

Ready to start implementation! 🚀



