import { delayMilliseconds } from '@/snippets/async-delay/delayMilliseconds';
import { delaySeconds } from '@/snippets/async-delay/delaySeconds';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export async function delayExample(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  
  builder.addHtml(`
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <button id="milliBtn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Delay 1s (milliseconds)
        </button>
        <span id="milliStatus" class="text-gray-600"></span>
      </div>
      <div class="flex items-center gap-2">
        <button id="secBtn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Delay 2s (seconds)
        </button>
        <span id="secStatus" class="text-gray-600"></span>
      </div>
    </div>
  `);

  const milliBtn = container.querySelector('#milliBtn') as HTMLButtonElement;
  const milliStatus = container.querySelector('#milliStatus') as HTMLSpanElement;
  const secBtn = container.querySelector('#secBtn') as HTMLButtonElement;
  const secStatus = container.querySelector('#secStatus') as HTMLSpanElement;

  milliBtn.addEventListener('click', async () => {
    milliStatus.textContent = '⏳ Waiting...';
    builder.logger.log('🕒 Starting 1000ms delay...');
    
    await delayMilliseconds(1000);
    
    milliStatus.textContent = '✅ Done!';
    builder.logger.log('✨ 1000ms delay completed!');
  });

  secBtn.addEventListener('click', async () => {
    secStatus.textContent = '⏳ Waiting...';
    builder.logger.log('🕒 Starting 2 second delay...');
    
    await delaySeconds(2);
    
    secStatus.textContent = '✅ Done!';
    builder.logger.log('✨ 2 second delay completed!');
  });
} 