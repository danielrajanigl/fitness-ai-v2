# Fitness AI Coach V2 - Implementation Plan

## 📋 Current State Analysis

### ✅ What's Already Implemented

1. **Project Structure**
   - Monorepo setup with Turbo
   - Next.js 16 app (`apps/web`)
   - Shared packages: `@repo/ai` and `@repo/supabase`
   - TypeScript configuration

2. **Supabase Integration**
   - Client and server-side Supabase clients configured
   - RLS policies mentioned as ready
   - RPC function `match_fitness_context` referenced (for vector similarity search)
   - Environment variables structure defined

3. **AI Package (`@repo/ai`)**
   - Ollama integration for chat (`mistral:latest`) and embeddings (`qwen2:7b`)
   - Coach pipeline with context retrieval
   - Response validation with Zod schemas
   - Coach prompt template

4. **API Routes**
   - `/api/coach` - Main coach endpoint
   - Test/debug endpoints for Supabase and env vars

5. **Basic UI**
   - Homepage
   - Test page at `/coach-test` (hardcoded user_id)

### ⚠️ Issues & Gaps Identified

1. **Ollama Connection**
   - No `OLLAMA_HOST` environment variable configured
   - Ollama client defaults to `localhost:11434`
   - Needs connection to remote Mac

2. **Authentication**
   - No user authentication system
   - Hardcoded `user_id` in test page
   - No session management

3. **TypeScript Types**
   - Missing proper type definitions
   - `any` types in several places
   - No type exports from AI package

4. **Error Handling**
   - Limited error handling for Ollama connection failures
   - No retry logic
   - No user-friendly error messages

5. **Package Exports**
   - `askCoach` function not exported from `@repo/ai/src/index.ts`
   - Missing exports for model functions

6. **Environment Variables**
   - No `.env.example` file
   - Missing documentation for required vars

7. **UI/UX**
   - Basic test interface only
   - No proper coach chat interface
   - No loading states
   - No error display

---

## 🎯 Implementation Plan

### Phase 1: Core Infrastructure Fixes (Priority: HIGH)

#### 1.1 Fix Package Exports
- [ ] Export `askCoach` from `@repo/ai/src/index.ts`
- [ ] Export model functions if needed
- [ ] Ensure all imports work correctly

#### 1.2 Configure Ollama Remote Connection
- [ ] Add `OLLAMA_HOST` environment variable support
- [ ] Update Ollama client initialization to use remote host
- [ ] Add connection health check endpoint
- [ ] Handle connection errors gracefully

#### 1.3 Environment Variables Setup
- [ ] Create `.env.example` with all required variables
- [ ] Document each variable's purpose
- [ ] Add validation for required env vars on startup

**Required Environment Variables:**
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Ollama (Remote Mac)
OLLAMA_HOST=http://<remote-mac-ip>:11434

# Optional
NODE_ENV=development
```

---

### Phase 2: Authentication & User Management (Priority: HIGH)

#### 2.1 Supabase Auth Integration
- [ ] Set up Supabase Auth in the app
- [ ] Create login/signup pages
- [ ] Implement session management with SSR
- [ ] Add protected route middleware

#### 2.2 User Context
- [ ] Create user context/hook for React
- [ ] Replace hardcoded `user_id` with authenticated user
- [ ] Add user profile management

#### 2.3 API Route Protection
- [ ] Add authentication middleware to `/api/coach`
- [ ] Extract `user_id` from session instead of request body
- [ ] Add authorization checks

---

### Phase 3: TypeScript & Code Quality (Priority: MEDIUM)

#### 3.1 Type Definitions
- [ ] Add proper TypeScript types for all functions
- [ ] Create shared types package or file
- [ ] Remove `any` types
- [ ] Add JSDoc comments

#### 3.2 Error Handling
- [ ] Create error handling utilities
- [ ] Add retry logic for Ollama calls
- [ ] Implement proper error responses
- [ ] Add error logging

---

### Phase 4: UI/UX Improvements (Priority: MEDIUM)

#### 4.1 Main Coach Interface
- [ ] Create proper chat interface component
- [ ] Add message history display
- [ ] Implement loading states
- [ ] Add error message display
- [ ] Style with modern UI (Tailwind CSS or similar)

#### 4.2 Response Formatting
- [ ] Parse and display coach responses nicely
- [ ] Format progression plans as cards/tables
- [ ] Add copy/share functionality

#### 4.3 Navigation & Layout
- [ ] Create app layout with navigation
- [ ] Add user menu/profile dropdown
- [ ] Add logout functionality

---

### Phase 5: Database & RLS (Priority: MEDIUM)

#### 5.1 Verify Database Schema
- [ ] Document expected Supabase tables
- [ ] Verify `match_fitness_context` RPC function exists
- [ ] Check vector extension (pgvector) is enabled
- [ ] Verify embeddings table structure

**Expected Tables:**
- `fitness_context` (or similar) with:
  - `id`, `user_id`, `content`, `embedding` (vector), `created_at`
- RPC function `match_fitness_context` for similarity search

#### 5.2 RLS Policies Verification
- [ ] Test RLS policies work correctly
- [ ] Ensure users can only access their own data
- [ ] Verify service role can access all data for embeddings

---

### Phase 6: Advanced Features (Priority: LOW)

#### 6.1 Conversation History
- [ ] Store conversation history in Supabase
- [ ] Display previous conversations
- [ ] Add conversation search

#### 6.2 Context Management
- [ ] Allow users to add/update fitness context
- [ ] Create UI for managing context entries
- [ ] Add context categories/tags

#### 6.3 Performance Optimization
- [ ] Add response caching
- [ ] Optimize embedding generation
- [ ] Add request rate limiting

#### 6.4 Analytics & Monitoring
- [ ] Add usage analytics
- [ ] Monitor Ollama connection health
- [ ] Track API response times

---

## 🔧 Technical Implementation Details

### Ollama Remote Connection

The Ollama client needs to be configured to connect to a remote Mac. Update `packages/ai/src/model.ts`:

```typescript
import ollama from "ollama";

// Configure Ollama client with remote host
const ollamaClient = new ollama.Client({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
});
```

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Session stored in cookies (via `@supabase/ssr`)
3. API routes extract user from session
4. User ID passed to AI pipeline for context retrieval

### Database Schema (Expected)

```sql
-- Fitness context table with embeddings
CREATE TABLE fitness_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  embedding vector(1536), -- Adjust based on qwen2:7b embedding size
  created_at TIMESTAMP DEFAULT NOW()
);

-- RPC function for similarity search
CREATE OR REPLACE FUNCTION match_fitness_context(
  query_embedding vector(1536),
  user_id_input UUID,
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    fitness_context.id,
    fitness_context.content,
    1 - (fitness_context.embedding <=> query_embedding) AS similarity
  FROM fitness_context
  WHERE fitness_context.user_id = user_id_input
  ORDER BY fitness_context.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 📝 Next Immediate Steps

1. **Fix package exports** - Make `askCoach` available
2. **Configure Ollama host** - Add environment variable and update client
3. **Set up authentication** - Implement Supabase Auth
4. **Create proper UI** - Build coach chat interface
5. **Test end-to-end** - Verify full flow works

---

## 🚀 Getting Started

1. Get the Ollama model name from the remote Mac
2. Update `OLLAMA_HOST` in environment variables
3. Verify Supabase RPC function exists
4. Start implementing Phase 1 fixes

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Ollama JS Client](https://github.com/ollama/ollama-js)
- [Next.js 16 App Router](https://nextjs.org/docs/app)
- [pgvector for Supabase](https://supabase.com/docs/guides/ai/vector-columns)



