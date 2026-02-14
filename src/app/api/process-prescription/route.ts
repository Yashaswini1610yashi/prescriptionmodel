import { NextResponse } from "next/server";
import sharp from "sharp";
import { processWithGemini, extractJSON } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const image = formData.get("image") as File | null;
        const medicineName = formData.get("medicineName") as string | null;
        const audio = formData.get("audio") as File | null;

        if (!image && !medicineName && !audio) {
            return NextResponse.json({ error: "Provide an image, medicine name, or audio note" }, { status: 400 });
        }

        let prompt = "";
        if (image) {
            console.log("Processing image:", image.name, image.type);
            prompt = `
        You are a world-class handwriting expert and pharmacist.
        Scan this prescription and extract medicine names.

        For each medicine, return a JSON object with EXACTLY these keys:
        - "name": Correct name (cross-checked for spelling)
        - "dosage": Dosage (e.g., 500mg, 1 tablet)
        - "frequency": Frequency (e.g., Twice a day, After meals)
        - "duration": Duration (e.g., 5 days)
        - "explanation": Plain English explanation of what it does.
        - "purpose": Detailed medical purpose and use cases.
        - "sideEffects": Potential side effects.
        - "restrictions": Warnings for patients with conditions like diabetes, heart disease, pregnancy, etc.
        - "ageDosage": A JSON object with recommendations for "Children", "Adults", and "Elderly".
        - "schedule": Array of times in HH:mm format based on frequency.

        Format the output as a JSON object with a 'medicines' array.
      `;
        } else if (audio) {
            console.log("Processing audio note:", audio.name, audio.type);
            prompt = `
        You are a pharmacist. Listen to this audio note where a user is asking about a medicine.
        Identify the medicine name and provide a detailed report.

        Return a JSON object with EXACTLY these keys in a 'medicines' array:
        - "name": Identified medicine name
        - "dosage": "See age-based recommendations"
        - "frequency": "As mentioned/Standard"
        - "duration": "As mentioned/Standard"
        - "explanation": Plain English explanation of what it does.
        - "purpose": Detailed medical purpose and use cases.
        - "sideEffects": Potential side effects.
        - "restrictions": Warnings for patients with conditions like diabetes, heart disease, pregnancy, etc.
        - "ageDosage": { "Children": "Consult doctor", "Adults": "Standard dose", "Elderly": "Use with caution" },
        - "schedule": ["08:00", "20:00"] (Example default schedule).

        Format the output as a JSON object with a 'medicines' array.
      `;
        } else {
            console.log("Processing text lookup:", medicineName);
            prompt = `
        You are a pharmacist. Provide detailed information for the medicine: "${medicineName}".

        Return a JSON object with EXACTLY these keys in a 'medicines' array:
        - "name": "${medicineName}"
        - "dosage": "See age-based recommendations"
        - "frequency": "Standard frequency"
        - "duration": "As prescribed"
        - "explanation": Plain English explanation of what it does.
        - "purpose": Detailed medical purpose and use cases.
        - "sideEffects": Potential side effects.
        - "restrictions": Warnings for patients (e.g., diabetes, heart disease, pregnancy).
        - "ageDosage": { "Children": "Consult doctor", "Adults": "Standard dose", "Elderly": "Use with caution" },
        - "schedule": ["08:00", "20:00"] (Example default schedule).

        Format the output as a JSON object with a 'medicines' array.
      `;
        }

        let imageBase64 = "";
        if (image) {
            const imageBuffer = Buffer.from(await image.arrayBuffer());
            const processedImageBuffer = await sharp(imageBuffer)
                .resize({ width: 2000, fit: 'inside', withoutEnlargement: true })
                .grayscale()
                .sharpen()
                .clahe({ width: 50, height: 50 })
                .normalize()
                .toFormat('png')
                .toBuffer();
            imageBase64 = processedImageBuffer.toString("base64");
        }

        let audioBase64 = "";
        let audioMimeType = "";
        if (audio) {
            const audioBuffer = Buffer.from(await audio.arrayBuffer());
            audioBase64 = audioBuffer.toString("base64");
            audioMimeType = audio.type;
        }

        const response = await processWithGemini(prompt, imageBase64, audioBase64, audioMimeType);
        const text = response.text();
        const data = extractJSON(text);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Processing failed", details: error.message }, { status: 500 });
    }
}
