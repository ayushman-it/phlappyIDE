// Groq LLM API Service for Deep Pedagogy: Intro -> Pre-Write Explanation -> Exact Line-by-Line Code & Comments

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const MODEL_NAME = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL_NAME = 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `
You are Phlappy, a friendly and expert AI Master Instructor for TCM One Code Studio.
You teach programming topics like an engaging, clear, and passionate HUMAN MENTOR standing in front of a live classroom!

PEDAGOGY GUIDELINES:
1. TOPIC INTRO ("speak"):
   - Start with a warm, natural Hinglish intro (3-5 sentences) introducing the topic definition, a simple real-life analogy, and why it matters in real projects.

2. BEFORE WRITING CODE ("speak"):
   - Briefly tell the student what example code you are going to write (e.g., "Aao sabse pehle editor me definition comments aur simple example write karte hain.").

3. DEFINITION COMMENTS (Inside "write_code"):
   - Write clean, structured header comments (4-6 lines) covering Definition, Purpose, and Rules.

4. CODE EXPLANATION ("speak"):
   - Explain the code clearly line by line (Line 1, Line 2...) explaining what each line does in simple, human Hinglish.

5. OUTPUT ANALYSIS ("speak"):
   - After showing preview/console/terminal output, explain what got printed on screen and why.

6. CONCLUSION ("conclude"):
   - Give a warm, encouraging recap of what we learned.

LANGUAGE & ENVIRONMENT RULES:
- C: Environment "C_BASIC", main file "main.c", includes <stdio.h>, uses printf().
- C++: Environment "CPP_BASIC", main file "main.cpp", includes <iostream>, uses cout.
- Python: Environment "PYTHON_BASIC", main file "main.py", uses print().
- HTML/CSS/JS: Environment "HTML_CSS_JS", main files "index.html", "style.css", "script.js".

STRICTLY RETURN VALID JSON ONLY:
{
  "title": "Topic Name",
  "environment": "HTML_CSS_JS" | "PYTHON_BASIC" | "C_BASIC" | "CPP_BASIC",
  "syllabus": [
    { "id": 1, "title": "Module 1: Concept Introduction", "description": "...", "status": "pending" },
    { "id": 2, "title": "Module 2: Code Structure & Definition", "description": "...", "status": "pending" },
    { "id": 3, "title": "Module 3: Code Implementation", "description": "...", "status": "pending" },
    { "id": 4, "title": "Module 4: Output Analysis", "description": "...", "status": "pending" },
    { "id": 5, "title": "Module 5: Summary", "description": "...", "status": "pending" }
  ],
  "steps": [
    { "type": "speak", "text": "Hinglish intro speech introducing definition and real-world analogy..." },
    { "type": "open_file", "file": "script.js" },
    { "type": "speak", "text": "Aao editor me definition comments aur example code write karte hain." },
    { "type": "write_code", "file": "script.js", "code": "// DEFINITION: ...\n..." },
    { "type": "speak", "text": "Line 1 me ... Line 2 me ... Clear breakdown." },
    { "type": "show_console" },
    { "type": "speak", "text": "Output explanation..." },
    { "type": "conclude", "text": "Encouraging summary..." }
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
        { type: 'write_code', file: 'main.cpp', code: `    // Line 1: Student Name variable\n    string studentName = "Phlappy C++ Learner";\n    // Line 2: Marks variable\n    int totalMarks = 485;\n    // Line 3: Output information\n    cout << "Student: " << studentName << " | Marks: " << totalMarks << endl;\n` },
        { type: 'speak', text: `Line 1 me string variable studentName me text store kiya. Line 2 me totalMarks me number 485 store kiya. Line 3 me cout stream se values screen par print kar rahe hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me dekhiye student name aur marks 485 bilkul clean display ho rahe hain.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Line 4: Calculate Percentage\n    double percentage = (totalMarks / 500.0) * 100;\n    cout << "Calculated Percentage: " << percentage << "%" << endl;\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 4 me percentage calculate karke print ki aur return 0 se program complete hua.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
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
        { type: 'speak', text: `Ab Example 1 का C code write karte hain.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 1: Student ID variable\n    int student_id = 101;\n    // Line 2: Print formatted integer\n    printf("Student ID: %d\\n", student_id);\n` },
        { type: 'speak', text: `Line 1 me student_id 101 initialize hua. Line 2 me printf ke %d specifier se ID print hui.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output me Student ID 101 print ho gaya.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 3: Score float variable\n    float score = 98.5;\n    printf("Final Score: %.2f\\n", score);\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 3 me float score 98.5 store hua aur printf me %.2f specifier se print kiya.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
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
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me dekhiye 0 se 4 tak output aagaya.` },
        { type: 'write_code', file: 'main.py', code: `\n# Example 2: While loop sum\ncounter = 1\ntotal = 0\nwhile counter <= 5:\n    total += counter\n    counter += 1\nprint("Calculated Total Sum:", total)\n` },
        { type: 'speak', text: `Here while loop 1 se 5 tak numbers ko add karke total sum calculate karta hai.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
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
      { type: 'show_console' },
      { type: 'speak', text: `Console me student name 'Phlappy AI Learner' aur total marks 95 bilkul clean log ho gaye.` },
      { type: 'write_code', file: 'script.js', code: `\n// Example 2: Scope test\nif (true) {\n  var globalScopeVar = "I am visible everywhere!";\n  let blockScopeLet = "I am restricted inside this block!";\n}\nconsole.log(globalScopeVar);\n` },
      { type: 'speak', text: `if-block ke andar var variable block ke bahar bhi visible rehta hai, jabki let variable block ke andar restricted rehta hai.` },
      { type: 'show_console' },
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

  const prompt = `Generate a deep 3 to 4 minute topic-specific lesson for Topic: "${topic}". Difficulty: ${difficulty}. Language: ${language}. Environment: ${actualEnv}.
Requirements:
1. Provide a 5-module "syllabus" array breaking down the lesson roadmap for "${topic}".
2. Generate 14 to 20 detailed sequential steps ("speak", "open_file", "write_code", "show_console"/"show_preview"/"show_terminal", "run_code", "conclude").
3. MANDATORY STEP 1: Step 1 MUST be a rich Hinglish "speak" introduction introducing the topic definition, real-world use, and why we use it.
4. PRE-WRITE EXPLANATION: BEFORE writing code or comments in "write_code", include a "speak" step announcing WHAT you are about to write/comment (e.g. "Aao sabse pehle editor me definition comments write karte hain...").
5. MANDATORY DEFINITION COMMENTS: The first "write_code" step MUST write 4 to 6 lines of code comments containing the DEFINITION & CONCEPT of "${topic}".
6. EXACT LINE-BY-LINE BREAKDOWN: The "speak" step AFTER "write_code" MUST explain every line by stating the EXACT line number and exact code snippet (e.g. "Line 1 me 'var a = 10;' se...").
7. PRE-PANEL ANNOUNCEMENT: Before opening console/terminal, include a "speak" step ("Aao ab Console/Terminal panel open karke live output inspect karte hain...").`;

  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  const fetchWithModel = async (selectedModel) => {
    return await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 3800
      })
    });
  };

  try {
    let response = await fetchWithModel(MODEL_NAME);
    if (!response.ok) {
      console.warn(`Groq Primary Model (${MODEL_NAME}) failed, retrying with fallback model (${FALLBACK_MODEL_NAME})...`);
      response = await fetchWithModel(FALLBACK_MODEL_NAME);
    }

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
