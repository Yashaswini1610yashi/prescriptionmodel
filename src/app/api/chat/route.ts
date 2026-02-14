import { NextResponse } from "next/server";
import { processWithGemini } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const systemPrompt = `
      You are CareScan AI, a specialized medical assistant. 
      Your goal is to help users understand their medications, dosages, and safety restrictions.
      
      Guidelines:
      1. Provide clear, medically-grounded information.
      2. If asked about side effects or restrictions, be thorough but easy to understand.
      3. ALWAYS include a disclaimer that you are an AI and the user should consult a doctor.
      4. Avoid providing specific medical diagnoses; focus on medication information.
      5. Use a helpful, professional, and empathetic tone.
      
      User Message: ${message}
      
      Previous Conversation Summary (if any): ${history ? history.slice(-5).map((m: any) => `${m.role}: ${m.content}`).join("\n") : "None"}
    `;

        const response = await processWithGemini(systemPrompt);
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to process chat", details: error.message }, { status: 500 });
    }
}
