import { createCachedPromise } from '@/snippets/cached-promise/createCachedPromise';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';
import { createResettableCachedPromise } from '@/snippets/cached-promise/createResettableCachedPromise';
import { delaySeconds } from '@/snippets/async-delay/delaySeconds';

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-6">
      <!-- Simple Cache -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Simple Cache</h3>
        <div class="flex gap-4">
          <button id="loadSimple" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Load Data
          </button>
        </div>
        <div id="simpleResult" class="font-mono text-green-400"></div>
      </div>

      <!-- Resettable Cache -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Resettable Cache</h3>
        <div class="flex gap-4">
          <button id="loadResettable" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Load Data
          </button>
          <button id="reset" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Clear Cache
          </button>
        </div>
        <div id="resettableResult" class="font-mono text-green-400"></div>
      </div>
    </div>
  `);

  // Simple cache example
  const loadData = createCachedPromise(async () => {
    logger.log('Starting data load...');
    await delaySeconds(1);
    return `Data loaded at ${new Date().toLocaleTimeString()}`;
  });

  builder.container.querySelector('#loadSimple')?.addEventListener('click', async () => {
    const resultEl = builder.container.querySelector('#simpleResult')!;
    resultEl.textContent = 'Loading...';
    
    const result = await loadData();
    resultEl.textContent = result;
    logger.log('Simple load complete');
  });

  // Resettable cache example
  const loadResettableData = createResettableCachedPromise(async () => {
    logger.log('Starting resettable data load...');
    await delaySeconds(1);
    return `Data loaded at ${new Date().toLocaleTimeString()}`;
  });

  builder.container.querySelector('#loadResettable')?.addEventListener('click', async () => {
    const resultEl = builder.container.querySelector('#resettableResult')!;
    resultEl.textContent = 'Loading...';
    
    const result = await loadResettableData.execute();
    resultEl.textContent = result;
    logger.log('Resettable load complete');
  });

  builder.container.querySelector('#reset')?.addEventListener('click', () => {
    loadResettableData.reset();
    logger.log('Cache cleared');
  });
}
