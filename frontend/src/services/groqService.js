// Groq LLM API Service for Topic-Specific Lessons with Deep Definition Comments & Real Mentor Pacing

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'groq/compound-mini';

const SYSTEM_PROMPT = `
You are Phlappy, an expert AI Master Instructor for TCM One Code Studio.
You teach programming topics from scratch like a REAL HUMAN MENTOR standing in front of a live classroom!

CRITICAL PEDAGOGY & DEFINITION COMMENT RULES:
1. MANDATORY DEFINITION IN COMMENTS:
   - BEFORE writing executable code in a "write_code" step, ALWAYS write 3 to 6 lines of clean, structured code comments containing the DEFINITION & CONCEPT of the topic!
   - Example format in code:
     // =========================================================
     // CONCEPT & DEFINITION: JavaScript Variables (var, let, const)
     // - Definition: Variables store data values in memory.
     // - var: Function-scoped (legacy syntax).
     // - let: Block-scoped (modern ES6 mutable variable).
     // - const: Block-scoped (constant immutable value).
     // =========================================================

2. SLOW REAL MENTOR PACING (2 TO 4 MINUTES SESSION DURATION):
   - Teach slowly, calmly, and thoroughly like a real human mentor. Do NOT rush!
   - Generate 14 to 20 detailed sequential steps so the session lasts 2 to 4 minutes.

3. DEEP LINE-BY-LINE EXPLANATION:
   - Immediately after writing code ("write_code"), your "speak" step MUST explain every single line of code line-by-line in clear, friendly Hinglish.
   - Explain line 1, line 2, line 3, line 4 (variable name, data type, loop condition, array access, return value, console output).

4. STEP-BY-STEP CONSOLE/TERMINAL SYNCHRONIZATION:
   - Step A: "write_code" (Write code with definition comments).
   - Step B: "speak" (Deep line-by-line explanation).
   - Step C: "speak" ("Aao ab Terminal/Console panel open karke live output check karte hain...").
   - Step D: "show_console" (or "show_terminal" / "show_preview") + "run_code".
   - Step E: "speak" (Detailed analysis of the live output).
   - Step F: Move to Example 2 in a separate "write_code" step!

LANGUAGE & ENVIRONMENT RULES:
- C: Environment "C_BASIC", main file "main.c", includes <stdio.h>, uses printf().
- C++: Environment "CPP_BASIC", main file "main.cpp", includes <iostream>, uses cout.
- Python: Environment "PYTHON_BASIC", main file "main.py", uses print().
- HTML/CSS/JS: Environment "HTML_CSS_JS", main files "index.html", "style.css", "script.js".

STRICTLY RETURN JSON ONLY:
{
  "title": "Topic Name",
  "environment": "HTML_CSS_JS" | "PYTHON_BASIC" | "C_BASIC" | "CPP_BASIC",
  "syllabus": [
    { "id": 1, "title": "Module 1: Concept & Definition Setup", "description": "...", "status": "pending" },
    { "id": 2, "title": "Module 2: Basic Syntax & Variables", "description": "...", "status": "pending" },
    { "id": 3, "title": "Module 3: Operations & Logic", "description": "...", "status": "pending" },
    { "id": 4, "title": "Module 4: Practical Output & Verification", "description": "...", "status": "pending" },
    { "id": 5, "title": "Module 5: Summary & Best Practices", "description": "...", "status": "pending" }
  ],
  "steps": [
    { "type": "speak", "text": "Hinglish intro introducing the concept..." },
    { "type": "open_file", "file": "script.js" },
    { "type": "write_code", "file": "script.js", "code": "// =========================================\n// CONCEPT DEFINITION: ...\n// =========================================\n..." },
    { "type": "speak", "text": "Line 1: ... Line 2: ... Line 3: ... Detailed Hinglish line-by-line explanation." },
    { "type": "speak", "text": "Aao ab Console panel open karke live output verify karte hain." },
    { "type": "show_console" },
    { "type": "speak", "text": "Explanation of live output..." },
    { "type": "conclude", "text": "Summary..." }
  ]
}
`;

function getRichFallbackLesson(topic, envKey) {
  const topicLower = topic.toLowerCase();
  const defaultSyllabus = [
    { id: 1, title: 'Module 1: Concept & Definition Setup', description: `Detailed Hinglish explanation of ${topic} concept & real-world use`, status: 'pending' },
    { id: 2, title: 'Module 2: Code Structure & Definitions', description: `Writing full definition comments and syntax rules in editor`, status: 'pending' },
    { id: 3, title: 'Module 3: Incremental Code Implementation', description: `Writing working example code line-by-line with deep explanations`, status: 'pending' },
    { id: 4, title: 'Module 4: Live Output Verification', description: `Executing preview/console/terminal after each example to analyze output`, status: 'pending' },
    { id: 5, title: 'Module 5: Summary & Best Practices', description: `Recap of key takeaways, memory rules & best practices`, status: 'pending' }
  ];

  if (envKey === 'CPP_BASIC') {
    return {
      title: topic,
      environment: 'CPP_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Main Phlappy hoon. Aaj hum C++ me ${topic} ko bilkul zero se deep mentor level par seekhenge.` },
        { type: 'open_file', file: 'main.cpp' },
        { type: 'write_code', file: 'main.cpp', code: `// =========================================================\n// CONCEPT & DEFINITION: C++ ${topic}\n// - Definition: High-performance object-oriented programming concept.\n// - Purpose: Efficient memory management and structured execution.\n// =========================================================\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "=== Phlappy AI Teacher: ${topic} ===" << endl;\n` },
        { type: 'speak', text: `Sabse pehle code comments me dekhiye humne ${topic} ki concept definition likhi hai. Isse aapko theoretical clarity milegi.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Line 1: Declare string variable for Student Name\n    string studentName = "Phlappy C++ Learner";\n    // Line 2: Declare integer variable for total marks\n    int totalMarks = 485;\n    // Line 3: Output student info using cout stream\n    cout << "Student: " << studentName << " | Marks: " << totalMarks << endl;\n` },
        { type: 'speak', text: `Aao line-by-line samjhte hain: Line 1 me string type variable studentName declare kiya. Line 2 me int variable totalMarks me 485 store kiya. Line 3 me cout operator se terminal par print kiya.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke G++ compiler run karte hain aur live output dekhte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output me dekhiye student name aur total marks bilkul sahi print hue.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Example 2: Percentage calculation\n    double percentage = (totalMarks / 500.0) * 100;\n    cout << "Calculated Percentage: " << percentage << "%" << endl;\n    return 0;\n}\n` },
        { type: 'speak', text: `Example 2 me double data type se percentage calculate ki aur return 0 se program exit hua.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, yeh tha ${topic} in C++! Always write clear definition comments before coding.` }
      ]
    };
  }

  if (envKey === 'C_BASIC') {
    return {
      title: topic,
      environment: 'C_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum C Language me ${topic} ko bilkul basic se deep level par seekhenge.` },
        { type: 'open_file', file: 'main.c' },
        { type: 'write_code', file: 'main.c', code: `/* =========================================================\n   CONCEPT & DEFINITION: C Language ${topic}\n   - Definition: Low-level procedural programming logic.\n   - Purpose: Direct hardware interaction & memory efficiency.\n   ========================================================= */\n\n#include <stdio.h>\n\nint main() {\n    printf("=== Phlappy AI Teacher: ${topic} ===\\n");\n` },
        { type: 'speak', text: `Editor me sabse pehle humne ${topic} ki C definition and header comments likhi hain.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 1: Integer Variable declaration for Student ID\n    int student_id = 101;\n    // Line 2: Output formatted integer string using %d format specifier\n    printf("Student ID: %d\\n", student_id);\n` },
        { type: 'speak', text: `Line-by-line explanation: Line 1 me int student_id variable banaya 101 value ke saath. Line 2 me printf function me %d specifier se ID print ki.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke GCC compiler output check karte hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me Student ID 101 print ho gaya.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 3: Float variable for grade score\n    float score = 98.5;\n    printf("Final Score: %.2f\\n", score);\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 3 me float variable score me 98.5 store kiya aur %.2f se 2 decimal places tak display kiya.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, yeh tha ${topic} in C! Definition comments aur format specifiers sabse imp hain.` }
      ]
    };
  }

  if (envKey === 'PYTHON_BASIC') {
    return {
      title: topic,
      environment: 'PYTHON_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum Python me ${topic} ko bilkul zero level se seekhenge.` },
        { type: 'open_file', file: 'main.py' },
        { type: 'write_code', file: 'main.py', code: `# =========================================================\n# CONCEPT & DEFINITION: Python ${topic}\n# - Definition: High-level dynamic scripting language concept.\n# - Use Case: Data analysis, web backends, and automation.\n# =========================================================\n\n# Line 1: Topic Title banner\nprint("=== Phlappy AI Teacher: ${topic} ===")\n` },
        { type: 'speak', text: `Python file ke top par humne ${topic} ki definition comments write ki hain.` },
        { type: 'write_code', file: 'main.py', code: `# Example 1: For Loop iteration (0 se 4 तक)\nfor i in range(5):\n    print("Iteration index:", i)\n` },
        { type: 'speak', text: `Line-by-line breakdown: range(5) function 0 se 4 tak numbers generate karega aur variable 'i' har iteration me update hoga.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke Python script run karte hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output me dekhiye index 0 se 4 tak print ho gaya!` },
        { type: 'write_code', file: 'main.py', code: `\n# Example 2: While loop with accumulator sum\ncounter = 1\ntotal = 0\nwhile counter <= 5:\n    total += counter\n    counter += 1\nprint("Calculated Total Sum:", total)\n` },
        { type: 'speak', text: `Line-by-line: counter 1 se shuru hoga, jab tak counter <= 5 hai total me counter add hota rahega.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, Python me simple indentation aur definition comments se code clean rehta hai.` }
      ]
    };
  }

  // JS / Web Fallback
  return {
    title: topic,
    environment: 'HTML_CSS_JS',
    syllabus: defaultSyllabus,
    steps: [
      { type: 'speak', text: `Namaste dosto! Main Phlappy hoon. Aaj hum JavaScript me ${topic} ko bilkul basic definition ke saath seekhenge.` },
      { type: 'open_file', file: 'script.js' },
      { type: 'write_code', file: 'script.js', code: `// =========================================================\n// CONCEPT & DEFINITION: JavaScript Variables & Scope\n// - Definition: Variables are containers for storing data values.\n// - var: Function-scoped or global variable (legacy syntax).\n// - let: Block-scoped mutable variable (modern ES6 standard).\n// - const: Block-scoped constant value that cannot be reassigned.\n// =========================================================\n` },
      { type: 'speak', text: `Sabse pehle script.js me dekhiye humne Variables ki complete DEFINITION and Concept comments likhi hai. Isse har point clear ho jayega.` },
      { type: 'write_code', file: 'script.js', code: `// Line 1: 'var' declaration (Global/Function scoped)\nvar studentName = "Phlappy AI Learner";\n\n// Line 2: 'let' declaration (Block-scoped mutable variable)\nlet totalMarks = 95;\n\n// Line 3: 'const' declaration (Block-scoped constant)\nconst PASSING_MARKS = 40;\n\nconsole.log("Student Name:", studentName);\nconsole.log("Total Marks:", totalMarks, "| Passing Threshold:", PASSING_MARKS);\n` },
      { type: 'speak', text: `Aao ab ek-ek line samjhte hain: Line 1 me var studentName me string value store ki. Line 2 me let totalMarks me 95 store kiya. Line 3 me const PASSING_MARKS ko 40 par fix kiya. Baad me console.log se print kiya.` },
      { type: 'speak', text: `Aao ab Console panel open karke live output inspect karte hain!` },
      { type: 'show_console' },
      { type: 'speak', text: `Console me student name 'Phlappy AI Learner' aur total marks 95 bilkul sahi display ho rahe hain.` },
      { type: 'write_code', file: 'script.js', code: `\n// Example 2: Block Scope comparison (let vs var)\nif (true) {\n  var globalScopeVar = "I am visible everywhere!";\n  let blockScopeLet = "I am restricted inside this block!";\n}\nconsole.log(globalScopeVar);\n// console.log(blockScopeLet); // ReferenceError if un-commented\n` },
      { type: 'speak', text: `Example 2 line-by-line: if-block ke andar banaya var globalScopeVar bahar bhi accessible hai, par let blockScopeLet sirf if-block ke andar tak limited hai.` },
      { type: 'show_console' },
      { type: 'conclude', text: `Toh dosto, yeh tha ${topic}! Comments me definition aur clean code likhna professional standard hai.` }
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

  const prompt = `Generate a deep 3 to 4 minute topic-specific lesson for Topic: "${topic}". Difficulty: ${difficulty}. Language: ${language}. Environment: ${actualEnv}.
Requirements:
1. Provide a 5-module "syllabus" array breaking down the lesson roadmap for "${topic}".
2. Generate 14 to 18 detailed sequential steps ("speak", "open_file", "write_code", "show_console"/"show_preview"/"show_terminal", "run_code", "conclude").
3. CRITICAL DEFINITION REQUIREMENT: The VERY FIRST "write_code" step MUST write 3 to 6 lines of code comments containing the DEFINITION & CONCEPT of "${topic}".
4. For EACH basic example (e.g. Example 1, Example 2):
   - "write_code": Write 1 simple basic code example (3-5 lines) WITH concept comments.
   - "speak": Explain Example 1 in Hinglish line-by-line (Line 1 does ..., Line 2 does ...).
   - "speak": "Aao ab Console/Terminal panel open karke iska output inspect karte hain..."
   - "show_console" (if console.log is used) or "show_preview" or "show_terminal" + "run_code": OPEN PANEL RIGHT AWAY!
   - "speak": Comment on Example 1 live output.
   - Move to Example 2 in a separate "write_code" step!`;


  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 3500
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
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

    const normalizedSteps = [];
    const rawSteps = lessonData.steps || [];
    let defaultFile = envKey === 'CPP_BASIC' ? 'main.cpp' : envKey === 'C_BASIC' ? 'main.c' : envKey === 'PYTHON_BASIC' ? 'main.py' : 'index.html';
    let currentOpenFileName = defaultFile;

    const expandedRawSteps = [];
    for (const step of rawSteps) {
      let stepType = step.type ? String(step.type).toLowerCase() : 'speak';
      if (stepType === 'code' || stepType === 'write' || stepType === 'coding') stepType = 'write_code';

      if (stepType === 'write_code' && step.code) {
        const exampleSplitRegex = /(?=(?:\/\/|#|\/\*)\s*Example\s*\d+:?)/i;
        const chunks = step.code.split(exampleSplitRegex).map(c => c.trim()).filter(Boolean);

        if (chunks.length > 1) {
          chunks.forEach((chunk, idx) => {
            expandedRawSteps.push({
              type: 'write_code',
              file: step.file || defaultFile,
              code: chunk,
              text: `Writing Example ${idx + 1}...`
            });
            expandedRawSteps.push({
              type: 'speak',
              text: `Aao Example ${idx + 1} ko line-by-line samjhte hain aur iska output check karte hain.`
            });
          });
          continue;
        }
      }
      expandedRawSteps.push(step);
    }

    for (const rawStep of expandedRawSteps) {
      let stepType = rawStep.type ? String(rawStep.type).toLowerCase() : 'speak';

      if (stepType === 'code' || stepType === 'write' || stepType === 'coding') {
        stepType = 'write_code';
      } else if (stepType === 'explanation' || stepType === 'lecture' || stepType === 'info' || stepType === 'intro') {
        stepType = 'speak';
      } else if (stepType === 'summary' || stepType === 'exercise' || stepType === 'end') {
        stepType = 'conclude';
      }

      let targetFile = (envKey === 'CPP_BASIC' || envKey === 'C_BASIC' || envKey === 'PYTHON_BASIC') ? defaultFile : (rawStep.file || defaultFile);
      if (!targetFile && envKey === 'HTML_CSS_JS') {
        targetFile = stepType === 'write_code' ? (rawStep.code && rawStep.code.includes('<html') ? 'index.html' : (isHtmlTopic ? 'index.html' : 'script.js')) : currentOpenFileName;
      }

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

    const finalSteps = [];
    const isTerminalEnv = envKey === 'PYTHON_BASIC' || envKey === 'C_BASIC' || envKey === 'CPP_BASIC';

    for (let i = 0; i < normalizedSteps.length; i++) {
      const currentStep = normalizedSteps[i];
      finalSteps.push(currentStep);

      const isCodeOrSpeakAfterCode = currentStep.type === 'write_code' ||
        (currentStep.type === 'speak' && i > 0 && normalizedSteps[i - 1].type === 'write_code');

      if (isCodeOrSpeakAfterCode) {
        const nextStep = i + 1 < normalizedSteps.length ? normalizedSteps[i + 1] : null;
        const isNextAlreadyRun = nextStep && (
          nextStep.type === 'run_code' ||
          nextStep.type === 'show_terminal' ||
          nextStep.type === 'show_preview' ||
          nextStep.type === 'show_console' ||
          nextStep.type === 'click_element'
        );

        if (!isNextAlreadyRun) {
          if (isTerminalEnv) {
            finalSteps.push({ type: 'show_terminal' });
            finalSteps.push({ type: 'run_code' });
          } else {
            const lastCodeStep = finalSteps.slice().reverse().find(s => s.type === 'write_code');
            const codeText = lastCodeStep?.code || '';
            if (codeText.includes('console.log') || codeText.includes('console.warn') || codeText.includes('console.error')) {
              finalSteps.push({ type: 'show_console' });
            } else {
              finalSteps.push({ type: 'show_preview' });
            }
          }
        }
      }
    }

    const hasPreview = finalSteps.some(s => s.type === 'show_preview' || s.type === 'show_terminal' || s.type === 'show_console');
    if (!hasPreview) {
      if (isTerminalEnv) {
        finalSteps.push({ type: 'show_terminal' });
        finalSteps.push({ type: 'run_code' });
      } else {
        finalSteps.push({ type: 'show_console' });
      }
    }

    return {
      id: Date.now(),
      title: lessonData.title || topic,
      environment: envKey,
      syllabus: lessonData.syllabus || getRichFallbackLesson(topic, envKey).syllabus,
      steps: finalSteps
    };
  } catch (error) {
    console.error('Groq AI Generation error:', error);
    return getRichFallbackLesson(topic, actualEnv);
  }
}
