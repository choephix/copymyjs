import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export function example2(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const logger = builder.addLogger();
  
  builder.addHtml(`
    <div class="flex gap-4 items-center">
      <button id="typeBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Type Message
      </button>
      <div id="output" class="font-mono text-lg"></div>
    </div>
  `);

  const message = "Hello, TypeScript!";
  let isTyping = false;
  
  const output = builder.container.querySelector('#output')!;
  const btn = builder.container.querySelector('#typeBtn')!;
  
  async function typeMessage() {
    if (isTyping) return;
    isTyping = true;
    output.textContent = '';
    logger.log('Started typing...');
    
    for (const char of message) {
      output.textContent += char;
      await new Promise(r => setTimeout(r, 100));
    }
    
    isTyping = false;
    logger.log('Finished typing!');
  }
  
  btn.addEventListener('click', typeMessage);
}
