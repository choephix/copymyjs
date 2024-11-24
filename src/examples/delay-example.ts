import { delayMs } from '@/snippets/async-delay';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-4">
      <div class="flex gap-4">
        <button id="start" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Start Countdown
        </button>
        <div id="status" class="py-2 text-gray-400">Click to start</div>
      </div>
    </div>
  `);

  const statusEl = builder.container.querySelector('#status')!;
  const buttonEl = builder.container.querySelector('#start')!;

  async function runDemo() {
    if (buttonEl.hasAttribute('disabled')) return;

    buttonEl.setAttribute('disabled', 'true');
    statusEl.textContent = 'Starting...';
    logger.log('Starting countdown');

    for (let i = 3; i >= 1; i--) {
      await delayMs(1000);
      statusEl.textContent = `${i}...`;
      logger.log(`Countdown: ${i}`);
    }

    await delayMs(1000);
    statusEl.textContent = 'Done!';
    buttonEl.removeAttribute('disabled');
    logger.log('Countdown complete');
  }

  buttonEl.addEventListener('click', runDemo);
}
