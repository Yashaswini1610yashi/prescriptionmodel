import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyCSBygvGm4ePoU24wLFRpPPleseqqnGsXI";
const genAI = new GoogleGenerativeAI(apiKey);

export const modelNames = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-pro-latest"
];

export async function processWithGemini(prompt: string, imageBase64?: string, audioBase64?: string, audioMimeType?: string) {
    let lastError: any = null;

    for (const modelName of modelNames) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const content: any[] = [prompt];
            if (imageBase64) {
                content.push({
                    inlineData: {
                        data: imageBase64,
                        mimeType: "image/png",
                    },
                });
            }

            if (audioBase64 && audioMimeType) {
                content.push({
                    inlineData: {
                        data: audioBase64,
                        mimeType: audioMimeType,
                    },
                });
            }

            const result = await model.generateContent(content);
            return result.response;
        } catch (err: any) {
            lastError = err;
            console.warn(`Model ${modelName} failed:`, err.message);
        }
    }

    throw lastError || new Error("AI processing failed on all models");
}

export function extractJSON(text: string) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not find valid JSON in AI response");
    return JSON.parse(jsonMatch[0]);
}
