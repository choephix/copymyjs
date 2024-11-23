import { createCustomAwaitable } from '@/snippets/custom-awaitable';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex gap-4">
          <button id="start" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Start Operation
          </button>
          <button id="resolve" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" disabled>
            Resolve
          </button>
          <button id="reject" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" disabled>
            Reject
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Status:</p>
        <div id="status" class="font-mono text-blue-400">Ready to start</div>
      </div>
    </div>
  `);

  const startBtn = builder.container.querySelector('#start') as HTMLButtonElement;
  const resolveBtn = builder.container.querySelector('#resolve') as HTMLButtonElement;
  const rejectBtn = builder.container.querySelector('#reject') as HTMLButtonElement;
  const statusEl = builder.container.querySelector('#status')!;

  let currentAwaitable: ReturnType<typeof createCustomAwaitable<string>> | null = null;

  async function startOperation() {
    if (currentAwaitable) return;

    startBtn.disabled = true;
    resolveBtn.disabled = false;
    rejectBtn.disabled = false;
    statusEl.textContent = 'Operation pending...';
    statusEl.className = 'font-mono text-yellow-400';
    
    currentAwaitable = createCustomAwaitable<string>();
    logger.log('Operation started');

    try {
      const result = await currentAwaitable;
      statusEl.textContent = `Operation completed: ${result}`;
      statusEl.className = 'font-mono text-green-400';
      logger.log(`Operation completed: ${result}`);
    } catch (error) {
      statusEl.textContent = `Operation failed: ${error}`;
      statusEl.className = 'font-mono text-red-400';
      logger.log(`Operation failed: ${error}`);
    }

    currentAwaitable = null;
    startBtn.disabled = false;
    resolveBtn.disabled = true;
    rejectBtn.disabled = true;
  }

  startBtn.addEventListener('click', startOperation);

  resolveBtn.addEventListener('click', () => {
    if (currentAwaitable) {
      currentAwaitable.resolve('Success!');
    }
  });

  rejectBtn.addEventListener('click', () => {
    if (currentAwaitable) {
      currentAwaitable.reject('Operation cancelled');
    }
  });
} 
