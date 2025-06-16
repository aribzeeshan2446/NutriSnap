
# NutriSnap: Project Overview

## 1. Core Objective

NutriSnap is an AI-powered web application designed to help users track their nutritional intake by analyzing images of food, providing calorie and macronutrient estimations, and maintaining a log of their consumption. It also offers AI-driven nutritional advice through a global, floating assistant.

**Note:** User authentication has been removed from this version of the project. The application operates as if a single, generic user is interacting with it, with data persisted locally in the browser via `localStorage`.

## 2. Key Features Implemented

*   **Image-Based Calorie Estimation (Dashboard):**
    *   Users can upload an image of their meal or capture one using their device's camera.
    *   An AI model (via Genkit and Google AI) analyzes the image to estimate:
        *   Total calories.
        *   Macronutrient content (protein, carbohydrates, fat).
        *   A list of detected ingredients.
*   **Calorie Log:**
    *   Automatically logs meals estimated via image analysis.
    *   Allows users to manually add food entries with calorie and macro details.
    *   Displays a chronological list of all entries, including date, description, image (if applicable), and nutritional info.
    *   Users can delete log entries.
*   **Nutritional Data Visualization:**
    *   Charts on the Log page to visualize calorie intake trends:
        *   Daily view (for the current week).
        *   Weekly view (for the current month).
        *   Monthly view (for the last 6 months).
*   **Daily Activity Overview (Dashboard):**
    *   Displays today's total calorie consumption.
    *   Shows progress towards a daily calorie goal (configurable in Settings).
    *   Lists recent log entries for quick review.
*   **Global AI Assistant (ElevenLabs Convai):**
    *   A conversational AI assistant provided by ElevenLabs, accessible as a floating widget throughout the application.
    *   Users can ask nutrition-related questions or discuss eating habits.
    *   Handles its own voice input and AI voice responses.
*   **User Settings:**
    *   Allows users to set/update:
        *   Personal information (name, age, weight, height, gender, activity level).
        *   Nutritional goals (daily calories, protein, carbs, fat).
    *   Provides general nutrition information for guidance.
*   **Theme Management:**
    *   Supports Light and Dark themes.
    *   Theme preference is persisted in `localStorage`.
*   **User Experience:**
    *   Responsive design for various screen sizes.
    *   Intro animation on application load.
    *   Sophisticated multi-layered animated background (shifting gradient, soft blobs, floating particles) that is theme-aware and transitions smoothly after the intro animation, enhancing visual appeal.
    *   Toast notifications for user feedback.
    *   Client-side camera access and image preview.

## 3. Technology Stack

*   **Framework:** Next.js (v15.x) with App Router
*   **Language:** TypeScript
*   **UI Library:** React (v18.x)
*   **Component Library:** ShadCN UI
*   **Styling:**
    *   Tailwind CSS (utility-first)
    *   CSS Variables for theming (defined in `src/app/globals.css`), which also includes definitions for a multi-layered animated background (gradient, blobs, particles) with theme-specific colors and opacities, controlled by CSS custom properties and keyframe animations.
*   **AI Integration:**
    *   Genkit (Firebase Genkit): For the image-based calorie estimation flow.
    *   ElevenLabs Convai Widget: For global conversational AI.
    *   **Models:** Google AI (specifically Gemini 2.0 Flash for image analysis tasks via Genkit).
*   **State Management (Client-Side):**
    *   React Hooks (`useState`, `useEffect`, `useContext`, `useRef`)
    *   Custom Hooks for managing specific concerns:
        *   `useAuth`: (Simplified - auth removed) Provides a consistent interface, always returns authenticated.
        *   `useUserSettings`: User profile and goals (persisted in `localStorage`).
        *   `useCalorieLog`: Calorie log entries (persisted in `localStorage`).
        *   `useTheme`: Light/dark theme state (persisted in `localStorage`).
    *   `localStorage`: For persisting auth state, user settings, calorie log, and theme preference across sessions.
*   **Data Fetching/Mutation (Client to Server):**
    *   Next.js Server Actions (for calorie estimation AI interactions).
    *   `@tanstack/react-query` (QueryClientProvider setup in `src/app/providers.tsx`).
*   **Charting:** Recharts (via ShadCN UI Chart components)
*   **Forms:** React Hook Form (for settings and manual log entry)
*   **Icons:** Lucide React (Flame, Dashboard, Log, Settings, Utensils, Health, Calendar, Chart, Upload, PlaceholderImage, Delete, Add, User, Apple, Leaf, Camera, Loader2, SwitchCamera, Menu, Sun, Moon, Grape, Citrus, Cherry).

## 4. Services Used

### 4.1. Firebase
*   **App Hosting:**
    *   The primary service used for deploying and hosting the Next.js web application.
    *   Configuration is managed via `apphosting.yaml`.
*   **Authentication (Removed):**
    *   User authentication has been removed. The app no longer uses Firebase Authentication. The `useAuth` hook is simplified and always returns an "authenticated" state. Data such as settings and logs are stored in `localStorage` per browser.

### 4.2. Google Cloud Platform (GCP)
(Primarily accessed and managed via Genkit and Firebase project linkage)
*   **Generative Language API / Vertex AI API (for Gemini models):**
    *   This is the core API providing access to Google's Gemini models.
    *   Used by Genkit flows for:
        *   `estimateCalorieContent`: Image analysis, ingredient detection, calorie/macro estimation.
*   **API Key Management & Billing:**
    *   The Google Cloud Project associated with your Firebase project handles the API keys and billing for the usage of Google AI services.

### 4.3. ElevenLabs
*   **Convai Widget:** Provides the global AI assistant. Usage and billing are managed via ElevenLabs.

## 5. APIs and AI Models

*   **Genkit:**
    *   Acts as the orchestrator for the calorie estimation AI interaction.
    *   `ai.defineFlow(...)`: Defines the `estimateCalorieContent` flow.
    *   `ai.definePrompt(...)`: Defines the prompts and expected output schemas for the calorie estimation LLM interaction.
    *   Used to call Google AI models for calorie estimation.
*   **Google AI - Gemini 2.0 Flash (via Genkit):**
    *   **Multimodal Capabilities:** Used for the `estimateCalorieContent` flow, processing both the uploaded image (`{{media url=photoDataUri}}`) and textual context.
    *   The specific model is configured in `src/ai/genkit.ts` (`googleai/gemini-2.0-flash`).
*   **ElevenLabs Convai API/Widget:**
    *   Provides the floating conversational AI assistant.
    *   Manages its own NLP, voice input (STT), and voice output (TTS).
*   **Browser APIs (Client-Side):**
    *   **`navigator.mediaDevices.getUserMedia`:** For accessing the user's camera to capture photos.
    *   **`FileReader API`:** For reading image files selected by the user and generating data URIs for preview and AI processing.
    *   **`localStorage API`:** For client-side data persistence (settings, log, theme).

## 6. Cloud Hosting

*   **Firebase App Hosting:**
    *   The application is configured for deployment on Firebase App Hosting.
    *   `apphosting.yaml` defines basic run configuration (e.g., `maxInstances`).
    *   Next.js build outputs are deployed and served globally via Firebase's CDN.

## 7. Project Structure Overview

*   **`.env`**: Environment variables.
*   **`apphosting.yaml`**: Firebase App Hosting configuration.
*   **`components.json`**: ShadCN UI configuration.
*   **`next.config.ts`**: Next.js configuration.
*   **`package.json`**: Project dependencies and scripts (Note: `chatterbox-tts` removed).
*   **`src/ai/`**: Contains Genkit AI integration code.
    *   `dev.ts`: Development server setup for Genkit flows (updated to remove chat flow).
    *   `genkit.ts`: Global Genkit AI client initialization and configuration.
    *   `flows/`: Directory for individual Genkit flow definitions (`estimate-calorie-content.ts`).
*   **`src/app/`**: Core application code following Next.js App Router conventions.
    *   `(actions)/`: Server Actions for handling AI calls (`calorie-actions.ts`).
    *   `dashboard/page.tsx`: Dashboard UI (NutriAI chat section removed).
    *   `log/page.tsx`: Calorie log and charting UI.
    *   `login/page.tsx`: (Removed) Login page was here.
    *   `settings/page.tsx`: User settings UI.
    *   `globals.css`: Global styles, Tailwind CSS theme/variable definitions, and styles/animations for the multi-layered dynamic background.
    *   `layout.tsx`: Root layout component, manages the overall page structure, intro animation, and the conditional rendering and smooth fade-in of the multi-layered animated background.
    *   `page.tsx`: Root page, redirects to `/dashboard`.
    *   `providers.tsx`: Client-side providers.
*   **`src/components/`**: Reusable React components.
    *   `layout/`: Layout-specific components (AppShell, Header, ThemeToggle, IntroAnimation).
        *   `app-shell.tsx`: Includes the ElevenLabs Convai widget.
    *   `ui/`: ShadCN UI components.
    *   `icons.tsx`: Manages icons (voice/chat specific icons removed).
*   **`src/hooks/`**: Custom React hooks.
    *   `use-auth.ts`: (Simplified - Auth removed) Manages a simulated authentication state, always "authenticated".
    *   `use-calorie-log.ts`: Manages calorie log data via `localStorage`.
    *   `use-local-storage.ts`: Generic hook for `localStorage`.
    *   `use-theme.ts`: Manages application theme via `localStorage`.
    *   `use-user-settings.ts`: Manages user profile and nutritional goals via `localStorage`.
*   **`src/lib/`**: Utility functions.
*   **`src/types/`**: TypeScript type definitions.
*   **`src/custom.d.ts`**: Type declarations for custom elements like `<elevenlabs-convai>`.
*   **`tailwind.config.ts`**: Tailwind CSS configuration.
*   **`tsconfig.json`**: TypeScript compiler configuration.

## 8. Deployment and Build Process

*   **Build:** `npm run build` (or `yarn build`) executes `next build`.
*   **Deployment:** Firebase CLI (`firebase deploy`) is used to deploy to Firebase App Hosting.

## 9. Usage and Billing Considerations

*   **Firebase App Hosting:** Billed based on instance hours, data storage, and outbound data transfer.
*   **Google AI (Gemini via Genkit):** Usage of Gemini models for calorie estimation is billed based on characters/tokens and per image, appearing in the GCP project linked to Firebase.
*   **ElevenLabs:** Usage of the Convai widget will be subject to ElevenLabs' pricing and billing.
*   **Monitoring:**
    *   Firebase Console: App Hosting usage.
    *   Google Cloud Console: Billing reports and usage metrics for Google AI APIs.
    *   ElevenLabs Dashboard: For Convai widget usage and billing.

## 10. Current State and Potential Future Enhancements

*   **Core Functionality:** Image-based calorie estimation, logging, settings, and nutritional data visualization are implemented for a single-user (per-browser) experience. A global AI assistant (ElevenLabs Convai) provides nutritional advice. The UI features a dynamic, theme-aware animated background.
*   **Authentication:** Removed. Re-integrating robust authentication (e.g., Firebase Authentication) and a backend database (e.g., Cloud Firestore) would be necessary for multi-user support and data persistence across devices.
*   **Data Persistence:** User settings and calorie logs are stored in `localStorage`. This is suitable for a single-browser experience but not for data sharing or backup.
*   **Error Handling:** Basic error handling is in place.
*   **Advanced AI Features:** Could be expanded (e.g., recipe generation, meal planning via the AI assistant or new flows).
*   **Testing & Accessibility (A11y):** Areas for ongoing improvement.

This overview should provide a good understanding of the project's components and how they interact.
