'use server';
/**
 * @fileOverview An audio transcription AI agent.
 *
 * - transcribeAudio - A function that handles the audio transcription process.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
    transcription: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}


async function convertWebmToMp3(webmDataUri: string): Promise<string> {
    const base64Data = webmDataUri.split(',')[1];
    const webmBuffer = Buffer.from(base64Data, 'base64');
    
    const tempWebmPath = path.join(os.tmpdir(), `input-${Date.now()}.webm`);
    const tempMp3Path = path.join(os.tmpdir(), `output-${Date.now()}.mp3`);

    fs.writeFileSync(tempWebmPath, webmBuffer);

    return new Promise((resolve, reject) => {
        ffmpeg(tempWebmPath)
            .toFormat('mp3')
            .on('error', (err) => {
                console.error('An error occurred: ' + err.message);
                fs.unlinkSync(tempWebmPath);
                reject(err);
            })
            .on('end', () => {
                const mp3Buffer = fs.readFileSync(tempMp3Path);
                const mp3DataUri = `data:audio/mp3;base64,${mp3Buffer.toString('base64')}`;
                
                fs.unlinkSync(tempWebmPath);
                fs.unlinkSync(tempMp3Path);
                
                resolve(mp3DataUri);
            })
            .save(tempMp3Path);
    });
}


const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {

    const mp3DataUri = await convertWebmToMp3(input.audioDataUri);

    const model = ai.getModel('googleai/gemini-2.5-flash');

    const result = await ai.generate({
      model,
      prompt: {
        text: 'Transcribe the following audio. Respond with only the transcription.',
        media: {
            url: mp3DataUri,
        }
      },
    });

    return { transcription: result.text };
  }
);
