// Groq LLM API Service for Deep Pedagogy: Intro -> Pre-Write Explanation -> Exact Line-by-Line Code & Comments

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'groq/compound-mini';

const SYSTEM_PROMPT = `
You are Phlappy, a world-class Master AI Coding Instructor & Senior Tech Lead for TCM One Code Studio.
You teach programming topics like an energetic, passionate HUMAN MENTOR standing in front of a live classroom!

CRITICAL MANDATORY MENTOR PEDAGOGY RULES FOR DEEP EXPLANATION:
1. ALWAYS START WITH A DEEP TOPIC INTRODUCTION ("speak"):
   - Step 1 MUST ALWAYS be a rich, engaging Hinglish speech (4-6 sentences) introducing:
     a) Exact Definition of the topic
     b) Real-world analogy (e.g. Variable = Labeled Box, Function = Recipe Machine, Memory = House Address)
     c) Why we use it in modern software development & interview importance!

2. PRE-WRITE EXPLANATION BEFORE TYPING ("speak" BEFORE "write_code"):
   - BEFORE writing code or comments, include a "speak" step explaining WHAT concept and code structure you are about to write into the file!
   - Example: "Aao sabse pehle editor me main.py file ke top par Topic ki complete DEFINITION aur syntax rules comments ke form me write karte hain..."

3. MANDATORY CONCEPT DEFINITION IN COMMENTS (Inside "write_code"):
   - The first "write_code" step MUST write 5 to 7 lines of detailed code comments containing the DEFINITION, SYNTAX RULES, REAL-WORLD PURPOSE, and KEY DIFFERENCES of the topic!

4. EXACT LINE-BY-LINE TOKEN & SNIPPET BREAKDOWN ("speak" AFTER "write_code"):
   - Immediately after writing code, your "speak" step MUST explain every single line by stating:
     a) The EXACT line number (e.g. "Line 1 me...", "Line 2 me...")
     b) The exact code snippet & keyword meaning (e.g. "'let studentAge = 21;' me 'let' block scope variable declare karta hai...")
     c) Data types and memory allocation logic!

5. LIVE OUTPUT INSPECTION & ANALYSIS ("speak" AFTER "show_console"/"show_terminal"/"show_preview"):
   - When switching to console/terminal/preview, include a "speak" step that explicitly guides the student to look at the screen and explains:
     a) What exact output line was generated
     b) Why the compiler/interpreter produced that output
     c) How the code logic directly resulted in this live output!

6. CONCLUDING RECAP & BEST PRACTICES ("conclude"):
   - End with a strong, memorable recap step summarizing key takeaways, memory rules, and common beginner pitfalls to avoid!

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
    { "id": 1, "title": "Module 1: Concept Definition & Real-world Analogy", "description": "...", "status": "pending" },
    { "id": 2, "title": "Module 2: Code Structure & Header Comments", "description": "...", "status": "pending" },
    { "id": 3, "title": "Module 3: Line-by-Line Code Breakdown", "description": "...", "status": "pending" },
    { "id": 4, "title": "Module 4: Live Output Inspection & Deep Analysis", "description": "...", "status": "pending" },
    { "id": 5, "title": "Module 5: Best Practices & Summary", "description": "...", "status": "pending" }
  ],
  "steps": [
    { "type": "speak", "text": "Rich Hinglish intro speech with definition, real-world analogy, and purpose..." },
    { "type": "open_file", "file": "script.js" },
    { "type": "speak", "text": "Aao pehle editor me definition comments aur example 1 setup karte hain." },
    { "type": "write_code", "file": "script.js", "code": "// =========================================\n// DEFINITION: ...\n// =========================================\n..." },
    { "type": "speak", "text": "Exact line-by-line breakdown explaining Line 1, Line 2, Line 3..." },
    { "type": "speak", "text": "Aao ab Terminal/Console open karke live output inspect karte hain." },
    { "type": "show_console" },
    { "type": "speak", "text": "Deep analysis of the output displayed on screen..." },
    { "type": "conclude", "text": "Recap and best practices summary..." }
  ]
}
`;

function getRichFallbackLesson(topic, envKey) {
  const defaultSyllabus = [
    { id: 1, title: 'Module 1: Concept Definition & Real-world Analogy', description: `Deep Hinglish intro to ${topic} concept, real-world role & software purpose`, status: 'pending' },
    { id: 2, title: 'Module 2: Definition Comments & Syntax Rules', description: `Writing full definition comments and architectural rules in editor`, status: 'pending' },
    { id: 3, title: 'Module 3: Exact Line-by-Line Breakdown', description: `Writing working example code with line-by-line keyword explanations`, status: 'pending' },
    { id: 4, title: 'Module 4: Live Terminal/Console Output Analysis', description: `Executing preview/console/terminal after each example to analyze output`, status: 'pending' },
    { id: 5, title: 'Module 5: Summary & Best Practices', description: `Recap of key takeaways, memory rules & common pitfalls to avoid`, status: 'pending' }
  ];

  if (envKey === 'CPP_BASIC') {
    return {
      title: topic,
      environment: 'CPP_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Main Phlappy AI Master Instructor hoon. Aaj hum C++ me ${topic} ko bilkul zero se deep mentor level par seekhenge. Real world me ${topic} high-performance software systems, game engines, aur backend memory optimization ke liye zaroori hota hai. Imagine karo ki ${topic} RAM memory me ek organized storage container ki tarah kaam karta hai.` },
        { type: 'open_file', file: 'main.cpp' },
        { type: 'speak', text: `Aao sabse pehle main.cpp file me ${topic} ki complete DEFINITION, Memory Rules, aur Header comments write karte hain.` },
        { type: 'write_code', file: 'main.cpp', code: `// =========================================================\n// CONCEPT & DEFINITION: C++ ${topic}\n// - Definition: High-performance C++ object and memory construct.\n// - Real-world Use: Fast hardware-level memory access & execution.\n// - Key Rule: Always declare data types clearly before allocation.\n// =========================================================\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "=== Phlappy AI Teacher: ${topic} ===" << endl;\n` },
        { type: 'speak', text: `Sabse pehle humne top par ${topic} ki complete definition comments aur standard iostream namespace setup write kiya.` },
        { type: 'speak', text: `Ab hum Example 1 ka practical C++ code write karte hain.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Line 1: String variable for Student Name\n    string studentName = "Phlappy C++ Learner";\n    // Line 2: Integer variable for total score\n    int totalMarks = 485;\n    // Line 3: Display values using cout stream\n    cout << "Student: " << studentName << " | Marks: " << totalMarks << endl;\n` },
        { type: 'speak', text: `Aao exact line-by-line code samjhte hain: Line 1 'string studentName = "Phlappy C++ Learner";' me text data store hua. Line 2 'int totalMarks = 485;' me 4 bytes integer memory allocate hui. Line 3 'cout << ...' output stream se values ko display karta hai.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke G++ compiler se code execute karte hain aur live output verify karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal screen par dekhiye: 'Student: Phlappy C++ Learner | Marks: 485' bilkul clean display hua hai. Yeh humare cout statement ka direct outcome hai!` },
        { type: 'write_code', file: 'main.cpp', code: `    // Line 4: Calculate percentage with double precision\n    double percentage = (totalMarks / 500.0) * 100;\n    cout << "Calculated Percentage: " << percentage << "%" << endl;\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 4 'double percentage = (totalMarks / 500.0) * 100;' me float division decimal accuracy ke sath hui, aur return 0 ne program successful exit state clear kiya.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output par 97% calculate ho chuka hai.` },
        { type: 'conclude', text: `Toh dosto, yeh tha ${topic} in C++! Always write clear definition comments and track data types to write production-grade code.` }
      ]
    };
  }

  if (envKey === 'C_BASIC') {
    return {
      title: topic,
      environment: 'C_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum C Language me ${topic} ko deep mentor level par seekhenge. C Language operating systems, embedded hardware, aur microcontrollers ki foundation hai. ${topic} C programming me memory management aur fast execution ke liye use hota hai.` },
        { type: 'open_file', file: 'main.c' },
        { type: 'speak', text: `Aao sabse pehle main.c file ke top par ${topic} ki C definition and header comments write karte hain.` },
        { type: 'write_code', file: 'main.c', code: `/* =========================================================\n   CONCEPT & DEFINITION: C Language ${topic}\n   - Definition: Low-level procedural programming logic.\n   - Purpose: Direct hardware interaction & minimal memory overhead.\n   - Format Specifiers: %d for integer, %f for float, %s for string.\n   ========================================================= */\n\n#include <stdio.h>\n\nint main() {\n    printf("=== Phlappy AI Teacher: ${topic} ===\\n");\n` },
        { type: 'speak', text: `Sabse pehle comments me humne ${topic} ki definition, format specifiers aur #include <stdio.h> standard library setup likhi.` },
        { type: 'speak', text: `Ab hum Example 1 ka C implementation code write karte hain.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 1: Integer Variable declaration for Student ID\n    int student_id = 101;\n    // Line 2: Output formatted integer string using %d specifier\n    printf("Student ID: %d\\n", student_id);\n` },
        { type: 'speak', text: `Exact line-by-line explanation: Line 1 'int student_id = 101;' RAM me integer box initialize karta hai. Line 2 'printf("Student ID: %d\\n", student_id);' me %d placeholder variable ID ki value print karta hai.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke GCC compiler Output inspect karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output screen par dekhiye 'Student ID: 101' print ho chuka hai.` },
        { type: 'write_code', file: 'main.c', code: `    // Line 3: Float variable for grade score\n    float score = 98.5;\n    printf("Final Score: %.2f\\n", score);\n    return 0;\n}\n` },
        { type: 'speak', text: `Line 3 'float score = 98.5;' me decimal value store hui aur printf me %.2f specifier ne output ko exact 2 decimal places tak clean format kiya.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal output me 98.50 formatted response successfully print ho gaya.` },
        { type: 'conclude', text: `Toh dosto, C programming me definition comments aur format specifiers sabse crucial hote hain.` }
      ]
    };
  }

  if (envKey === 'PYTHON_BASIC') {
    return {
      title: topic,
      environment: 'PYTHON_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum Python me ${topic} ko bilkul zero se deep mentor level par seekhenge. Python real-world Data Science, Artificial Intelligence, Web Automation aur Backend APIs me use hota hai. ${topic} Python ka ek powerful feature hai jo complex logic ko super clean aur readable banata hai.` },
        { type: 'open_file', file: 'main.py' },
        { type: 'speak', text: `Aao sabse pehle main.py file ke top par ${topic} ki complete DEFINITION aur Use Case comments write karte hain.` },
        { type: 'write_code', file: 'main.py', code: `# =========================================================\n# CONCEPT & DEFINITION: Python ${topic}\n# - Definition: High-level readable dynamic programming concept.\n# - Real-world Use Case: AI models, Data Analysis, & Web APIs.\n# - Dynamic Typing: Variables auto-detect type at runtime.\n# =========================================================\n\n# Line 1: Topic Header\nprint("=== Phlappy AI Teacher: ${topic} ===")\n` },
        { type: 'speak', text: `Top par humne Python ke dynamic nature aur ${topic} ki definition comments write ki.` },
        { type: 'speak', text: `Ab hum Example 1 ka Python code write karte hain.` },
        { type: 'write_code', file: 'main.py', code: `# Example 1: Loop iteration (0 se 4 tak)\nfor i in range(5):\n    print("Iteration index:", i)\n` },
        { type: 'speak', text: `Exact line-by-line breakdown: Line 'for i in range(5):' sequence generate karta hai 0 se 4 tak. Indented line 'print("Iteration index:", i)' har round me current index print karti hai.` },
        { type: 'speak', text: `Aao ab Terminal panel open karke Python script run karte hain aur live result inspect karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me dekhiye sequence 0, 1, 2, 3, 4 sequentially print hua hai. Indentation ne control flow define kiya.` },
        { type: 'write_code', file: 'main.py', code: `\n# Example 2: Accumulator pattern with condition\ncounter = 1\ntotal = 0\nwhile counter <= 5:\n    total += counter\n    counter += 1\nprint("Calculated Total Sum:", total)\n` },
        { type: 'speak', text: `Line-by-line breakdown: 'counter = 1' aur 'total = 0' initialize hue. 'while counter <= 5:' loop total me values add karta rehta hai jab tak counter 5 exceed na kare.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Terminal me Total Sum 15 print ho chuka hai!` },
        { type: 'conclude', text: `Toh dosto, Python me clean indentation aur clear comments se code production ready banta hai.` }
      ]
    };
  }

  // JS / Web Fallback
  return {
    title: topic,
    environment: 'HTML_CSS_JS',
    syllabus: defaultSyllabus,
    steps: [
      { type: 'speak', text: `Namaste dosto! Main Phlappy AI Master Instructor hoon. Aaj hum JavaScript me ${topic} ko bilkul zero level se deep practical level par seekhenge. Real world Web Apps, React apps, aur Server backends me ${topic} core foundation ka kaam karta hai. Imagine karo JavaScript memory ek digital locker ki tarah hai.` },
      { type: 'open_file', file: 'script.js' },
      { type: 'speak', text: `Aao sabse pehle script.js file me ${topic} ki complete DEFINITION, Scope Rules, aur Concept comments write karte hain.` },
      { type: 'write_code', file: 'script.js', code: `// =========================================================\n// CONCEPT & DEFINITION: JavaScript ${topic}\n// - Definition: Core JavaScript language building block.\n// - var: Function-scoped or global variable (legacy syntax).\n// - let: Block-scoped mutable variable (modern ES6 standard).\n// - const: Block-scoped constant value that cannot be reassigned.\n// =========================================================\n` },
      { type: 'speak', text: `Dekhiye humne pehle script.js top par var, let, const aur ${topic} ke architectural rules comments me log kar diye.` },
      { type: 'speak', text: `Ab hum Example 1 ka practical JavaScript code write karte hain.` },
      { type: 'write_code', file: 'script.js', code: `// Line 1: 'var' declaration (Global/Function scope)\nvar studentName = "Phlappy AI Learner";\n\n// Line 2: 'let' declaration (Block-scoped mutable variable)\nlet totalMarks = 95;\n\n// Line 3: 'const' declaration (Block-scoped constant)\nconst PASSING_MARKS = 40;\n\nconsole.log("Student Name:", studentName);\nconsole.log("Total Marks:", totalMarks, "| Passing Threshold:", PASSING_MARKS);\n` },
      { type: 'speak', text: `Aao exact line-by-line code samjhte hain: Line 1 'var studentName = "Phlappy AI Learner";' global variable banata hai. Line 2 'let totalMarks = 95;' block-scoped variable store karta hai. Line 3 'const PASSING_MARKS = 40;' reassignment block karta hai. Line 4-5 output inspect karte hain.` },
      { type: 'speak', text: `Aao ab Console panel open karke live browser output verify karte hain!` },
      { type: 'show_console' },
      { type: 'speak', text: `Console panel screen par dekhiye: 'Student Name: Phlappy AI Learner' aur 'Total Marks: 95 | Passing Threshold: 40' bilkul clear log hua hai!` },
      { type: 'write_code', file: 'script.js', code: `\n// Example 2: Block Scope comparison (let vs var)\nif (true) {\n  var globalScopeVar = "I am visible everywhere!";\n  let blockScopeLet = "I am restricted inside this block!";\n}\nconsole.log(globalScopeVar);\n// console.log(blockScopeLet); // ReferenceError if un-commented\n` },
      { type: 'speak', text: `Example 2 line-by-line: if-block ke andar 'var globalScopeVar' outer scope me leak hota hai, jabki 'let blockScopeLet' strictly block ke andar isolate rehta hai.` },
      { type: 'show_console' },
      { type: 'speak', text: `Console me global variable 'I am visible everywhere!' display hua hai.` },
      { type: 'conclude', text: `Toh dosto, yeh tha ${topic}! Real-world production apps me always 'let' aur 'const' ka use karein!` }
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
