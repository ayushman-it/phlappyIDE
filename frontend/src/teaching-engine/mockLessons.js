// Structured Teaching Steps for Demos

export const MOCK_LESSON_JS_CLICK = {
  id: 101,
  title: 'JavaScript Click Event',
  environment: 'HTML_CSS_JS',
  language: 'Hinglish',
  duration: 120,
  steps: [
    {
      type: 'speak',
      text: 'Aaj hum JavaScript ka Click Event samjhenge. Kaise user click hone par code execute hota hai!'
    },
    {
      type: 'create_file',
      file: 'index.html'
    },
    {
      type: 'open_file',
      file: 'index.html'
    },
    {
      type: 'write_code',
      file: 'index.html',
      code: `<button id="demoButton">Click Me</button>\n<p id="msg">Waiting for interaction...</p>`
    },
    {
      type: 'speak',
      text: 'Humne index.html me ek button create kar liya. Ab script.js me click event listener lagate hain.'
    },
    {
      type: 'open_file',
      file: 'script.js'
    },
    {
      type: 'write_code',
      file: 'script.js',
      code: `// JavaScript Click Event Handler\ndocument.querySelector('#demoButton').onclick = function() {\n  console.log('Button clicked!');\n  document.querySelector('#msg').innerText = 'Event successfully triggered!';\n};`
    },
    {
      type: 'show_preview'
    },
    {
      type: 'speak',
      text: 'Ab Preview panel me button dekhiye. Ab hum automatic click event simulate karenge.'
    },
    {
      type: 'wait',
      duration: 1500
    },
    {
      type: 'click_element',
      selector: '#demoButton'
    },
    {
      type: 'show_console'
    },
    {
      type: 'speak',
      text: 'Dekha aapne! Button click hote hi script run hui, document message update hua aur console me "Button clicked!" log aagaya.'
    },
    {
      type: 'conclude',
      text: 'Isi tarah JavaScript Click Events user interaction ko process karte hain. Mission accomplished!'
    }
  ]
};

export const MOCK_LESSON_PYTHON = {
  id: 102,
  title: 'Python Variables & Output',
  environment: 'PYTHON_BASIC',
  language: 'Hinglish',
  duration: 90,
  steps: [
    {
      type: 'speak',
      text: 'Aaj hum Python variables aur print statement sikhne ja rahe hain.'
    },
    {
      type: 'open_file',
      file: 'main.py'
    },
    {
      type: 'write_code',
      file: 'main.py',
      code: `# Python Basics Demo\ncourse = "TCM One"\ninstructor = "Phlappy AI"\nprint(f"Welcome to {course} powered by {instructor}!")`
    },
    {
      type: 'show_terminal'
    },
    {
      type: 'run_code'
    },
    {
      type: 'speak',
      text: 'Terminal window me dekhiye, Python code ne format string me variable substitute karke output display kar diya.'
    },
    {
      type: 'conclude',
      text: 'Variables data store karte hain aur print() unhe user ko display karta hai.'
    }
  ]
};
