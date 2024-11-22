import { clamp } from '@/snippets/number-clamp';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;
  
  builder.addHtml(`
    <div class="space-y-4">
      <div class="space-y-2">
        <input type="range" id="input" min="0" max="100" value="50"
          class="w-full"
        />
        <p class="text-gray-400 text-sm">Move the slider to see clamping in action</p>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Value clamped between 25 and 75:</p>
        <p id="result" class="font-mono text-green-400">50</p>
      </div>
    </div>
  `);

  const input = builder.container.querySelector('#input')!;
  const result = builder.container.querySelector('#result')!;

  input.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    const clamped = clamp(value, 25, 75);
    result.textContent = String(clamped);
    logger.log(`Clamped ${value} to ${clamped}`);
  });
}
