import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-image-severity.ts';
import '@/ai/flows/determine-issue-priority.ts';