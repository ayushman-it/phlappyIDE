// Groq LLM API Service for Deep Pedagogy: Intro -> Pre-Write Explanation -> Exact Line-by-Line Code & Comments

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'groq/compound-mini';

const SYSTEM_PROMPT = `
You are Phlappy, an expert AI Master Instructor for TCM One Code Studio.
You teach programming topics from scratch like a REAL HUMAN MENTOR standing in front of a live classroom!

CRITICAL MANDATORY MENTOR PEDAGOGY RULES:
1. ALWAYS START WITH A DEEP TOPIC INTRODUCTION ("speak"):
   - Step 1 MUST ALWAYS be a clear, welcoming Hinglish intro speech introducing the topic definition, real-world purpose, and why we use it.

2. PRE-WRITE EXPLANATION BEFORE TYPING OR COMMENTING ("speak" BEFORE "write_code"):
   - BEFORE every "write_code" step, you MUST include a "speak" step explaining WHAT you are about to write/comment!
   - Example: "Aao sabse pehle editor me Topic ki complete DEFINITION aur concept comments write karte hain..."

3. MANDATORY CONCEPT DEFINITION IN COMMENTS (Inside "write_code"):
   - The first "write_code" step MUST write 4 to 6 lines of clean code comments containing the exact DEFINITION, SYNTAX RULES, and CONCEPT of the topic!

4. EXACT LINE-BY-LINE NUMBER & CODE BREAKDOWN ("speak" AFTER "write_code"):
   - Immediately after writing code, your "speak" step MUST explain every line by stating the EXACT line number and code snippet!
   - Example: "Line 1 me 'var a = 10;' se global variable banaya. Line 2 me 'let b = 20;' se block variable declare kiya. Line 3 me 'console.log(...)' se output display kar rahe hain."

5. STEP-BY-STEP CONSOLE/TERMINAL SYNCHRONIZATION:
   - Step A: "speak" (Intro & topic definition speech).
   - Step B: "speak" ("Ab hum editor me Definition comments write kar rahe hain...").
   - Step C: "write_code" (Write definition comments + Example 1 code).
   - Step D: "speak" (Exact Line 1, Line 2, Line 3 line-by-line breakdown).
   - Step E: "speak" ("Aao ab Console/Terminal panel open karke live output inspect karte hain...").
   - Step F: "show_console" (or "show_terminal" / "show_preview") + "run_code".
   - Step G: "speak" (Detailed analysis of the live output).
   - Step H: Move to Example 2!

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
    { "id": 1, "title": "Module 1: Topic Introduction & Concept Setup", "description": "...", "status": "pending" },
    { "id": 2, "title": "Module 2: Code Structure & Definition Comments", "description": "...", "status": "pending" },
    { "id": 3, "title": "Module 3: Line-by-Line Code Implementation", "description": "...", "status": "pending" },
    { "id": 4, "title": "Module 4: Live Terminal/Console Output Verification", "description": "...", "status": "pending" },
    { "id": 5, "title": "Module 5: Summary & Best Practices", "description": "...", "status": "pending" }
  ],
  "steps": [
    { "type": "speak", "text": "Hinglish intro speech introducing the concept..." },
    { "type": "open_file", "file": "script.js" },
    { "type": "speak", "text": "Aao sabse pehle editor me definition comments aur example 1 write karte hain." },
    { "type": "write_code", "file": "script.js", "code": "// =========================================\n// DEFINITION: ...\n// =========================================\n..." },
    { "type": "speak", "text": "Line 1 me ... Line 2 me ... Line 3 me ... Exact line-by-line breakdown." },
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
    { id: 1, title: 'Module 1: Topic Introduction & Concept Setup', description: `Detailed Hinglish intro to ${topic} concept & real-world role`, status: 'pending' },
    { id: 2, title: 'Module 2: Definition Comments & Rules', description: `Writing full definition comments and syntax rules in editor`, status: 'pending' },
    { id: 3, title: 'Module 3: Line-by-Line Implementation', description: `Writing working example code with exact line-by-line explanations`, status: 'pending' },
    { id: 4, title: 'Module 4: Live Terminal/Console Output Verification', description: `Executing preview/console/terminal after each example to analyze output`, status: 'pending' },
    { id: 5, title: 'Module 5: Summary & Best Practices', description: `Recap of key takeaways, memory rules & best practices`, status: 'pending' }
  ];

  if (envKey === 'CPP_BASIC') {
    return {
      title: topic,
      environment: 'CPP_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Main Phlappy AI Teacher hoon. Aaj hum C++ me ${topic} ko bilkul zero se deep mentor level par seekhenge. ${topic} C++ ka ek bahut important concept hai jo fast memory execution aur object structure ke liye use hota hai.` },
        { type: 'open_file', file: 'main.cpp' },
        { type: 'speak', text: `Aao sabse pehle main.cpp file me ${topic} ki complete DEFINITION aur Header comments write karte hain.` },
        { type: 'write_code', file: 'main.cpp', code: `// =========================================================\n// CONCEPT & DEFINITION: C++ ${topic}\n// - Definition: High-performance object-oriented C++ concept.\n// - Purpose: Structured memory allocation and fast execution.\n// =========================================================\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "=== Phlappy AI Teacher: ${topic} ===" << endl;\n` },
        { type: 'speak', text: `Pehle humne main.cpp ke top par ${topic} ki definition comments aur main function setup likha.` },
        { type: 'speak', text: `Ab hum Example 1 ka C++ code write karne ja rahe hain.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Line 1: String variable for Student Name\n    string studentName = "Phlappy C++ Learner";\n    // Line 2: Integer variable for total marks\n    int totalMarks = 485;\n    // Line 3: Output student info using cout stream\n    cout << "Student: " << studentName << " | Marks: " << totalMarks << endl;\n` },
        { type: 'speak', text: `Aao exact line-by-line code samjhte hain: Line 1 'string studentName = "Phlappy C++ Learner";' me text store kiya. Line 2 'int totalMarks = 485;' me number store kiya. Line 3 'cout << ...' se values display ki.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke G++ compiler run karte hain aur live output verify karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output me dekhiye student name aur total marks 485 bilkul sahi display hue.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Line 4: Double calculation for Percentage\n    double percentage = (totalMarks / 500.0) * 100;\n    cout << "Calculated Percentage: " << percentage << "%" << endl;\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 4 'double percentage = ...' me decimal percentage calculate ki aur return 0 se program complete hua.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, yeh tha ${topic} in C++! Always write definition comments before coding.` }
      ]
    };
  }

  if (envKey === 'C_BASIC') {
    return {
      title: topic,
      environment: 'C_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum C Language me ${topic} ko bilkul basic se deep level par seekhenge. C language hardware performance aur procedural logic ke liye popular hai.` },
        { type: 'open_file', file: 'main.c' },
        { type: 'speak', text: `Aao sabse pehle main.c file ke top par ${topic} ki C definition and header comments write karte hain.` },
        { type: 'write_code', file: 'main.c', code: `/* =========================================================\n   CONCEPT & DEFINITION: C Language ${topic}\n   - Definition: Low-level procedural programming logic.\n   - Purpose: Direct memory interaction & fast compilation.\n   ========================================================= */\n\n#include <stdio.h>\n\nint main() {\n    printf("=== Phlappy AI Teacher: ${topic} ===\\n");\n` },
        { type: 'speak', text: `Sabse pehle comments me humne ${topic} ki concept definition aur #include <stdio.h> setup kiya.` },
        { type: 'speak', text: `Ab hum Example 1 ka C code write karne ja rahe hain.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 1: Integer Variable declaration for Student ID\n    int student_id = 101;\n    // Line 2: Output formatted integer string using %d format specifier\n    printf("Student ID: %d\\n", student_id);\n` },
        { type: 'speak', text: `Exact line-by-line explanation: Line 1 'int student_id = 101;' me integer variable 101 initialize hua. Line 2 'printf("Student ID: %d\\n", student_id);' me %d specifier se ID print hui.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke GCC compiler output check karte hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output me Student ID 101 display ho gaya.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 3: Float variable for grade score\n    float score = 98.5;\n    printf("Final Score: %.2f\\n", score);\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 3 'float score = 98.5;' me decimal value store ki aur printf me %.2f format specifier se 2 decimal places tak display kiya.` },
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
        { type: 'speak', text: `Namaste dosto! Aaj hum Python me ${topic} ko bilkul zero level se seekhenge. Python ek high-level readable programming language hai jo data science, web backends aur automation me use hoti hai.` },
        { type: 'open_file', file: 'main.py' },
        { type: 'speak', text: `Aao sabse pehle main.py file ke top par ${topic} ki definition comments write karte hain.` },
        { type: 'write_code', file: 'main.py', code: `# =========================================================\n# CONCEPT & DEFINITION: Python ${topic}\n# - Definition: High-level dynamic scripting language concept.\n# - Use Case: Data analysis, web backends, and automation.\n# =========================================================\n\n# Line 1: Topic Title banner\nprint("=== Phlappy AI Teacher: ${topic} ===")\n` },
        { type: 'speak', text: `Top par dekhiye humne ${topic} ki definition comments setup ki.` },
        { type: 'speak', text: `Ab hum Example 1 ka Python code write karne ja rahe hain.` },
        { type: 'write_code', file: 'main.py', code: `# Example 1: For Loop iteration (0 se 4 तक)\nfor i in range(5):\n    print("Iteration index:", i)\n` },
        { type: 'speak', text: `Exact line-by-line breakdown: Line 'for i in range(5):' 0 se 4 tak range generate karega. Next indented line 'print("Iteration index:", i)' har iteration me 'i' ki value print karegi.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke Python script execute karte hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me dekhiye index 0 se 4 tak print ho gaya!` },
        { type: 'write_code', file: 'main.py', code: `\n# Example 2: While loop with accumulator sum\ncounter = 1\ntotal = 0\nwhile counter <= 5:\n    total += counter\n    counter += 1\nprint("Calculated Total Sum:", total)\n` },
        { type: 'speak', text: `Line-by-line: 'counter = 1' aur 'total = 0' initialize hue. 'while counter <= 5:' loop 5 tak chalega aur total me counter add karega.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, Python me simple syntax aur definition comments se code clean rehta hai.` }
      ]
    };
  }

  // JS / Web Fallback
  return {
    title: topic,
    environment: 'HTML_CSS_JS',
    syllabus: defaultSyllabus,
    steps: [
      { type: 'speak', text: `Namaste dosto! Main Phlappy AI Teacher hoon. Aaj hum JavaScript me ${topic} ko bilkul zero level se seekhenge. ${topic} JavaScript ka fundamental pillar hai jo data store aur manage karne ke kaam aata hai.` },
      { type: 'open_file', file: 'script.js' },
      { type: 'speak', text: `Aao sabse pehle script.js file me ${topic} ki complete DEFINITION aur Concept comments write karte hain.` },
      { type: 'write_code', file: 'script.js', code: `// =========================================================\n// CONCEPT & DEFINITION: JavaScript Variables & Scope\n// - Definition: Variables are containers for storing data values.\n// - var: Function-scoped or global variable (legacy syntax).\n// - let: Block-scoped mutable variable (modern ES6 standard).\n// - const: Block-scoped constant value that cannot be reassigned.\n// =========================================================\n` },
      { type: 'speak', text: `Dekhiye humne sabse pehle Variables ki complete DEFINITION: var, let, aur const ke difference ko comments me write kar diya.` },
      { type: 'speak', text: `Ab hum Example 1 ka practical JavaScript code write karne ja rahe hain.` },
      { type: 'write_code', file: 'script.js', code: `// Line 1: 'var' declaration (Global/Function scope)\nvar studentName = "Phlappy AI Learner";\n\n// Line 2: 'let' declaration (Block-scoped mutable variable)\nlet totalMarks = 95;\n\n// Line 3: 'const' declaration (Block-scoped constant)\nconst PASSING_MARKS = 40;\n\nconsole.log("Student Name:", studentName);\nconsole.log("Total Marks:", totalMarks, "| Passing Threshold:", PASSING_MARKS);\n` },
      { type: 'speak', text: `Aao exact line-by-line code samjhte hain: Line 1 'var studentName = "Phlappy AI Learner";' me global variable initialize hua. Line 2 'let totalMarks = 95;' me block variable totalMarks store hua. Line 3 'const PASSING_MARKS = 40;' me constant threshold define hua. Line 4-5 console.log se print ho raha hai.` },
      { type: 'speak', text: `Aao ab Console panel open karke live output inspect karte hain!` },
      { type: 'show_console' },
      { type: 'speak', text: `Console me student name 'Phlappy AI Learner' aur total marks 95 bilkul sahi display ho rahe hain.` },
      { type: 'write_code', file: 'script.js', code: `\n// Example 2: Block Scope comparison (let vs var)\nif (true) {\n  var globalScopeVar = "I am visible everywhere!";\n  let blockScopeLet = "I am restricted inside this block!";\n}\nconsole.log(globalScopeVar);\n// console.log(blockScopeLet); // ReferenceError if un-commented\n` },
      { type: 'speak', text: `Example 2 exact line-by-line: if-block ke andar 'var globalScopeVar' block ke bahar bhi accessible hai, par 'let blockScopeLet' sirf block ke andar limited rehta hai.` },
      { type: 'show_console' },
      { type: 'conclude', text: `Toh dosto, yeh tha ${topic}! Pehle intro, fir definition comments aur exact line-by-line explanation se concept crystal clear ho jata hai.` }
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
2. Generate 14 to 20 detailed sequential steps ("speak", "open_file", "write_code", "show_console"/"show_preview"/"show_terminal", "run_code", "conclude").
3. MANDATORY STEP 1: Step 1 MUST be a rich Hinglish "speak" introduction introducing the topic definition, real-world use, and why we use it.
4. PRE-WRITE EXPLANATION: BEFORE writing code or comments in "write_code", include a "speak" step announcing WHAT you are about to write/comment (e.g. "Aao sabse pehle editor me definition comments write karte hain...").
5. MANDATORY DEFINITION COMMENTS: The first "write_code" step MUST write 4 to 6 lines of code comments containing the DEFINITION & CONCEPT of "${topic}".
6. EXACT LINE-BY-LINE BREAKDOWN: The "speak" step AFTER "write_code" MUST explain every line by stating the EXACT line number and exact code snippet (e.g. "Line 1 me 'var a = 10;' se...").
7. PRE-PANEL ANNOUNCEMENT: Before opening console/terminal, include a "speak" step ("Aao ab Console/Terminal panel open karke live output inspect karte hain...").`;

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
        max_tokens: 3800
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
              type: 'speak',
              text: `Ab hum Example ${idx + 1} ka code write karne ja rahe hain...`
            });
            expandedRawSteps.push({
              type: 'write_code',
              file: step.file || defaultFile,
              code: chunk,
              text: `Writing Example ${idx + 1}...`
            });
            expandedRawSteps.push({
              type: 'speak',
              text: `Aao Example ${idx + 1} ko exact line-by-line samjhte hain aur iska output check karte hain.`
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
