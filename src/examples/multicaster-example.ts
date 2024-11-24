import { createMulticaster } from '@/snippets/multicaster';
import { createSimpleMulticaster } from '@/snippets/simple-multicaster';
import { createOrderedMulticaster } from '@/snippets/ordered-multicaster';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-8">
      <!-- Priority-based Multicaster -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Priority-based Multicaster</h3>
        <div class="flex gap-4">
          <button id="emit1" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Emit Event
          </button>
          <button id="clear1" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Clear Subscribers
          </button>
        </div>
        <div id="output1" class="p-4 bg-gray-800 rounded font-mono text-sm"></div>
      </div>

      <!-- Simple Multicaster -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Simple Multicaster</h3>
        <div class="flex gap-4">
          <button id="emit2" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Emit Event
          </button>
          <button id="clear2" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Clear Subscribers
          </button>
        </div>
        <div id="output2" class="p-4 bg-gray-800 rounded font-mono text-sm"></div>
      </div>

      <!-- Ordered Multicaster -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Ordered Multicaster</h3>
        <div class="flex gap-4">
          <button id="emit3" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Emit Event
          </button>
          <button id="clear3" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Clear Subscribers
          </button>
        </div>
        <div id="output3" class="p-4 bg-gray-800 rounded font-mono text-sm"></div>
      </div>
    </div>
  `);

  // Priority-based Multicaster Demo
  const output1 = builder.container.querySelector('#output1')!;
  const multicaster1 = createMulticaster();

  multicaster1.sub(msg => {
    output1.innerHTML += `<div class="text-blue-400">Normal (0): ${msg}</div>`;
    logger.log(`Priority 0: ${msg}`);
  });

  multicaster1.sub(msg => {
    output1.innerHTML += `<div class="text-green-400">High (1): ${msg}</div>`;
    logger.log(`Priority 1: ${msg}`);
  }, 1);

  builder.container.querySelector('#emit1')?.addEventListener('click', () => {
    output1.innerHTML = '';
    multicaster1('Hello from priority multicaster!');
  });

  builder.container.querySelector('#clear1')?.addEventListener('click', () => {
    multicaster1.clear();
    output1.innerHTML =
      '<div class="text-gray-400">All subscribers cleared</div>';
    logger.log('Priority multicaster cleared');
  });

  // Simple Multicaster Demo
  const output2 = builder.container.querySelector('#output2')!;
  const multicaster2 = createSimpleMulticaster();

  multicaster2.sub(msg => {
    output2.innerHTML += `<div class="text-blue-400">First: ${msg}</div>`;
    logger.log(`Simple First: ${msg}`);
  });

  multicaster2.sub(msg => {
    output2.innerHTML += `<div class="text-green-400">Second: ${msg}</div>`;
    logger.log(`Simple Second: ${msg}`);
  });

  builder.container.querySelector('#emit2')?.addEventListener('click', () => {
    output2.innerHTML = '';
    multicaster2('Hello from simple multicaster!');
  });

  builder.container.querySelector('#clear2')?.addEventListener('click', () => {
    multicaster2.clear();
    output2.innerHTML =
      '<div class="text-gray-400">All subscribers cleared</div>';
    logger.log('Simple multicaster cleared');
  });

  // Ordered Multicaster Demo
  const output3 = builder.container.querySelector('#output3')!;
  const multicaster3 = createOrderedMulticaster();

  multicaster3.subBefore(msg => {
    output3.innerHTML += `<div class="text-yellow-400">Before: ${msg}</div>`;
    logger.log(`Before: ${msg}`);
  });

  multicaster3.sub(msg => {
    output3.innerHTML += `<div class="text-blue-400">Normal: ${msg}</div>`;
    logger.log(`Normal: ${msg}`);
  });

  multicaster3.subAfter(msg => {
    output3.innerHTML += `<div class="text-green-400">After: ${msg}</div>`;
    logger.log(`After: ${msg}`);
  });

  builder.container.querySelector('#emit3')?.addEventListener('click', () => {
    output3.innerHTML = '';
    multicaster3('Hello from ordered multicaster!');
  });

  builder.container.querySelector('#clear3')?.addEventListener('click', () => {
    multicaster3.clear();
    output3.innerHTML =
      '<div class="text-gray-400">All subscribers cleared</div>';
    logger.log('Ordered multicaster cleared');
  });
}
