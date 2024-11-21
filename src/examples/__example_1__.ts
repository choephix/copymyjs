import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

console.log('example1');

export default function example1(container: HTMLElement) {
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
