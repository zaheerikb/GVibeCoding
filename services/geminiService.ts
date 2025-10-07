
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

export const generateAppCode = async (prompt: string): Promise<GeneratedCode> => {
  const fullPrompt = getPrompt(prompt);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
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
};
