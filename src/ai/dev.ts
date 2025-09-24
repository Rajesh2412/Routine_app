/**
 * @fileoverview This file is used to configure and start the Genkit development server.
 * It allows you to register plugins and flows for local testing and development.
 *
 * To start the server, run: `genkit start -- tsx src/ai/dev.ts`
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {next} from '@genkit-ai/next';
import 'dotenv/config';

// Import flows here
import './flows/nutrition-flow';

const googleAIApiKey = process.env.GEMINI_API_KEY;
if (!googleAIApiKey) {
  throw new Error(
    'GEMINI_API_KEY is not set. Please set it in your .env file.'
  );
}

// Configure Genkit with the Google AI plugin and Next.js plugin for API route support.
genkit({
  plugins: [
    googleAI({apiKey: googleAIApiKey}),
    next({
      // We are specifying a different directory for the API routes
      // to avoid conflicts with the Next.js app routes.
      // The generated API routes will be available at `/api/genkit/*`.
      apiDir: 'app/api/genkit',
    }),
  ],
  // Log all traces to the console for debugging.
  traceStore: 'dev-local',
  // Enable the developer UI for inspecting traces.
  // Navigate to http://localhost:4000/ to view traces.
  devUi: {
    port: 4000,
  },
});
