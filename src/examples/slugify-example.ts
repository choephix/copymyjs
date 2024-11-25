import { slugify } from '@/snippets/string-slugify';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-4">
      <div class="space-y-2">
        <input type="text" id="input" 
          class="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          value="Hello World! This is a Test"
          placeholder="Type something..."
        />
        <p class="text-gray-400 text-sm">Type above to see the slugified version</p>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Slug:</p>
        <p id="result" class="font-mono text-green-400">hello-world-this-is-a-test</p>
      </div>
    </div>
  `);

  const input = builder.container.querySelector('#input')!;
  const result = builder.container.querySelector('#result')!;

  input.addEventListener('input', e => {
    const value = (e.target as HTMLInputElement).value;
    const slugified = slugify(value);
    result.textContent = slugified;
    logger.log(`Slugified "${value}" to "${slugified}"`);
  });
}