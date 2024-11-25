import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

console.log('example1');

export function example1(container: HTMLElement) {
  console.log(container);

  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="flex gap-4 items-center">
      <button id="colorBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Change Color
      </button>
      <div id="box" class="w-16 h-16 bg-blue-500 transition-colors duration-500"></div>
    </div>
  `);

  const colors = ['blue', 'red', 'green', 'purple', 'orange'];
  let currentIndex = 0;

  const box = builder.container.querySelector('#box')!;
  const btn = builder.container.querySelector('#colorBtn')!;

  btn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % colors.length;
    const newColor = colors[currentIndex];
    box.className = `w-16 h-16 bg-${newColor}-500 transition-colors duration-500`;
    logger.log(`Changed color to ${newColor}`);
  });

  console.log(logger);
}

export function example2(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="flex gap-4 items-center">
      <button id="typeBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Type Message
      </button>
      <div id="output" class="font-mono text-lg"></div>
    </div>
  `);

  const message = 'Hello, TypeScript!';
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

export function example3(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="flex gap-4 items-center">
      <button id="bounceBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Bounce!
      </button>
      <div id="ball" class="w-8 h-8 bg-red-500 rounded-full transform translate-y-0 transition-transform duration-300"></div>
    </div>
  `);

  const ball = builder.container.querySelector('#ball')!;
  const btn = builder.container.querySelector('#bounceBtn')!;
  let isAnimating = false;

  async function bounce() {
    if (isAnimating) return;
    isAnimating = true;
    logger.log('Starting bounce animation');

    const positions = ['-translate-y-16', 'translate-y-0'];

    for (let i = 0; i < 6; i++) {
      ball.className = `w-8 h-8 bg-red-500 rounded-full transform ${
        positions[i % 2]
      } transition-transform duration-300`;
      await new Promise(r => setTimeout(r, 300));
    }

    isAnimating = false;
    logger.log('Bounce animation complete');
  }

  btn.addEventListener('click', bounce);
}

export function example0(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="flex flex-col gap-4">
      <div class="flex gap-4 flex-wrap">
        <button id="logBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Log Random Message
        </button>
        <button id="addItemBtn" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
          Add List Item
        </button>
      </div>
      <ul id="itemList" class="list-disc pl-6 space-y-2">
        <li>Initial list item</li>
      </ul>
    </div>
  `);

  const logBtn = builder.container.querySelector('#logBtn')!;
  const addItemBtn = builder.container.querySelector('#addItemBtn')!;
  const itemList = builder.container.querySelector('#itemList')!;
  let itemCount = 1;

  const randomMessages = [
    "Hey, I'm a log message!",
    "Look at me, I'm testing the logger!",
    "The log bar should handle this just fine",
    "Responsiveness test in progress...",
    "How's that layout looking?",
  ];

  logBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    logger.log(randomMessages[randomIndex]);
  });

  addItemBtn.addEventListener('click', () => {
    itemCount++;
    const li = document.createElement('li');
    li.textContent = `Dynamically added item ${itemCount}`;
    itemList.appendChild(li);
    logger.log(`Added item ${itemCount}`);
  });
}
