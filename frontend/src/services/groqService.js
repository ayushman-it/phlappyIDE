// Groq LLM API Service for Topic-Specific Lessons & Clean Scratch Code

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'groq/compound-mini';

const SYSTEM_PROMPT = `
You are Phlappy, an expert AI Teacher and Coding Instructor for TCM One Code Studio.
You teach programming topics from scratch like a REAL HUMAN MENTOR in front of a live IDE!
Supported Languages: Python, HTML, CSS, JavaScript, C, and C++.

CRITICAL PEDAGOGY & EXAMPLE RULES:
1. ALWAYS KEEP EXAMPLES BASIC, SIMPLE & EASY TO UNDERSTAND (e.g. simple 1-5 loop, basic array iteration).
2. DO NOT WRITE ALL EXAMPLES IN ONE CODE BLOCK! Write ONLY ONE basic example per "write_code" step (max 3-5 lines).
3. PEDAGOGY LOOP FOR EACH EXAMPLE:
   - "write_code": Write 1 simple basic code example (e.g. Example 1).
   - "speak": IMMEDIATELY explain this code line-by-line in Hinglish.
   - "show_console" (if code uses console.log) / "show_preview" (for Web UI) / "show_terminal" (for Python/C/C++) + "run_code": OPEN CONSOLE/PREVIEW/TERMINAL TO SHOW OUTPUT RIGHT AWAY!
   - "speak": Briefly comment on the output.
   - ONLY THEN write Example 2 in a SEPARATE "write_code" step!

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
    { "id": 1, "title": "Module 1: Concept & Setup", "description": "...", "status": "pending" },
    { "id": 2, "title": "Module 2: Basic Syntax & Variables", "description": "...", "status": "pending" },
    { "id": 3, "title": "Module 3: Operations & Logic", "description": "...", "status": "pending" },
    { "id": 4, "title": "Module 4: Practical Output & Verification", "description": "...", "status": "pending" },
    { "id": 5, "title": "Module 5: Summary & Best Practices", "description": "...", "status": "pending" }
  ],
  "steps": [
    { "type": "speak", "text": "Hinglish intro..." },
    { "type": "open_file", "file": "script.js" },
    { "type": "write_code", "file": "script.js", "code": "..." },
    { "type": "speak", "text": "Hinglish line-by-line explanation..." },
    { "type": "show_console" },
    { "type": "speak", "text": "Explanation of live output..." },
    { "type": "write_code", "file": "script.js", "code": "..." },
    { "type": "speak", "text": "Explanation of next lines..." },
    { "type": "show_console" },
    { "type": "conclude", "text": "Summary..." }
  ]
}
`;

function getRichFallbackLesson(topic, envKey) {
  const topicLower = topic.toLowerCase();
  const defaultSyllabus = [
    { id: 1, title: 'Module 1: Concept & Foundations', description: `Detailed Hinglish explanation of ${topic} concept & real-world use`, status: 'pending' },
    { id: 2, title: 'Module 2: Code Structure & Setup', description: `Setting up workspace files and basic syntax from scratch`, status: 'pending' },
    { id: 3, title: 'Module 3: Incremental Implementation & Execution', description: `Writing working example code line-by-line in editor`, status: 'pending' },
    { id: 4, title: 'Module 4: Practical Output Verification', description: `Executing preview/console/terminal after each example to analyze output`, status: 'pending' },
    { id: 5, title: 'Module 5: Summary & Best Practices', description: `Recap of key takeaways, memory rules & best practices`, status: 'pending' }
  ];

  if (envKey === 'CPP_BASIC') {
    return {
      title: topic,
      environment: 'CPP_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum C++ me ${topic} ko bilkul zero level se seekhenge. Pehle samjhte hain ki ${topic} kya hai.` },
        { type: 'open_file', file: 'main.cpp' },
        { type: 'write_code', file: 'main.cpp', code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "=== Phlappy AI Teacher: ${topic} ===" << endl;\n` },
        { type: 'speak', text: `Humne #include <iostream> aur namespace std declare kiya. Ab Example 1 write karke output check karte hain!` },
        { type: 'write_code', file: 'main.cpp', code: `    // Example 1: Basic String & Integer Variables\n    string studentName = "Phlappy C++ Learner";\n    int totalMarks = 485;\n    cout << "Student: " << studentName << " | Marks: " << totalMarks << endl;\n` },
        { type: 'speak', text: `Example 1 complete! Aao Terminal me G++ compiler run karke output verify karte hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Bahut badiya! Terminal me student name aur marks print ho gaye. Ab aao Example 2 calculate karte hain.` },
        { type: 'write_code', file: 'main.cpp', code: `    // Example 2: Double Calculation\n    double percentage = (totalMarks / 500.0) * 100;\n    cout << "Calculated Percentage: " << percentage << "%" << endl;\n    return 0;\n}\n` },
        { type: 'speak', text: `Example 2 me percentage calculate ho gaya. Aao terminal me rerun output dekhte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, yeh tha ${topic} in C++! Fast execution aur explicit data types C++ ko powerful banate hain.` }
      ]
    };
  }

  if (envKey === 'C_BASIC') {
    return {
      title: topic,
      environment: 'C_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum C Language me ${topic} ko bilkul basic concept ke saath seekhenge.` },
        { type: 'open_file', file: 'main.c' },
        { type: 'write_code', file: 'main.c', code: `#include <stdio.h>\n\nint main() {\n    printf("=== Phlappy AI Teacher: ${topic} ===\\n");\n` },
        { type: 'speak', text: `Humne #include <stdio.h> Include ki hai. Aao Example 1 declare karke output execute karte hain.` },
        { type: 'write_code', file: 'main.c', code: `    // Example 1: Basic Variables & Format Specifiers\n    int student_id = 101;\n    printf("Student ID: %d\\n", student_id);\n` },
        { type: 'speak', text: `Example 1 complete! Aao GCC compiler run karke Terminal me output verify karte hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Shabash! Terminal me Student ID print ho gayi. Aao ab Example 2 float score specify karte hain.` },
        { type: 'write_code', file: 'main.c', code: `    // Example 2: Float Grade Calculation\n    float score = 98.5;\n    printf("Final Score: %.2f\\n", score);\n    printf("C Program executed successfully!\\n");\n    return 0;\n}\n` },
        { type: 'speak', text: `Example 2 ready hai! Aao Terminal me rerun karke latest output verify karte hain.` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, yeh tha ${topic} in C Programming! Format specifiers aur semicolons ka dhyan rakhein.` }
      ]
    };
  }

  if (envKey === 'PYTHON_BASIC') {
    return {
      title: topic,
      environment: 'PYTHON_BASIC',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum Python me ${topic} ko bilkul basic se seekhenge.` },
        { type: 'open_file', file: 'main.py' },
        { type: 'write_code', file: 'main.py', code: `# ====================================\n# Phlappy AI Teacher: ${topic}\n# ====================================\n\n# Example 1: Simple For Loop (0 se 4 iterations)\nfor i in range(5):\n    print("For Loop iteration:", i)\n` },
        { type: 'speak', text: `Dekhiye Example 1 me For loop 0 se 4 tak iterate karega. Aao pehle Example 1 run karke terminal output dekhte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'speak', text: `Dekhiye terminal me For loop ki saari 5 iterations print ho gayi! Ab aao Example 2 While loop write karte hain.` },
        { type: 'write_code', file: 'main.py', code: `\n# Example 2: While Loop (Sum calculation)\ncounter = 1\ntotal = 0\nwhile counter <= 5:\n    total += counter\n    counter += 1\nprint("While loop total sum:", total)\n` },
        { type: 'speak', text: `While loop 1 se 5 tak counter add karega. Aao rerun karke While loop output verify karte hain!` },
        { type: 'show_terminal' },
        { type: 'run_code' },
        { type: 'conclude', text: `Toh dosto, har example ke baad terminal output dekhna sabse best pedagogy hai!` }
      ]
    };
  }

  // JS / Web Fallback
  if (topicLower.includes('js') || topicLower.includes('javascript') || topicLower.includes('loop')) {
    return {
      title: topic,
      environment: 'HTML_CSS_JS',
      syllabus: defaultSyllabus,
      steps: [
        { type: 'speak', text: `Namaste dosto! Aaj hum JavaScript me ${topic} ko bilkul basic se deep level tak seekhenge.` },
        { type: 'open_file', file: 'script.js' },
        { type: 'write_code', file: 'script.js', code: `// Example 1: Simple 1 to 5 counting loop\nfor (let i = 1; i <= 5; i++) {\n  console.log("Count:", i);\n}\n` },
        { type: 'speak', text: `Dekhiye Example 1 me humne simple for loop se 1 se 5 tak numbers print kiye. Aao Console panel open karke pehla live output inspect karte hain!` },
        { type: 'show_console' },
        { type: 'speak', text: `Bahut badiya! Console me Count 1 se 5 print ho gaya. Ab aao Example 2: Array elements iterate karte hain.` },
        { type: 'write_code', file: 'script.js', code: `\n// Example 2: Array ke items par loop\nconst fruits = ["Apple", "Banana", "Mango"];\nfor (let idx = 0; idx < fruits.length; idx++) {\n  console.log("Fruit:", fruits[idx]);\n}\n` },
        { type: 'speak', text: `Example 2 me array elements (Apple, Banana, Mango) for loop se iterate hue. Aao Console me output verify karte hain!` },
        { type: 'show_console' },
        { type: 'conclude', text: `Toh dosto, har basic example ko alag-alag run karke dekhna sabse best mentor approach hai!` }
      ]
    };
  }

  return {
    title: topic,
    environment: 'HTML_CSS_JS',
    syllabus: defaultSyllabus,
    steps: [
      { type: 'speak', text: `Namaste dosto! Aaj hum ${topic} ko Web Development me zero se advance tak seekhenge.` },
      { type: 'open_file', file: 'index.html' },
      { type: 'write_code', file: 'index.html', code: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>${topic}</h1>\n  <script src="script.js"></script>\n</body>\n</html>` },
      { type: 'show_preview' },
      { type: 'open_file', file: 'script.js' },
      { type: 'write_code', file: 'script.js', code: `console.log("${topic} initialized");` },
      { type: 'show_console' },
      { type: 'conclude', text: `Lesson completed!` }
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
2. Generate 10 to 14 detailed sequential steps ("speak", "open_file", "write_code", "show_console"/"show_preview"/"show_terminal", "run_code", "conclude").
3. CRITICAL PEDAGOGY: KEEP EXAMPLES VERY BASIC AND SIMPLE (3-5 lines per example). DO NOT dump multiple examples in one code block!
4. For EACH basic example (e.g. Example 1, Example 2):
   - "write_code": Write ONLY Example 1 (3-5 lines).
   - "speak": Explain Example 1 in Hinglish line-by-line.
   - "show_console" (if console.log is used) or "show_preview" or "show_terminal" + "run_code": OPEN CONSOLE/PREVIEW/TERMINAL TO SHOW OUTPUT RIGHT AWAY!
   - "speak": Briefly comment on Example 1 output.
   - Then move to Example 2 in a separate "write_code" step!`;


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
        max_tokens: 3000
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

    // Code Splitter: If LLM returns a single write_code block containing multiple examples, split them into separate steps!
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

    // Pedagogy Guarantee: Ensure every code/explanation block runs and shows output IMMEDIATELY
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
            // For Web / JS stack: Check if code uses console.log
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
