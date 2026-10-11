const OPENROUTER_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_OPENROUTER_API_KEY) || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const PRIMARY_MODEL = 'meta-llama/llama-3.3-70b-instruct';
const FALLBACK_MODEL = 'meta-llama/llama-3.1-8b-instruct';

const GROQ_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `
You are Phlappy, an expert, warm, and highly engaging AI Master Teacher & Coding Mentor for TCM One Code Studio.
You teach students just like a passionate human mentor / bhaiya standing in front of a live coding workshop!
Your voice is natural, clear, encouraging, and speaks in authentic conversational Hinglish (blend of Hindi and easy English programming terms).

KEY TEACHING & PEDAGOGY RULES:
1. WARM, HUMAN CONVERSATIONAL INTRO ("speak"):
   - Greet warmly: "Namaste dosto! Main Phlappy hoon aur aaj hum seekhenge..."
   - Explain the concept simply in 3-4 natural sentences with an intuitive, everyday real-life analogy (e.g. storage box/dabba, recipe, water pipeline).
   - Tell why companies and developers use this in real software.

2. PRE-WRITE ANNOUNCEMENT ("speak"):
   - BEFORE writing code, inform the student what code and comments you are going to write in the editor.
   - Example: "Aao sabse pehle editor me iska structured definition comments aur ek clear practical example write karte hain."

3. CODE WITH DEFINITION COMMENTS ("write_code"):
   - Always start the file with 4-5 lines of clean header comments explaining Definition, Purpose, and Syntax.
   - Follow with clean, readable, beginner-friendly working code. Include clear line comments.

4. POST-WRITE LINE-BY-LINE EXPLANATION ("speak"):
   - Explain the code smoothly line-by-line (e.g., "Line 1 me humne 'var name = ...' se variable declare kiya jo...").
   - Keep the tone super clear, relatable, and easy to follow.

5. PRE-OUTPUT TRANSITION & OUTPUT INSPECTION:
   - Transition speech ("speak"): "Aao ab console/terminal tab open karke live output check karte hain ki actually kya result aaya!"
   - Tab switch step:
     * For JavaScript with console.log: Use "show_console".
     * For HTML/CSS visual apps: Use "show_preview".
     * For C, C++, Python: Use "show_terminal" followed by "run_code".
   - Output explanation speech ("speak"): Explain what appeared on the screen/console and why.

6. CONCLUSION ("conclude"):
   - Give an encouraging wrap-up: "Toh dosto, yeh tha hamara topic! Practice karte rahiye aur concepts clear rakhein."

ENVIRONMENT & FILE CONVENTIONS:
- C: Environment "C_BASIC", file "main.c", includes <stdio.h>, uses printf().
- C++: Environment "CPP_BASIC", file "main.cpp", includes <iostream>, uses cout.
- Python: Environment "PYTHON_BASIC", file "main.py", uses print().
- HTML/CSS/JS: Environment "HTML_CSS_JS", files "index.html", "style.css", "script.js".

STRICT FORMAT REQUIREMENTS:
- Return ONLY valid JSON (no markdown fences, no explanatory text outside JSON).
- The JSON must follow this exact structure:
{
  "title": "Topic Name",
  "environment": "HTML_CSS_JS" | "PYTHON_BASIC" | "C_BASIC" | "CPP_BASIC",
  "syllabus": [
    { "id": 1, "title": "Module 1: Concept Introduction", "description": "...", "status": "pending" },
    { "id": 2, "title": "Module 2: Definition & Structure", "description": "...", "status": "pending" },
    { "id": 3, "title": "Module 3: Code Implementation", "description": "...", "status": "pending" },
    { "id": 4, "title": "Module 4: Live Output Analysis", "description": "...", "status": "pending" },
    { "id": 5, "title": "Module 5: Summary & Takeaways", "description": "...", "status": "pending" }
  ],
  "steps": [
    { "type": "speak", "text": "Namaste dosto! ..." },
    { "type": "open_file", "file": "script.js" },
    { "type": "speak", "text": "Aao editor me definition comments aur example code write karte hain." },
    { "type": "write_code", "file": "script.js", "code": "// ..." },
    { "type": "speak", "text": "Line 1 me ... Line 2 me ..." },
    { "type": "speak", "text": "Aao ab Console tab open karke live output inspect karte hain!" },
    { "type": "show_console" },
    { "type": "speak", "text": "Dekhiye console me ..." },
    { "type": "conclude", "text": "Toh dosto, yeh tha ..." }
  ]
}
`;

function getRichFallbackLesson(topic, envKey) {
  const defaultSyllabus = [
    { id: 1, title: 'Module 1: Concept Introduction', description: `Hinglish intro to ${topic} concept & real-life analogy`, status: 'pending' },
    { id: 2, title: 'Module 2: Definition & Syntax', description: `Writing concept definition comments in editor`, status: 'pending' },
    { id: 3, title: 'Module 3: Line-by-Line Code', description: `Writing working example code with clear explanations`, status: 'pending' },
    { id: 4, title: 'Module 4: Live Output Analysis', description: `Analyzing output in console/terminal`, status: 'pending' },
    { id: 5, title: 'Module 5: Summary', description: `Recap of key takeaways & best practices`, status: 'pending' }
  ];

  if (envKey === 'CPP_BASIC') {
    return {
      title: topic,
      environment: 'CPP_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Main Phlappy AI Teacher hoon. Aaj hum C++ me ${topic} ko bilkul simple aur clear tarike se seekhenge. ${topic} C++ ka ek bahut important building block hai jo data management aur fast execution ke kaam aata hai.` },
        { type: 'open_file', file: 'main.cpp' },
        { type: 'speak', text: `Aao main.cpp file me ${topic} ki definition comments aur basic setup write karte hain.` },
        { type: 'write_code', file: 'main.cpp', code: `// =========================================================\n// DEFINITION: C++ ${topic}\n// - Purpose: Structured data handling and fast execution.\n// =========================================================\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "=== Phlappy AI Teacher: ${topic} ===" << endl;\n` },
        { type: 'speak', text: `Sabse pehle humne file top par definition comments aur standard main function setup likha.` },
        { type: 'speak', text: `Ab hum Example 1 ka C++ code write karte hain.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Line 1: Student Name variable\n    string studentName = "Phlappy C++ Learner";\n    // Line 2: Marks variable\n    int totalMarks = 485;\n    // Line 3: Output information\n    cout << "Student: " << studentName << " | Marks: " << totalMarks << endl;\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 1 me string variable studentName me text store kiya. Line 2 me totalMarks me number 485 store kiya. Line 3 me cout stream se values screen par print kar rahe hain.` },
        { type: 'speak', text: `Aao ab terminal open karke code compile aur run karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me dekhiye student name aur marks 485 bilkul clean display ho rahe hain.` },
        { type: 'conclude', text: `Toh dosto, yeh tha ${topic} in C++! Practice karte rahiye aur concepts clear rakhein.` }
      ]
    };
  }

  if (envKey === 'C_BASIC') {
    return {
      title: topic,
      environment: 'C_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum C Language me ${topic} ko bilkul basic se seekhenge. C language hardware memory aur procedural logic ke liye popular hai.` },
        { type: 'open_file', file: 'main.c' },
        { type: 'speak', text: `Aao main.c file me ${topic} ki definition comments write karte hain.` },
        { type: 'write_code', file: 'main.c', code: `/* =========================================================\n   DEFINITION: C Language ${topic}\n   - Purpose: Direct memory handling & fast execution.\n   ========================================================= */\n\n#include <stdio.h>\n\nint main() {\n    printf("=== Phlappy AI Teacher: ${topic} ===\\n");\n` },
        { type: 'speak', text: `Sabse pehle main.c top par definition comments aur stdio.h library setup ki.` },
        { type: 'speak', text: `Ab Example 1 ka C code write karte hain.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 1: Student ID variable\n    int student_id = 101;\n    // Line 2: Print formatted integer\n    printf("Student ID: %d\\n", student_id);\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 1 me student_id 101 initialize hua. Line 2 me printf ke %d specifier se ID print hui.` },
        { type: 'speak', text: `Aao ab terminal open karke code compile aur run karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output me Student ID 101 print ho gaya.` },
        { type: 'conclude', text: `Toh dosto, C language me format specifiers aur clean variables se program working banta hai.` }
      ]
    };
  }

  if (envKey === 'PYTHON_BASIC') {
    return {
      title: topic,
      environment: 'PYTHON_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum Python me ${topic} ko bilkul simple way me seekhenge. Python clean readable syntax ke liye jani jati hai.` },
        { type: 'open_file', file: 'main.py' },
        { type: 'speak', text: `Aao main.py file ke top par ${topic} ki definition comments write karte hain.` },
        { type: 'write_code', file: 'main.py', code: `# =========================================================\n# DEFINITION: Python ${topic}\n# - Purpose: Easy dynamic scripting & data handling.\n# =========================================================\n\nprint("=== Phlappy AI Teacher: ${topic} ===")\n` },
        { type: 'speak', text: `Top par humne ${topic} ki definition comments setup ki.` },
        { type: 'speak', text: `Ab Example 1 ka Python code write karte hain.` },
        { type: 'write_code', file: 'main.py', code: `# Example 1: Loop iteration (0 se 4 tak)\nfor i in range(5):\n    print("Iteration index:", i)\n` },
        { type: 'speak', text: `Line 'for i in range(5):' 0 se 4 tak values generate karega. Indented print statement har iteration me index print karega.` },
        { type: 'speak', text: `Aao ab terminal open karke Python code run karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me dekhiye 0 se 4 tak output aagaya.` },
        { type: 'conclude', text: `Toh dosto, Python me clean indentation se code easy aur readable lagta hai.` }
      ]
    };
  }

  // JS / Web Fallback
  return {
    title: topic,
    environment: 'HTML_CSS_JS',
    syllabus: defaultSyllabus,
    steps: [
      { type: 'speak', text: `Namaste dosto! Main Phlappy AI Teacher hoon. Aaj hum JavaScript me ${topic} ko bilkul simple aur practical tarike se seekhenge.` },
      { type: 'open_file', file: 'script.js' },
      { type: 'speak', text: `Aao script.js file me ${topic} ki definition comments write karte hain.` },
      { type: 'write_code', file: 'script.js', code: `// =========================================================\n// DEFINITION: JavaScript ${topic}\n// - var: Function or global scope variable.\n// - let: Block scope variable.\n// - const: Block scope constant value.\n// =========================================================\n` },
      { type: 'speak', text: `File top par humne var, let aur const variables ki definition comments write ki.` },
      { type: 'speak', text: `Ab Example 1 ka code write karte hain.` },
      { type: 'write_code', file: 'script.js', code: `// Line 1: Global var declaration\nvar studentName = "Phlappy AI Learner";\n\n// Line 2: Block let declaration\nlet totalMarks = 95;\n\n// Line 3: Block const declaration\nconst PASSING_MARKS = 40;\n\nconsole.log("Student Name:", studentName);\nconsole.log("Total Marks:", totalMarks, "| Passing Threshold:", PASSING_MARKS);\n` },
      { type: 'speak', text: `Line 1 me var studentName store hua. Line 2 me let totalMarks 95 store hua. Line 3 me const PASSING_MARKS set hua. Line 4-5 console par output print kar rahe hain.` },
      { type: 'speak', text: `Aao ab Console tab open karke live output check karte hain!` },
      { type: 'show_console' },
      { type: 'speak', text: `Console me student name 'Phlappy AI Learner' aur total marks 95 bilkul clean log ho gaye.` },
      { type: 'conclude', text: `Toh dosto, yeh tha ${topic}! Modern JavaScript me always let aur const use karein.` }
    ]
  };
}

function safeJSONParse(rawText, topic, environment) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    console.warn('JSON parsing fallback...', err1);
    try {
      const sanitized = cleaned
        .replace(/[\u0000-\u001F]+/g, ' ')
        .replace(/,\s*([\}\]])/g, '$1');
      return JSON.parse(sanitized);
    } catch (err2) {
      console.error('Sanitization failed:', err2);
      return getRichFallbackLesson(topic, environment);
    }
  }
}

export async function generateLessonFromGroq({ topic, language = 'Hinglish', difficulty = 'Beginner', environment = 'HTML_CSS_JS' }) {
  const topicLower = topic.toLowerCase();
  const isCpp = topicLower.includes('c++') || topicLower.includes('cpp');
  const isC = !isCpp && (topicLower.includes('c programming') || topicLower.endsWith(' in c') || topicLower.startsWith('c ') || topicLower.includes(' c '));
  const isPython = topicLower.includes('python');
  const isHtmlTopic = topicLower.includes('html') && !topicLower.includes('js');

  let actualEnv = environment;
  if (isCpp) actualEnv = 'CPP_BASIC';
  else if (isC) actualEnv = 'C_BASIC';
  else if (isPython) actualEnv = 'PYTHON_BASIC';

  const prompt = `Generate an engaging, high-quality, human-style programming lesson for Topic: "${topic}".
Difficulty: ${difficulty}. Language: ${language}. Environment: ${actualEnv}.

PEDAGOGICAL STRUCTURE (Follow this exact sequence):
1. SYLLABUS: 5 logical modules (Concept Intro, Definition & Structure, Code Implementation, Live Output Analysis, Summary).
2. STEP 1 (speak): Warm, passionate Hinglish intro explaining what ${topic} is, a clear real-life analogy, and where it is used.
3. STEP 2 (open_file): Open the main file (script.js, main.py, main.c, or main.cpp).
4. STEP 3 (speak): Pre-write announcement (e.g. "Aao sabse pehle editor me iska definition comments aur clean example code likhte hain.").
5. STEP 4 (write_code): Clean working code starting with 4-5 lines of definition header comments followed by readable example code.
6. STEP 5 (speak): Smooth line-by-line breakdown (e.g. "Line 1 me... Line 2 me...") explaining each line in plain, human Hinglish.
7. STEP 6 (speak): Transition to output (e.g. "Aao ab Console tab open karke live output inspect karte hain ki kya result aaya!").
8. STEP 7 (show_console / show_terminal / show_preview):
   - For JS with console.log: "show_console"
   - For C / C++ / Python: "show_terminal" followed immediately by "run_code"
   - For HTML/CSS: "show_preview"
9. STEP 8 (speak): Output explanation explaining what is displayed on the screen and why.
10. STEP 9 (conclude): Warm encouraging summary and practice tip.

Return ONLY the raw JSON object matching the required schema. No markdown formatting.`;

  const fetchOpenRouter = async (modelToUse) => {
    return await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173/',
        'X-Title': 'TCM One Phlappy IDE'
      },
      body: JSON.stringify({
        model: modelToUse,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 3800
      })
    });
  };

  const fetchGroq = async (modelToUse) => {
    return await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelToUse,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 3800
      })
    });
  };

  try {
    let response = null;

    // 1. Primary Attempt: OpenRouter (Llama 3.3 70b)
    try {
      response = await fetchOpenRouter(PRIMARY_MODEL);
    } catch (e) {
      console.warn('OpenRouter primary fetch network error:', e);
    }

    // 2. OpenRouter Fallback Model (Llama 3.1 8b)
    if (!response || !response.ok) {
      console.warn(`OpenRouter Primary (${PRIMARY_MODEL}) failed, trying fallback (${FALLBACK_MODEL})...`);
      try {
        response = await fetchOpenRouter(FALLBACK_MODEL);
      } catch (e) {
        console.warn('OpenRouter fallback fetch network error:', e);
      }
    }

    // 3. Groq API Fallback (if Groq key is configured)
    if ((!response || !response.ok) && GROQ_API_KEY) {
      console.warn('OpenRouter calls failed, falling back to Groq API...');
      try {
        response = await fetchGroq(GROQ_MODEL);
      } catch (e) {
        console.warn('Groq fetch network error:', e);
      }
    }

    if (!response || !response.ok) {
      const errStatus = response ? response.status : 'Network error';
      throw new Error(`LLM API Generation failed (${errStatus})`);
    }

    const data = await response.json();
    const contentText = data.choices[0].message.content;
    const lessonData = safeJSONParse(contentText, topic, actualEnv);

    let envKey = actualEnv;
    if (isPython || (lessonData.environment && lessonData.environment.includes('PYTHON'))) {
      envKey = 'PYTHON_BASIC';
    } else if (isCpp || (lessonData.environment && lessonData.environment.includes('CPP'))) {
      envKey = 'CPP_BASIC';
    } else if (isC || (lessonData.environment && lessonData.environment.includes('C_BASIC'))) {
      envKey = 'C_BASIC';
    }

    const rawSteps = lessonData.steps || [];
    let defaultFile = envKey === 'CPP_BASIC' ? 'main.cpp' : envKey === 'C_BASIC' ? 'main.c' : envKey === 'PYTHON_BASIC' ? 'main.py' : 'script.js';
    if (envKey === 'HTML_CSS_JS' && isHtmlTopic) defaultFile = 'index.html';

    let currentOpenFileName = defaultFile;
    const normalizedSteps = [];

    // Step-by-step normalization: supports both 'type' and 'action'
    for (const rawStep of rawSteps) {
      let rawType = rawStep.type || rawStep.action || 'speak';
      let stepType = String(rawType).toLowerCase().trim();

      // Normalize step action aliases
      if (stepType === 'code' || stepType === 'write' || stepType === 'coding') {
        stepType = 'write_code';
      } else if (['explanation', 'lecture', 'info', 'intro', 'say', 'talk', 'speech'].includes(stepType)) {
        stepType = 'speak';
      } else if (['summary', 'exercise', 'end', 'finish', 'conclusion'].includes(stepType)) {
        stepType = 'conclude';
      } else if (stepType === 'console') {
        stepType = 'show_console';
      } else if (stepType === 'terminal') {
        stepType = 'show_terminal';
      } else if (stepType === 'preview') {
        stepType = 'show_preview';
      } else if (stepType === 'run' || stepType === 'execute') {
        stepType = 'run_code';
      } else if (stepType === 'open') {
        stepType = 'open_file';
      }

      let targetFile = (envKey === 'CPP_BASIC' || envKey === 'C_BASIC' || envKey === 'PYTHON_BASIC')
        ? defaultFile
        : (rawStep.file || defaultFile);

      if (!targetFile && envKey === 'HTML_CSS_JS') {
        targetFile = stepType === 'write_code'
          ? (rawStep.code && rawStep.code.includes('<html') ? 'index.html' : (isHtmlTopic ? 'index.html' : 'script.js'))
          : currentOpenFileName;
      }

      // If writing code to a different file, ensure an open_file step precedes it
      if (stepType === 'write_code' && targetFile && targetFile !== currentOpenFileName) {
        normalizedSteps.push({
          type: 'open_file',
          file: targetFile,
          text: `Opening ${targetFile}`
        });
        currentOpenFileName = targetFile;
      }

      const codeSnippet = rawStep.code || rawStep.content || rawStep.value || '';

      if (stepType === 'write_code') {
        normalizedSteps.push({
          type: 'write_code',
          file: targetFile,
          code: codeSnippet,
          text: rawStep.text || `Writing code in ${targetFile}`
        });
      } else if (stepType === 'click_element') {
        if (!isHtmlTopic) {
          normalizedSteps.push({
            type: 'click_element',
            selector: rawStep.selector || '#actionBtn' || 'button',
            text: rawStep.text || 'Clicking element'
          });
        }
      } else {
        normalizedSteps.push({
          ...rawStep,
          type: stepType,
          file: targetFile,
          code: codeSnippet
        });
      }
    }

    // Check if the lesson sequence already contains an output inspection step
    const hasConsoleStep = normalizedSteps.some(s => s.type === 'show_console');
    const hasTerminalStep = normalizedSteps.some(s => s.type === 'show_terminal' || s.type === 'run_code');
    const hasPreviewStep = normalizedSteps.some(s => s.type === 'show_preview');
    const hasAnyOutputStep = hasConsoleStep || hasTerminalStep || hasPreviewStep;
    const isTerminalEnv = envKey === 'PYTHON_BASIC' || envKey === 'C_BASIC' || envKey === 'CPP_BASIC';

    const finalSteps = [...normalizedSteps];

    // If the generated lesson forgot to include an output inspection step, add it right before concluding
    if (!hasAnyOutputStep) {
      const concludeIdx = finalSteps.findIndex(s => s.type === 'conclude');
      const insertAt = concludeIdx !== -1 ? concludeIdx : finalSteps.length;

      const fallbackOutputSteps = [];
      if (isTerminalEnv) {
        fallbackOutputSteps.push({ type: 'speak', text: 'Aao ab terminal me code run karke live output check karte hain.' });
        fallbackOutputSteps.push({ type: 'show_terminal' });
        fallbackOutputSteps.push({ type: 'run_code' });
      } else {
        const lastCodeStep = finalSteps.slice().reverse().find(s => s.type === 'write_code');
        const codeText = lastCodeStep?.code || '';
        if (codeText.includes('console.log') || codeText.includes('console.warn') || codeText.includes('console.error')) {
          fallbackOutputSteps.push({ type: 'speak', text: 'Aao ab console me chal kar live output check karte hain.' });
          fallbackOutputSteps.push({ type: 'show_console' });
        } else {
          fallbackOutputSteps.push({ type: 'speak', text: 'Aao ab live preview open karke output dekhte hain.' });
          fallbackOutputSteps.push({ type: 'show_preview' });
        }
      }

      finalSteps.splice(insertAt, 0, ...fallbackOutputSteps);
    }

    return {
      id: Date.now(),
      title: lessonData.title || topic,
      environment: envKey,
      syllabus: lessonData.syllabus || getRichFallbackLesson(topic, envKey).syllabus,
      steps: finalSteps
    };
  } catch (error) {
    console.error('AI Lesson Generation error:', error);
    return getRichFallbackLesson(topic, actualEnv);
  }
}
