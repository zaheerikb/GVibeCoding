
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedCode } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    files: {
      type: Type.ARRAY,
      description: "An array of source code files for the React application.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "File path, e.g., 'App.tsx'.",
          },
          content: {
            type: Type.STRING,
            description: "File content.",
          },
        },
        required: ["name", "content"],
      },
    },
    previewHtml: {
      type: Type.STRING,
      description:
        "A single, self-contained HTML string for a live preview. This HTML must use CDN links for React, ReactDOM, Babel Standalone, and TailwindCSS, and include all necessary JavaScript/JSX within <script type='text/babel'> tags.",
    },
  },
  required: ["files", "previewHtml"],
};

const suggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "An array of 3-4 string suggestions for the user.",
            items: {
                type: Type.STRING,
                description: "A single suggestion."
            }
        }
    },
    required: ["suggestions"]
};


const getPrompt = (userPrompt: string) => `
You are a world-class senior frontend React engineer with deep expertise in UI/UX design. Your primary goal is to generate complete and functional React web application code.

**User Request:** "${userPrompt}"

**Instructions:**
1.  **Generate a complete React application** based on the user's request.
2.  The application must use **React 18+, TypeScript, and Tailwind CSS**.
3.  All styling MUST be done with Tailwind CSS. Do not use any other styling methods.
4.  The application must be composed of a few files: \`index.tsx\`, \`App.tsx\`, and potentially other components in a \`components/\` directory if the complexity warrants it.
5.  **Generate two outputs in a single JSON object**:
    a.  **\`files\`**: An array of objects, where each object represents a source file with a \`name\` (e.g., "App.tsx") and its string \`content\`.
    b.  **\`previewHtml\`**: A single, self-contained HTML string that can be used for a live preview in an iframe. This HTML file must load React, ReactDOM, Babel Standalone, and Tailwind CSS from CDN links. It must contain all the React component logic inside a single \`<script type="text/babel" data-type="module">\` tag. The generated components should be defined and rendered within this script tag. Ensure this HTML is fully functional and renders the described application.

**Example structure for \`previewHtml\`:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-gray-100">
    <div id="root"></div>
    <script type="text/babel" data-type="module">
        // All React/TSX code goes here...
        // e.g. const App = () => { ... };
        // const root = ReactDOM.createRoot(document.getElementById('root'));
        // root.render(<App />);
    </script>
</body>
</html>
\`\`\`
`;

const getEnhancementPrompt = (userPrompt: string, currentCode: GeneratedCode) => `
You are a world-class senior frontend React engineer. Your task is to modify an existing React application based on a user's request.

**User's Enhancement Request:** "${userPrompt}"

**Current Application Code (in JSON format):**
${JSON.stringify(currentCode, null, 2)}

**Instructions:**
1.  Carefully analyze the user's request and the provided application code.
2.  Implement the requested changes, enhancements, or bug fixes.
3.  You MUST return the **complete, updated source code** for the entire application. Do not provide only the changed parts or a diff.
4.  The output format MUST be the same JSON structure as the input: an object with a "files" array and a "previewHtml" string.
5.  Ensure the updated \`previewHtml\` is self-contained and reflects the changes, just like the original.
`;

const getSuggestionsPrompt = (userPrompt: string, generatedCode: GeneratedCode) => `
You are an expert UI/UX designer and product manager AI. Your goal is to help a user refine and improve a web application they are building.

You will be given the user's most recent request and the complete source code of the application that was just generated based on that request.

**User's Request:** "${userPrompt}"

**Generated Application Code:**
${JSON.stringify(generatedCode, null, 2)}

**Your Task:**
Analyze the user's request and the generated code. Based on this context, generate a list of 3-4 specific, actionable, and creative follow-up suggestions for the user. These suggestions should be phrased as questions or commands that can be directly used as enhancement prompts.

**Guidelines for Suggestions:**
- Be contextual. If the user asked for a "pomodoro timer", suggest adding features like "customizable work/break intervals" or "sound notifications".
- Be creative. Suggest things the user might not have thought of, like "add a productivity report to track completed sessions".
- Be concise. Each suggestion should be a single sentence.
- Do not suggest things that are already implemented.

**Output Format:**
You MUST return a JSON object with a single key "suggestions" which is an array of strings.
`;


const callGemini = async (prompt: string): Promise<GeneratedCode> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
        },
    });

    const text = response.text.trim();
    try {
        const parsedJson = JSON.parse(text);
        // Basic validation
        if (parsedJson.files && parsedJson.previewHtml) {
        return parsedJson as GeneratedCode;
        } else {
        throw new Error("Generated JSON is missing required fields.");
        }
    } catch (e) {
        console.error("Failed to parse generated JSON:", text);
        throw new Error("The model returned an invalid JSON structure.");
    }
}

export const generateAppCode = async (prompt: string): Promise<GeneratedCode> => {
  const fullPrompt = getPrompt(prompt);
  return callGemini(fullPrompt);
};

export const enhanceAppCode = async (currentCode: GeneratedCode, prompt: string): Promise<GeneratedCode> => {
    const fullPrompt = getEnhancementPrompt(prompt, currentCode);
    return callGemini(fullPrompt);
};

export const generateFollowUpSuggestions = async (userPrompt: string, generatedCode: GeneratedCode): Promise<string[]> => {
    const prompt = getSuggestionsPrompt(userPrompt, generatedCode);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: suggestionsSchema,
            temperature: 0.5,
        },
    });

    const text = response.text.trim();
    try {
        const parsedJson = JSON.parse(text);
        if (parsedJson.suggestions && Array.isArray(parsedJson.suggestions)) {
            return parsedJson.suggestions;
        } else {
            console.warn("Generated suggestions JSON is missing 'suggestions' array.");
            return [];
        }
    } catch (e) {
        console.error("Failed to parse suggestions JSON:", text);
        return []; // Return empty array on failure, don't block the user
    }
}
