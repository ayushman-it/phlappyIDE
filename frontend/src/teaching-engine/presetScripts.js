// Preset 3-Minute Master Scripts for Phlappy AI Teacher

export const PRESET_SCRIPT_JS_VARIABLES = {
  title: 'JavaScript Variables & Scope (3-Min Master Script)',
  environment: 'HTML_CSS_JS',
  syllabus: [
    { id: 1, title: 'Module 1: Topic Introduction', description: 'Introduction to JavaScript variables & scope', status: 'pending' },
    { id: 2, title: 'Module 2: Definition Comments Setup', description: 'Writing theoretical rules in code comments', status: 'pending' },
    { id: 3, title: 'Module 3: Line-by-Line Code Implementation', description: 'Practical coding of var, let, and const', status: 'pending' },
    { id: 4, title: 'Module 4: Live Console Inspection', description: 'Verifying output in console panel', status: 'pending' },
    { id: 5, title: 'Module 5: Summary & Scope Rules', description: 'Recap of best practices', status: 'pending' }
  ],
  steps: [
    { type: 'speak', text: 'Namaste dosto! Main Phlappy AI Teacher hoon. Aaj hum JavaScript ke saare variables - var, let, aur const ko 3 minute me detail se samjhenge. Real-world applications me variables data store karne ke liye containers hote hain.' },
    { type: 'open_file', file: 'script.js' },
    { type: 'speak', text: 'Aao sabse pehle script.js file ke top par Variables ki complete DEFINITION aur concept comments write karte hain.' },
    { type: 'write_code', file: 'script.js', code: `// =========================================================\n// CONCEPT & DEFINITION: JavaScript Variables & Scope\n// - Definition: Variables store data values in memory.\n// - var: Function-scoped or global variable (legacy syntax).\n// - let: Block-scoped mutable variable (modern ES6 standard).\n// - const: Block-scoped constant value that cannot be reassigned.\n// =========================================================\n` },
    { type: 'speak', text: 'Editor me dekhiye humne Definition Comments write kar diye. Ab hum Example 1 ka practical code write karne ja rahe hain.' },
    { type: 'write_code', file: 'script.js', code: `// Line 1: 'var' declaration (Global/Function scope)\nvar studentName = "Phlappy AI Learner";\n\n// Line 2: 'let' declaration (Block-scoped mutable score)\nlet totalMarks = 95;\n\n// Line 3: 'const' declaration (Block-scoped constant threshold)\nconst PASSING_MARKS = 40;\n\nconsole.log("Student Name:", studentName);\nconsole.log("Total Marks:", totalMarks, "| Passing Threshold:", PASSING_MARKS);\n` },
    { type: 'speak', text: 'Aao exact line-by-line breakdown samjhte hain: Line 1 "var studentName = ..." me global variable initialize hua. Line 2 "let totalMarks = 95;" me block-scoped score store kiya. Line 3 "const PASSING_MARKS = 40;" me fixed constant threshold define kiya. Line 4-5 console.log se print ho raha hai.' },
    { type: 'speak', text: 'Aao ab Console panel open karke live output inspect karte hain!' },
    { type: 'show_console' },
    { type: 'speak', text: 'Console output me student name "Phlappy AI Learner" aur total marks 95 bilkul sahi display ho rahe hain.' },
    { type: 'write_code', file: 'script.js', code: `\n// Example 2: Block Scope comparison (let vs var)\nif (true) {\n  var globalScopeVar = "Accessible outside block!";\n  let blockScopeLet = "Restricted inside block only!";\n}\nconsole.log("var Scope test:", globalScopeVar);\n` },
    { type: 'speak', text: 'Example 2 line-by-line: if-block ke andar banaya var globalScopeVar block ke bahar bhi accessible hai, par let blockScopeLet sirf block ke andar tak restricted rehta hai.' },
    { type: 'show_console' },
    { type: 'conclude', text: 'Toh dosto, yeh tha JavaScript Variables ka 3-minute master script lesson! Code ke pehle definition aur line-by-line explanation sabse effective pedagogical approach hai.' }
  ]
};

export const PRESET_SCRIPT_PYTHON_LOOPS = {
  title: 'Python Loops & Lists (3-Min Master Script)',
  environment: 'PYTHON_BASIC',
  syllabus: [
    { id: 1, title: 'Module 1: Concept Introduction', description: 'Understanding iteration in Python', status: 'pending' },
    { id: 2, title: 'Module 2: Definition Comments & Syntax', description: 'Writing syntax rules in comments', status: 'pending' },
    { id: 3, title: 'Module 3: For Loop & Range Execution', description: 'Line-by-line loop execution', status: 'pending' },
    { id: 4, title: 'Module 4: Terminal Output Verification', description: 'Checking stdout in terminal', status: 'pending' },
    { id: 5, title: 'Module 5: Summary', description: 'Recap of loop performance', status: 'pending' }
  ],
  steps: [
    { type: 'speak', text: 'Namaste dosto! Aaj hum Python me Loops aur Range iteration ko 3 minute me seekhenge. Loops aisi instructions hote hain jo code blocks ko multiple times repeat karte hain.' },
    { type: 'open_file', file: 'main.py' },
    { type: 'speak', text: 'Aao sabse pehle main.py file ke top par Python Loops ki complete DEFINITION comments write karte hain.' },
    { type: 'write_code', file: 'main.py', code: `# =========================================================\n# CONCEPT & DEFINITION: Python Loops & Iteration\n# - Definition: Repeating code blocks until condition is met.\n# - range(n): Generates numbers from 0 up to n-1.\n# - for item in list: Sequentially iterates through elements.\n# =========================================================\n\nprint("=== Phlappy AI Teacher: Python Loops ===")\n` },
    { type: 'speak', text: `Sabse pehle comments me dekhiye Python Loops ki concept definition. Ab hum Example 1 ka practical Python code write karne ja rahe hain.` },
    { type: 'write_code', file: 'main.py', code: `# Line 1: Simple For Loop iterating 0 to 4\nfor index in range(5):\n    print("Loop Iteration Step:", index)\n` },
    { type: 'speak', text: 'Exact line-by-line explanation: Line "for index in range(5):" me range(5) 0 se 4 tak numbers return karega. Next line "print(...)" me har iteration ka step index stdout par display hoga.' },
    { type: 'speak', text: 'Aao ab Terminal panel open karke Python script execute karte hain.' },
    { type: 'show_terminal' },
    { type: 'run_code' },
    { type: 'speak', text: 'Terminal me dekhiye index 0 se 4 tak 5 steps print ho gaye.' },
    { type: 'write_code', file: 'main.py', code: `\n# Example 2: List iteration with fruit names\nfruits = ["Apple", "Banana", "Mango", "Orange"]\nfor fruit in fruits:\n    print("Selected Fruit:", fruit)\n` },
    { type: 'speak', text: 'Example 2 line-by-line: fruits list me 4 items store kiye. "for fruit in fruits:" loop ek-ek karke har fruit ko print karega.' },
    { type: 'show_terminal' },
    { type: 'run_code' },
    { type: 'conclude', text: 'Toh dosto, yeh tha Python Loops ka 3-minute master script lesson!' }
  ]
};

export const PRESET_SCRIPT_CPP_OOP = {
  title: 'C++ Classes & OOP (3-Min Master Script)',
  environment: 'CPP_BASIC',
  syllabus: [
    { id: 1, title: 'Module 1: OOP Concept Intro', description: 'Classes & Objects in C++', status: 'pending' },
    { id: 2, title: 'Module 2: Definition Comments', description: 'Writing Class definitions in comments', status: 'pending' },
    { id: 3, title: 'Module 3: Class Implementation', description: 'Creating class methods & variables', status: 'pending' },
    { id: 4, title: 'Module 4: G++ Terminal Compilation', description: 'Building & running main.cpp', status: 'pending' },
    { id: 5, title: 'Module 5: Summary', description: 'Recap of OOP principles', status: 'pending' }
  ],
  steps: [
    { type: 'speak', text: 'Namaste dosto! Aaj hum C++ me Classes aur Objects ko 3 minute me detail se samjhenge. OOP real-world entities ko code me represent karne ka best तरीका hai.' },
    { type: 'open_file', file: 'main.cpp' },
    { type: 'speak', text: 'Aao sabse pehle main.cpp file ke top par C++ Classes ki DEFINITION comments write karte hain.' },
    { type: 'write_code', file: 'main.cpp', code: `// =========================================================\n// CONCEPT & DEFINITION: C++ Classes & Object-Oriented Programming\n// - Class: A user-defined blueprint containing attributes & methods.\n// - Object: An instance of a class occupying memory.\n// - Access Specifier (public): Allows members to be accessed outside.\n// =========================================================\n\n#include <iostream>\n#include <string>\nusing namespace std;\n` },
    { type: 'speak', text: 'Comments me Class definition declare karne ke baad, ab hum Car class ka code write karne ja rahe hain.' },
    { type: 'write_code', file: 'main.cpp', code: `class Car {\npublic:\n    string brand;\n    int speed;\n\n    void displayInfo() {\n        cout << "Car Brand: " << brand << " | Speed: " << speed << " km/h" << endl;\n    }\n};\n\nint main() {\n    Car myCar;\n    myCar.brand = "Tesla";\n    myCar.speed = 220;\n    myCar.displayInfo();\n    return 0;\n}\n` },
    { type: 'speak', text: 'Exact line-by-line explanation: "class Car" me brand aur speed attributes declare kiye. "displayInfo()" function details print karta hai. "int main()" me myCar object banaya, values assign ki aur displayInfo() call kiya.' },
    { type: 'speak', text: 'Aao ab Terminal panel open karke G++ compiler se main.cpp run karte hain.' },
    { type: 'show_terminal' },
    { type: 'run_code' },
    { type: 'speak', text: 'Terminal me "Car Brand: Tesla | Speed: 220 km/h" print ho gaya!' },
    { type: 'conclude', text: 'Toh dosto, C++ me classes se modular reusable code likhna kitna aasan hai!' }
  ]
};
