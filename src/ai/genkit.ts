import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {next} from '@genkit-ai/next';
import 'dotenv/config';

const googleAIApiKey = process.env.GEMINI_API_KEY;
if (!googleAIApiKey) {
  // We don't want to throw an error here, because it will prevent the app from building.
  // The flow will throw an error if it's called without a key.
  console.warn(
    'GEMINI_API_KEY is not set. Please set it in your .env file to use AI features.'
  );
}

const plugins: Plugin[] = [
  next({
    apiDir: 'app/api/genkit',
  }),
];

if (googleAIApiKey) {
  plugins.push(googleAI({apiKey: googleAIApiKey}));
}

export const ai = genkit({
  plugins,
  logLevel: 'debug',
  traceStore: 'dev-local',
});
