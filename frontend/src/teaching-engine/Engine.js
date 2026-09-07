import { useStudioStore } from '../store/studioStore';
import { recorderInstance } from '../services/recorderService';
import { aiAudioService } from '../services/aiAudioService';

// Python Output Evaluator Engine
function evaluatePythonOutput(pyCode) {
  const outputs = [];
  if (!pyCode || !pyCode.trim()) return ['> Program executed successfully.'];

  const lines = pyCode.split('\n');
  const scope = {};
  let currentOutputLine = '';

  const pushLine = (txt) => {
    if (currentOutputLine) {
      outputs.push(currentOutputLine + txt);
      currentOutputLine = '';
    } else {
      outputs.push(txt);
    }
  };

  const appendText = (txt) => {
    currentOutputLine += txt;
  };

  function evalExpr(exprStr, localScope = {}) {
    let expr = exprStr.trim();
    if (!expr) return { text: '', endParam: null };

    let endParam = null;
    const endMatch = expr.match(/,\s*end\s*=\s*["'](.*?)["']/);
    if (endMatch) {
      endParam = endMatch[1];
      expr = expr.replace(/,\s*end\s*=\s*["'].*?["']/, '').trim();
    }

    const mergedScope = { ...scope, ...localScope };

    if (expr.startsWith('f"') || expr.startsWith("f'")) {
      let quote = expr[1];
      let clean = expr.slice(2);
      if (clean.endsWith(quote)) clean = clean.slice(0, -1);
      clean = clean.replace(/\{([^}]+)\}/g, (_, inner) => {
        try {
          let innerExpr = inner.trim();
          Object.keys(mergedScope).forEach(k => {
            const reg = new RegExp(`\\b${k}\\b`, 'g');
            innerExpr = innerExpr.replace(reg, JSON.stringify(mergedScope[k]));
          });
          return Function(`"use strict"; return (${innerExpr})`)();
        } catch {
          return mergedScope[inner.trim()] !== undefined ? mergedScope[inner.trim()] : inner;
        }
      });
      return { text: clean, endParam };
    }

    const parts = expr.split(/,\s*/);
    const resultParts = parts.map(p => {
      p = p.trim();
      if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
        return p.slice(1, -1);
      }
      try {
        let evalE = p;
        Object.keys(mergedScope).forEach(k => {
          const reg = new RegExp(`\\b${k}\\b`, 'g');
          evalE = evalE.replace(reg, JSON.stringify(mergedScope[k]));
        });
        const res = Function(`"use strict"; return (${evalE})`)();
        return res !== undefined ? res : p;
      } catch {
        return mergedScope[p] !== undefined ? mergedScope[p] : p;
      }
    });

    return { text: resultParts.join(' '), endParam };
  }

  let idx = 0;
  while (idx < lines.length) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      idx++;
      continue;
    }

    // Augmented Assignment (+=, -=, *=, /=)
    const augMatch = line.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
    if (augMatch) {
      const varName = augMatch[1];
      const op = augMatch[2];
      const valExpr = augMatch[3].trim();
      const currentVal = scope[varName] !== undefined ? scope[varName] : 0;
      try {
        let evalE = valExpr;
        Object.keys(scope).forEach(k => {
          const reg = new RegExp(`\\b${k}\\b`, 'g');
          evalE = evalE.replace(reg, JSON.stringify(scope[k]));
        });
        const rVal = Function(`"use strict"; return (${evalE})`)();
        if (op === '+=') scope[varName] = (typeof currentVal === 'number') ? currentVal + rVal : currentVal + String(rVal);
        else if (op === '-=') scope[varName] = currentVal - rVal;
        else if (op === '*=') scope[varName] = currentVal * rVal;
        else if (op === '/=') scope[varName] = currentVal / rVal;
      } catch {
        // ignore
      }
      idx++;
      continue;
    }

    // Direct Assignment (var = val)
    const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const valExpr = assignMatch[2].trim();
      try {
        if (valExpr === 'True') scope[varName] = true;
        else if (valExpr === 'False') scope[varName] = false;
        else if (valExpr.startsWith('[') && valExpr.endsWith(']')) {
          const items = valExpr.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          scope[varName] = items;
        } else {
          let evalE = valExpr;
          Object.keys(scope).forEach(k => {
            const reg = new RegExp(`\\b${k}\\b`, 'g');
            evalE = evalE.replace(reg, JSON.stringify(scope[k]));
          });
          scope[varName] = Function(`"use strict"; return (${evalE})`)();
        }
      } catch {
        scope[varName] = valExpr.replace(/^['"]|['"]$/g, '');
      }
      idx++;
      continue;
    }

    // For Loop Header
    const forRangeMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((?:(\d+),\s*)?(\d+)\):/);
    const forListMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*):/);

    if (forRangeMatch || forListMatch) {
      const loopVar = forRangeMatch ? forRangeMatch[1] : forListMatch[1];
      let iterations = [];
      if (forRangeMatch) {
        const startVal = forRangeMatch[2] ? parseInt(forRangeMatch[2], 10) : 0;
        const endVal = parseInt(forRangeMatch[3], 10);
        for (let i = startVal; i < endVal; i++) iterations.push(i);
      } else {
        const listVar = forListMatch[2];
        const listItems = scope[listVar] || ['item1', 'item2'];
        iterations = Array.isArray(listItems) ? listItems : [listItems];
      }

      // Collect all indented body lines
      const bodyLines = [];
      let nextIdx = idx + 1;
      while (nextIdx < lines.length) {
        const nLine = lines[nextIdx];
        if (!nLine.trim() || nLine.trim().startsWith('#')) {
          nextIdx++;
          continue;
        }
        if (nLine.startsWith(' ') || nLine.startsWith('\t')) {
          bodyLines.push(nLine);
          nextIdx++;
        } else {
          break;
        }
      }

      for (const val of iterations) {
        const localScope = { [loopVar]: val };

        for (let bIdx = 0; bIdx < bodyLines.length; bIdx++) {
          const bLine = bodyLines[bIdx].trim();

          const nestedForMatch = bLine.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((?:(\d+),\s*)?(\d+)\):/);
          if (nestedForMatch) {
            const nestedVar = nestedForMatch[1];
            const nStart = nestedForMatch[2] ? parseInt(nestedForMatch[2], 10) : 0;
            const nEnd = parseInt(nestedForMatch[3], 10);

            if (bIdx + 1 < bodyLines.length && bodyLines[bIdx + 1].trim().startsWith('print(')) {
              const innerPrintLine = bodyLines[bIdx + 1].trim();
              const pMatch = innerPrintLine.match(/^print\((.*)\)$/);
              if (pMatch) {
                for (let nVal = nStart; nVal < nEnd; nVal++) {
                  const res = evalExpr(pMatch[1], { ...localScope, [nestedVar]: nVal });
                  if (res.endParam !== null) {
                    appendText(res.text + res.endParam);
                  } else {
                    pushLine(res.text);
                  }
                }
              }
              bIdx++;
            }
            continue;
          }

          if (bLine === 'print()') {
            pushLine('');
            continue;
          }

          const printMatch = bLine.match(/^print\((.*)\)$/);
          if (printMatch) {
            const res = evalExpr(printMatch[1], localScope);
            if (res.endParam !== null) {
              appendText(res.text + res.endParam);
            } else {
              pushLine(res.text);
            }
          }
        }
      }

      idx = nextIdx;
      continue;
    }

    // While Loop Header
    const whileMatch = line.match(/^while\s+([a-zA-Z_]\w*)\s*(<=|<|>=|>|==|!=)\s*(.+):/);
    if (whileMatch) {
      const varName = whileMatch[1];
      const op = whileMatch[2];
      const targetValExpr = whileMatch[3].trim();

      const bodyLines = [];
      let nextIdx = idx + 1;
      while (nextIdx < lines.length) {
        const nLine = lines[nextIdx];
        if (!nLine.trim() || nLine.trim().startsWith('#')) {
          nextIdx++;
          continue;
        }
        if (nLine.startsWith(' ') || nLine.startsWith('\t')) {
          bodyLines.push(nLine);
          nextIdx++;
        } else {
          break;
        }
      }

      let safetyGuard = 0;
      while (safetyGuard < 100) {
        safetyGuard++;
        const curVarVal = scope[varName] !== undefined ? scope[varName] : 0;
        let limitVal = parseInt(targetValExpr, 10);
        if (isNaN(limitVal)) limitVal = scope[targetValExpr] !== undefined ? scope[targetValExpr] : 0;

        let cond = false;
        if (op === '<=') cond = curVarVal <= limitVal;
        else if (op === '<') cond = curVarVal < limitVal;
        else if (op === '>=') cond = curVarVal >= limitVal;
        else if (op === '>') cond = curVarVal > limitVal;
        else if (op === '==') cond = curVarVal === limitVal;
        else if (op === '!=') cond = curVarVal !== limitVal;

        if (!cond) break;

        for (const bLineRaw of bodyLines) {
          const bLine = bLineRaw.trim();
          const augM = bLine.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
          if (augM) {
            const vN = augM[1];
            const oP = augM[2];
            const valE = augM[3].trim();
            const cV = scope[vN] !== undefined ? scope[vN] : 0;
            const rV = parseInt(valE, 10) || scope[valE] || 1;
            if (oP === '+=') scope[vN] = cV + rV;
            else if (oP === '-=') scope[vN] = cV - rV;
          } else {
            const printMatch = bLine.match(/^print\((.*)\)$/);
            if (printMatch) {
              const res = evalExpr(printMatch[1], scope);
              if (res.endParam !== null) {
                appendText(res.text + res.endParam);
              } else {
                pushLine(res.text);
              }
            }
          }
        }
      }

      idx = nextIdx;
      continue;
    }

    if (line === 'print()') {
      pushLine('');
      idx++;
      continue;
    }

    const printMatch = line.match(/^print\((.*)\)$/);
    if (printMatch) {
      const res = evalExpr(printMatch[1], scope);
      if (res.endParam !== null) {
        appendText(res.text + res.endParam);
      } else {
        pushLine(res.text);
      }
      idx++;
      continue;
    }

    idx++;
  }

  if (currentOutputLine) {
    outputs.push(currentOutputLine);
  }

  return outputs.length > 0 ? outputs : ['Program executed successfully.'];
}


// C Output Evaluator Engine
function evaluateCOutput(cCode) {
  const outputs = [];
  if (!cCode || !cCode.trim()) return ['[GCC] Compiled main.c successfully. Exit code: 0'];

  const lines = cCode.split('\n');
  for (let line of lines) {
    line = line.trim();
    const printfMatch = line.match(/printf\s*\(\s*"([^"]+)"(?:\s*,\s*(.+))?\s*\)\s*;/);
    if (printfMatch) {
      let fmtStr = printfMatch[1];
      fmtStr = fmtStr.replace(/\\n/g, '').replace(/\\t/g, '  ');
      outputs.push(fmtStr);
    }
  }
  return outputs.length > 0 ? outputs : ['Hello, C World!'];
}

// C++ Output Evaluator Engine
function evaluateCppOutput(cppCode) {
  const outputs = [];
  if (!cppCode || !cppCode.trim()) return ['[G++] Compiled main.cpp successfully. Exit code: 0'];

  const lines = cppCode.split('\n');
  for (let line of lines) {
    line = line.trim();
    const coutMatch = line.match(/cout\s*<<\s*([^;]+);/);
    if (coutMatch) {
      let exprStr = coutMatch[1];
      const parts = exprStr.split('<<').map(s => s.trim());
      let lineOut = '';
      for (let part of parts) {
        if (part === 'endl' || part === 'std::endl') continue;
        if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
          lineOut += part.slice(1, -1);
        } else if (!isNaN(part)) {
          lineOut += part;
        } else {
          lineOut += `[${part}]`;
        }
      }
      if (lineOut) outputs.push(lineOut);
    }
  }
  return outputs.length > 0 ? outputs : ['Hello, C++ World!'];
}

class TeachingEngine {
  constructor() {
    this.timer = null;
    this.isExecutingStep = false;
  }

  start(lesson) {
    const store = useStudioStore.getState();
    store.setIsPlaying(true);
    store.setIsPaused(false);
    store.setCurrentStepIndex(0);
    store.setLessonTitle(lesson.title);
    store.setIsCursorVisible(true);
    store.setCursorPosition({ x: window.innerWidth / 2, y: 120 });
    store.clearConsoleLogs();
    store.clearTerminalLogs();

    if (lesson.environment) {
      store.setEnvironment(lesson.environment);
    }

    // Reset workspace files to clean empty state for fresh scratch lesson!
    const env = lesson.environment || store.environment;
    if (env === 'PYTHON_BASIC') {
      store.setAllFiles({ 'main.py': '' });
      store.setActiveFile('main.py');
    } else if (env === 'C_BASIC') {
      store.setAllFiles({ 'main.c': '' });
      store.setActiveFile('main.c');
    } else if (env === 'CPP_BASIC') {
      store.setAllFiles({ 'main.cpp': '' });
      store.setActiveFile('main.cpp');
    } else {
      store.setAllFiles({
        'index.html': '',
        'style.css': '',
        'script.js': ''
      });
      store.setActiveFile('index.html');
    }

    // Show initial warm-up speech balloon so student can orient themselves before playback begins
    store.setFlappySpeech(`Lesson Roadmap Loaded: ${lesson.title}. Initializing...`, 'idle');

    if (this.timer) clearTimeout(this.timer);
    // 1.8 second orientation pause for student prep before step 1 speech starts
    this.timer = setTimeout(() => {
      if (!useStudioStore.getState().isPaused && useStudioStore.getState().isPlaying) {
        this.executeCurrentStep(lesson);
      }
    }, 1800);
  }

  pause() {
    const store = useStudioStore.getState();
    store.setIsPaused(true);
    aiAudioService.stopCurrentSpeech();
    if (this.timer) clearTimeout(this.timer);
  }

  resume(lesson) {
    const store = useStudioStore.getState();
    store.setIsPaused(false);
    this.executeCurrentStep(lesson);
  }

  stop() {
    const store = useStudioStore.getState();
    store.setIsPlaying(false);
    store.setIsPaused(false);
    store.setCurrentStepIndex(0);
    store.setIsCursorVisible(false);
    store.setFlappySpeech('Session ended. Click play to restart or generate a new lesson.', 'idle');
    aiAudioService.stopCurrentSpeech();
    if (this.timer) clearTimeout(this.timer);

    if (recorderInstance.isRecording) {
      recorderInstance.stopRecording(store.lessonTitle);
      store.setIsRecording(false);
    }
  }

  async executeCurrentStep(lesson) {
    const store = useStudioStore.getState();
    const { currentStepIndex, isPlaying, isPaused } = store;

    if (!isPlaying || isPaused) return;

    if (currentStepIndex >= lesson.steps.length) {
      this.stop();
      return;
    }

    const step = lesson.steps[currentStepIndex];
    this.isExecutingStep = true;

    try {
      await this.processAction(step);
    } catch (err) {
      console.error('Action execution error:', err);
    }

    if (!useStudioStore.getState().isPaused && useStudioStore.getState().isPlaying) {
      const nextIndex = currentStepIndex + 1;
      store.setCurrentStepIndex(nextIndex);
      if (nextIndex < lesson.steps.length) {
        this.timer = setTimeout(() => this.executeCurrentStep(lesson), 1600);
      } else {
        store.setFlappySpeech('Lesson completed successfully!', 'idle');
        store.setIsPlaying(false);
        store.setIsCursorVisible(false);

        if (recorderInstance.isRecording) {
          recorderInstance.stopRecording(lesson.title);
          store.setIsRecording(false);
        }
      }
    }
  }

  async processAction(step) {
    const store = useStudioStore.getState();
    const targetFile = step.file || store.activeFile || 'index.html';

    switch (step.type) {
      case 'speak':
      case 'explain':
      case 'conclude':
        store.setFlappySpeech(step.text || 'Phlappy AI Teacher explaining concept...', 'speaking');
        await this.delay(400); // Gentle prep delay before audio speech starts
        await this.speakSpeech(step.text || '');
        await this.delay(800); // Comfortable pause after speech finishes
        break;

      case 'open_file':
        store.setCursorPosition({ x: 120, y: 180 });
        await this.delay(500);
        store.triggerCursorClick();

        if (store.files[targetFile] === undefined) {
          store.addFile(targetFile, '');
        }
        store.setActiveFile(targetFile);
        await this.delay(400);
        break;

      case 'create_file':
        store.setCursorPosition({ x: 180, y: 150 });
        await this.delay(500);
        store.triggerCursorClick();

        if (step.file && store.files[step.file] === undefined) {
          store.addFile(step.file, '');
        }
        if (step.file) {
          store.setActiveFile(step.file);
        }
        await this.delay(400);
        break;

      case 'write_code':
        store.clearConsoleLogs();
        if (store.files[targetFile] === undefined) {
          store.addFile(targetFile, '');
        }
        if (store.activeFile !== targetFile) {
          store.setCursorPosition({ x: 120, y: 180 });
          await this.delay(400);
          store.triggerCursorClick();
          store.setActiveFile(targetFile);
        }

        store.setCursorPosition({ x: 460, y: 240 });
        await this.delay(500);
        store.triggerCursorClick();

        if (step.text) {
          store.setFlappySpeech(step.text, 'speaking');
        }

        await this.typeCodeIntoFile(targetFile, step.code || '');

        // AUTO-DISPLAY OUTPUT RIGHT AFTER EXAMPLE CODE WRITING
        await this.delay(400);
        const currentEnv = store.environment;
        const codeText = step.code || '';
        if (currentEnv === 'PYTHON_BASIC' || currentEnv === 'C_BASIC' || currentEnv === 'CPP_BASIC') {
          store.setActiveRightTab('terminal');
          store.clearTerminalLogs();
          if (currentEnv === 'C_BASIC') {
            store.addTerminalLog(`$ gcc main.c -o main && ./main`);
            store.addTerminalLog(`[GCC 13.2 Output]:`);
            const cOuts = evaluateCOutput(store.files['main.c'] || codeText);
            for (const outLine of cOuts) {
              store.addTerminalLog(`> ${outLine}`);
              await this.delay(200);
            }
          } else if (currentEnv === 'CPP_BASIC') {
            store.addTerminalLog(`$ g++ main.cpp -o main && ./main`);
            store.addTerminalLog(`[G++ 13.2 Output]:`);
            const cppOuts = evaluateCppOutput(store.files['main.cpp'] || codeText);
            for (const outLine of cppOuts) {
              store.addTerminalLog(`> ${outLine}`);
              await this.delay(200);
            }
          } else {
            store.addTerminalLog(`$ python ${targetFile}`);
            store.addTerminalLog(`[Python 3.11 Output]:`);
            const pyOuts = evaluatePythonOutput(store.files['main.py'] || codeText);
            for (const outLine of pyOuts) {
              store.addTerminalLog(`> ${outLine}`);
              await this.delay(200);
            }
          }
        } else {
          if (codeText.includes('console.log') || codeText.includes('console.warn') || codeText.includes('console.error')) {
            store.setActiveRightTab('console');
          } else {
            store.setActiveRightTab('preview');
          }
        }
        // Observation pause after showing output
        await this.delay(1800);
        break;

      case 'show_preview':
        store.setCursorPosition({ x: 800, y: 165 });
        await this.delay(500);
        store.triggerCursorClick();
        store.setActiveRightTab('preview');
        if (step.text) {
          store.setFlappySpeech(step.text, 'speaking');
          await this.speakSpeech(step.text);
        }
        await this.delay(1800);
        break;

      case 'show_console':
        store.setCursorPosition({ x: 920, y: 165 });
        await this.delay(500);
        store.triggerCursorClick();
        store.clearConsoleLogs();
        store.setActiveRightTab('console');
        if (step.text) {
          store.setFlappySpeech(step.text, 'speaking');
          await this.speakSpeech(step.text);
        }
        await this.delay(1800);
        break;

      case 'show_terminal':
        store.setCursorPosition({ x: 1040, y: 165 });
        await this.delay(500);
        store.triggerCursorClick();
        store.setActiveRightTab('terminal');
        if (step.text) {
          store.setFlappySpeech(step.text, 'speaking');
          await this.speakSpeech(step.text);
        }
        await this.delay(1800);
        break;

      case 'click_element':
        store.setActiveRightTab('preview');
        store.setCursorPosition({ x: 920, y: 280 });
        await this.delay(700);
        store.triggerCursorClick();

        const iframe = document.querySelector('#sandbox-preview-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            { type: 'TRIGGER_CLICK', selector: step.selector || '#demoButton' },
            '*'
          );
        }
        await this.delay(1500);
        break;

      case 'run_code':
        store.setCursorPosition({ x: 1040, y: 165 });
        await this.delay(500);
        store.triggerCursorClick();
        store.setActiveRightTab('terminal');
        store.clearTerminalLogs();

        const runEnv = store.environment;
        if (runEnv === 'C_BASIC') {
          store.addTerminalLog(`$ gcc main.c -o main && ./main`);
          store.addTerminalLog(`[GCC 13.2 C Execution Output]:`);
          await this.delay(400);

          const cCode = store.files['main.c'] || store.files[store.activeFile] || '';
          const evaluatedCOutputs = evaluateCOutput(cCode);
          for (const outLine of evaluatedCOutputs) {
            store.addTerminalLog(`> ${outLine}`);
            await this.delay(300);
          }
        } else if (runEnv === 'CPP_BASIC') {
          store.addTerminalLog(`$ g++ main.cpp -o main && ./main`);
          store.addTerminalLog(`[G++ 13.2 C++ Execution Output]:`);
          await this.delay(400);

          const cppCode = store.files['main.cpp'] || store.files[store.activeFile] || '';
          const evaluatedCppOutputs = evaluateCppOutput(cppCode);
          for (const outLine of evaluatedCppOutputs) {
            store.addTerminalLog(`> ${outLine}`);
            await this.delay(300);
          }
        } else {
          store.addTerminalLog(`$ python ${store.activeFile || 'main.py'}`);
          store.addTerminalLog(`[Python 3.11 Execution Output]:`);
          await this.delay(400);

          const pyCode = store.files['main.py'] || store.files[store.activeFile] || '';
          const evaluatedOutputs = evaluatePythonOutput(pyCode);

          for (const outLine of evaluatedOutputs) {
            store.addTerminalLog(`> ${outLine}`);
            await this.delay(300);
          }
        }

        if (step.text) {
          store.setFlappySpeech(step.text, 'speaking');
          await this.speakSpeech(step.text);
        }

        await this.delay(2000);
        break;

      case 'wait':
        await this.delay(step.duration || 1000);
        break;

      default:
        console.log('Unhandled step type:', step.type);
        break;
    }
  }

  // Type code from scratch into target file
  async typeCodeIntoFile(file, newCodeSnippet) {
    const store = useStudioStore.getState();
    const typingSpeed = store.typingSpeed || 'realistic';
    const existingContent = store.files[file] || '';

    let fullCodeToType = newCodeSnippet;
    if (existingContent.trim() && !existingContent.includes(newCodeSnippet.trim())) {
      fullCodeToType = existingContent + '\n\n' + newCodeSnippet;
    }

    const chars = newCodeSnippet.split('');
    let current = existingContent ? existingContent + '\n\n' : '';

    if (typingSpeed === 'fast') {
      const chunkSize = 4;
      for (let i = 0; i < chars.length; i += chunkSize) {
        if (useStudioStore.getState().isPaused) break;
        current += chars.slice(i, i + chunkSize).join('');
        store.updateFileContent(file, current);
        await this.delay(20);
      }
      store.updateFileContent(file, fullCodeToType);
      return;
    }

    for (let i = 0; i < chars.length; i++) {
      if (useStudioStore.getState().isPaused) break;

      const char = chars[i];
      current += char;
      store.updateFileContent(file, current);

      let delayTime = typingSpeed === 'medium' ? 25 : 45;

      if (char === '\n') {
        delayTime = typingSpeed === 'medium' ? 120 : 250;
      } else if (char === ';' || char === '{' || char === '}' || char === '>') {
        delayTime = typingSpeed === 'medium' ? 80 : 160;
      } else if (char === ' ') {
        delayTime = typingSpeed === 'medium' ? 15 : 30;
      }

      await this.delay(delayTime);
    }

    store.updateFileContent(file, fullCodeToType);
  }

  async speakSpeech(rawText) {
    if (!rawText || rawText.trim() === '') return;
    await aiAudioService.playSpeech(rawText, () => useStudioStore.getState().isPaused);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const engineInstance = new TeachingEngine();
