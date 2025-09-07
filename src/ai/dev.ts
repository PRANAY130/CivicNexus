import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-image-severity.ts';
import '@/ai/flows/determine-issue-priority.ts';
import '@/ai/flows/generate-issue-title.ts';
