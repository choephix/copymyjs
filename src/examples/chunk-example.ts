import { chunk } from '@/snippets/array-chunk';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;
  
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const result = chunk(numbers, 3);
  
  builder.addHtml(`
    <div class="space-y-4">
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Original array:</p>
        <p class="font-mono text-blue-400">[${numbers.join(', ')}]</p>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Chunked array (size: <span id="size">3</span>):</p>
        <p class="font-mono text-green-400">${result.map(chunk => `[${chunk.join(', ')}]`).join(' ')}</p>
      </div>
      
      <button id="rechunk" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Try different size
      </button>
    </div>
  `);

  let currentSize = 3;
  const sizeElement = builder.container.querySelector('#size')!;
  const resultElement = builder.container.querySelector('.text-green-400')!;
  
  builder.container.querySelector('#rechunk')?.addEventListener('click', () => {
    currentSize = currentSize === 3 ? 2 : 3;
    const newResult = chunk(numbers, currentSize);
    sizeElement.textContent = String(currentSize);
    resultElement.textContent = newResult.map(chunk => `[${chunk.join(', ')}]`).join(' ');
    logger.log(`Changed chunk size to ${currentSize}`);
  });
}
