<<<<<<< HEAD
# CareScan AI 🏥

CareScan AI is a full-stack, AI-powered healthcare application designed to digitalize handwritten prescriptions and provide comprehensive medication insights. It leverages the latest Vision-LLM technology (Gemini 2.5) to bridge the gap between doctor notes and patient understanding.

## 🌟 Key Features

- **Prescription OCR & Enhancement**: Advanced image processing (Sharp) for reading handwriting.
- **Manual Medicine Lookup**: Instant search for detailed medicine data without needing a scan.
- **Side Effect Analysis**: Automatic extraction of potential reactions.
- **Safety Warnings**: Critical flags for Heart Disease, Diabetes, and Pregnancy.
- **Age-Based Dosage**: Tailored dosage recommendations for Children, Adults, and the Elderly.
- **Digital Schedule**: Precise medication timing based on prescription frequency.

## 🧠 AI Models & Data Sources

- **Primary Vision-LLM**: **Google Gemini 2.5 Flash** (High-performance extraction & medical analysis).
- **Secondary Vision-LLM**: **Google Gemini 2.0 Flash** (Intelligent fallback layer).
- **Image Processing Engine**: **Sharp** (Using CLAHE and Adaptive Sharpening for OCR prep).
- **Medical Intelligence**: Trained on extensive medical datasets including **RxNorm (NIH)**, **openFDA Drug Data**, and **handwritten prescription corpora (IAM)**.

---

## 🏗️ Folder Structure (Optimized)

The project is structured to strictly separate concerns, following a professional Full-Stack Next.js architecture.

```text
prescription-pro/
├── src/
│   ├── app/                # Backend API Routes & Page Layouts
│   │   ├── api/            # API Layer (Backend Endpoints)
│   │   │   └── process-prescription/
│   │   │       └── route.ts # API Entry Point
│   │   ├── layout.tsx      # Global UI Wrapper
│   │   └── page.tsx        # Main Home Dashboard
│   ├── components/         # Frontend Components (UI Layer)
│   │   ├── DigitalSchedule.tsx
│   │   ├── MedicineDetails.tsx
│   │   └── PrescriptionScanner.tsx
│   ├── lib/                # Backend Logic & Core Engines (Lib Layer)
│   │   └── gemini.ts       # AI Core (Gemini Logic, Fallbacks, Extraction)
│   └── hooks/              # Reusable React Hooks
├── public/                 # Static Assets (Icons, Images)
├── .env.local              # Environment Variables (API Keys)
├── next.config.ts          # Next.js Configuration
├── tailwind.config.ts      # UI Styling Configuration
└── README.md               # Project Documentation
```

---

## 🚀 Getting Started

### 1. Prerequsites
- Node.js 18+
- A Google Gemini API Key

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root:
```env
GOOGLE_API_KEY=your_api_key_here
```

### 4. Run the App
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start scanning!

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (Turbopack)
- **AI**: Google Gemini 2.5 Flash
- **Image Processing**: Sharp (CLAHE, Sharpening, Grayscaling)
- **Styling**: Tailwind CSS & Framer Motion
- **Icons**: Lucide React

---
*Disclaimer: This tool is for informational purposes only. Always consult a healthcare professional before starting or stopping any medication.*
=======
# med-scan
Doctor's prescription might not be readable by a common person soo our model helps those people to analyze it by taking image as the input.
>>>>>>> b95d11e0187c1610fddfd1357682a3dc99e12de2
