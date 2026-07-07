
//-----------------------------------------------------

const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/* ==========================================================
   ZOD VALIDATION SCHEMA
========================================================== */

const interviewReportSchema = z.object({
  title: z.string(),

  matchScore: z
    .number()
    .min(0)
    .max(100),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

/* ==========================================================
   GEMINI RESPONSE SCHEMA
========================================================== */

const interviewResponseSchema = {
  type: Type.OBJECT,

  properties: {
    title: {
      type: Type.STRING,
      description: "Job title",
    },

    matchScore: {
      type: Type.NUMBER,
      description: "Match score from 0 to 100",
    },

    technicalQuestions: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          question: {
            type: Type.STRING,
          },

          intention: {
            type: Type.STRING,
          },

          answer: {
            type: Type.STRING,
          },
        },

        required: [
          "question",
          "intention",
          "answer",
        ],
      },
    },

    behavioralQuestions: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          question: {
            type: Type.STRING,
          },

          intention: {
            type: Type.STRING,
          },

          answer: {
            type: Type.STRING,
          },
        },

        required: [
          "question",
          "intention",
          "answer",
        ],
      },
    },

    skillGaps: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          skill: {
            type: Type.STRING,
          },

          severity: {
            type: Type.STRING,
            enum: [
              "low",
              "medium",
              "high",
            ],
          },
        },

        required: [
          "skill",
          "severity",
        ],
      },
    },

    preparationPlan: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          day: {
            type: Type.NUMBER,
          },

          focus: {
            type: Type.STRING,
          },

          tasks: {
            type: Type.ARRAY,

            items: {
              type: Type.STRING,
            },
          },
        },

        required: [
          "day",
          "focus",
          "tasks",
        ],
      },
    },
  },

  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

/* ==========================================================
   RESUME RESPONSE SCHEMA
========================================================== */

const resumeResponseSchema = {
  type: Type.OBJECT,

  properties: {
    html: {
      type: Type.STRING,
      description: "Complete HTML resume",
    },
  },

  required: ["html"],
};


/* ==========================================================
   GENERATE INTERVIEW REPORT
========================================================== */

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are a Senior Software Engineering Interviewer and Hiring Manager.

Your task is to analyze the candidate and generate a COMPLETE interview preparation report.

==========================
CANDIDATE RESUME
==========================
${resume}

==========================
SELF DESCRIPTION
==========================
${selfDescription}

==========================
JOB DESCRIPTION
==========================
${jobDescription}

==========================
INSTRUCTIONS
==========================

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT wrap the response inside \`\`\`.

Do NOT include explanations.

Generate a report that EXACTLY follows the response schema.

Rules:

1. title
- Job title from the job description.

2. matchScore
- Integer between 0 and 100.

3. technicalQuestions
- Generate EXACTLY 5 questions.
- Every object must contain:
  - question
  - intention
  - answer

4. behavioralQuestions
- Generate EXACTLY 3 questions.
- Every object must contain:
  - question
  - intention
  - answer

5. skillGaps
- Generate 3-5 missing skills.
- Severity must ONLY be:
  - low
  - medium
  - high

6. preparationPlan
- Generate EXACTLY 5 days.
- Every day must contain:
  - day
  - focus
  - tasks

- Each tasks array should contain at least TWO tasks.

Return ONLY JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: interviewResponseSchema,

        temperature: 0.3,

        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("\n========== GEMINI RAW RESPONSE ==========\n");
    console.log(response.text);
    console.log("\n=========================================\n");

    let result;

    try {
      result = JSON.parse(response.text);
    } catch (err) {
      console.error("JSON Parse Error");
      console.error(response.text);

      throw new Error("Gemini returned invalid JSON.");
    }

    const parsed = interviewReportSchema.safeParse(result);

    if (!parsed.success) {
      console.error("\n========= ZOD VALIDATION ERROR =========");
      console.dir(parsed.error.format(), {
        depth: null,
      });
      console.error("========================================\n");

      throw new Error("Interview report does not match schema.");
    }

    return parsed.data;
  } catch (error) {
    console.error("\n========== GEMINI ERROR ==========");
    console.error(error);
    console.error("==================================\n");

    throw error;
  }
}

/* ==========================================================
   GENERATE PDF FROM HTML
========================================================== */

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1240,
      height: 1754,
    });

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,

      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

/* ==========================================================
   GENERATE RESUME PDF
========================================================== */

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert Resume Writer and ATS Optimization Specialist.

Create a professional resume tailored specifically for the given job.

========================
RESUME
========================
${resume}

========================
SELF DESCRIPTION
========================
${selfDescription}

========================
JOB DESCRIPTION
========================
${jobDescription}

Instructions:

Return ONLY valid JSON.

Do not use markdown.

Do not wrap the response inside \`\`\`.

The JSON must contain ONLY one field:

{
  "html": "<complete html document>"
}

Requirements:

• Generate a complete HTML document.

• Include:

- Name
- Contact Information
- Professional Summary
- Skills
- Technical Skills
- Projects
- Experience
- Education
- Certifications (if available)

• Tailor the resume to the Job Description.

• Make it ATS Friendly.

• Use professional formatting.

• Use inline CSS only.

• Keep it within 1-2 pages.

• Use modern fonts.

• Ensure the HTML is printable on A4.

Return ONLY JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: resumeResponseSchema,

        temperature: 0.3,

        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("\n========== RESUME HTML RESPONSE ==========\n");
    console.log(response.text);
    console.log("\n==========================================\n");

    let result;

    try {
      result = JSON.parse(response.text);
    } catch (err) {
      console.error(response.text);
      throw new Error("Invalid JSON returned while generating resume.");
    }

    if (!result.html || typeof result.html !== "string") {
      throw new Error("Resume HTML is missing.");
    }

    const pdfBuffer = await generatePdfFromHtml(result.html);

    return pdfBuffer;
  } catch (error) {
    console.error("\n========== RESUME GENERATION ERROR ==========");
    console.error(error);
    console.error("=============================================\n");

    throw error;
  }
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generatePdfFromHtml
};