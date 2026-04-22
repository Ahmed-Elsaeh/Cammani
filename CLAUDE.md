# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Monorepo-wide
- `npm run dev` - Start both web and API applications in development mode
- `npm run dev:web` - Start only the Next.js web application (http://localhost:3000)
- `npm run dev:api` - Start only the Express API server (http://localhost:4000)
- `npm run build` - Build both applications
- `npm run lint` - Run ESLint across all packages
- `npm run test` - Run tests (if configured)

### API Specific (apps/api)
- `npm run dev` - Start API in watch mode with tsx
- `npm run build` - Compile TypeScript to dist/
- `npm run start` - Start built API from dist/
- `npm run lint` - Run ESLint on src/

### Web Specific (apps/web)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Next.js ESLint integration

### Shared Package (packages/shared)
- `npm run build` - Compile shared TypeScript utilities

## Code Architecture

### Monorepo Structure
- **apps/** - Contains deployable applications
  - **api/** - Express.js REST API with TypeScript
  - **web/** - Next.js 14 application with React and TypeScript
- **packages/** - Shared libraries and utilities
  - **shared/** - Common TypeScript interfaces, types, and utilities used by both api and web

### API Layer (apps/api)
- **Entry Point:** src/index.ts - Express app setup and server listening
- **Configuration:** src/config.ts - Environment variable loading and validation
- **Models:** src/models/ - Mongoose schemas and TypeScript interfaces for:
  - User, Seller, StripeAccount, Category, Product, Cart, Order, OrderEvent
- **Middleware:** src/middleware/ - Custom middleware:
  - auth.ts - JWT authentication middleware
  - validate.ts - Request validation using Zod
  - errorHandler.ts - Centralized error handling
- **Routes:** src/routes/ - REST API endpoints organized by domain:
  - auth.ts - Authentication (login, register)
  - catalog.ts - Public product and category browsing
  - seller.ts - Seller dashboard and product management
  - cart.ts - Shopping cart operations
  - checkout.ts - Stripe payment processing
  - orders.ts - Order management
  - webhooks.ts - Stripe webhook handlers
- **App Setup:** src/app.ts - Express application middleware configuration

### Web Layer (apps/web)
- **Routing:** App Router (src/app/) with Next.js 14
  - Layout: src/app/layout.tsx - Root layout with providers
  - Global CSS: src/app/globals.css - Tailwind CSS base styles
  - Pages: 
    - Home: src/app/page.tsx
    - Product search: src/app/search/page.tsx
    - Product detail: src/app/product/[id]/page.tsx
    - Cart: src/app/cart/page.tsx
    - Authentication: src/app/auth/(login|register)/page.tsx
    - Orders: src/app/orders/page.tsx
    - Seller dashboard: src/app/seller/page.tsx and sub-routes
- **Components:** src/components/ - Reusable UI components:
  - Layout: Header, NavBar, Footer
  - Product: ProductCard
  - UI: StarRating
  - Pages: HomePage, SearchPage, ProductPage, CartPage, LoginPage, RegisterPage, OrdersPage, SellerDashboard, SellerApply, SellerProducts
- **State Management:** src/store/ - Zustand stores:
  - authStore.ts - User authentication state
  - cartStore.ts - Shopping cart state
- **API Client:** src/lib/api.ts - Axios instance configured with base URL and interceptors

### Shared Package (packages/shared)
- **Purpose:** Shared TypeScript interfaces and utility functions
- **Entry Point:** src/index.ts - Exports all shared types and utilities
- **Dependencies:** Uses Zod for runtime validation schemas that can be shared between frontend and backend

## Key Technologies
- **Language:** TypeScript (strict mode)
- **Backend:** Node.js, Express.js, Mongoose (MongoDB ODM)
- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS
- **State Management:** Zustand
- **Payments:** Stripe (SDK and webhook handling)
- **Validation:** Zod (runtime validation)
- **Authentication:** JWT (jsonwebtoken)
- **HTTP Client:** Axios
- **UI Icons:** Lucide React
- **Notifications:** React Hot Toast

## Development Guidelines
1. Always run `npm run lint` before committing code
2. Type safety is enforced - avoid `any` types when possible
3. Environment variables should be added to `.env.example` and configured appropriately
4. API route handlers should use async/await with try/catch or express-async-errors
5. Form validation should use Zod schemas defined in shared or route-specific files
6. Stripe keys should never be committed - use environment variables
7. MongoDB connection string should be configured via MONGODB_URI environment variable
8. Next.js API routes are not used - all API communication goes to the Express server