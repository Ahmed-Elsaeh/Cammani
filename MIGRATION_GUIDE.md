# Migration Plan: MongoDB to Supabase

This plan outlines the steps to migrate the Cammani API from MongoDB (Mongoose) to Supabase (PostgreSQL).

## Phase 1: Infrastructure & Dependencies
- [ ] Install `@supabase/supabase-js`.
- [ ] Update `.env` with Supabase credentials.
- [ ] Update `src/config.ts` to include Supabase config.
- [ ] Create `src/lib/supabase.ts` for the Supabase client.

## Phase 2: Schema Definition (SQL)
- [ ] Generate SQL schema for:
    - `users`
    - `sellers`
    - `categories`
    - `products`
    - `carts`
    - `orders`
    - `order_events`
    - `stripe_accounts`

## Phase 3: Auth Refactoring
- [ ] Update `src/routes/auth.ts` to use Supabase.
- [ ] Update `src/middleware/auth.ts` to verify Supabase tokens.

## Phase 4: Core Logic Refactoring
- [ ] Catalog (Products & Categories)
- [ ] Seller management
- [ ] Cart management
- [ ] Orders & Checkout

## Phase 5: Cleanup
- [ ] Remove Mongoose dependencies.
- [ ] Delete `src/models/*.ts`.
- [ ] Delete `src/lib/db.ts`.
- [ ] Final testing.
