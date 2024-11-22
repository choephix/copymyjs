import { MultipleReasons } from '@/snippets/many-reasons';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-6">
      <!-- Loading Example -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Loading State Example</h3>
        <div class="flex gap-4">
          <button id="loadData" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Load Data
          </button>
          <button id="loadImages" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Load Images
          </button>
        </div>
        <div id="loadingStatus" class="p-4 bg-gray-800 rounded">
          <div class="flex items-center gap-2">
            <div class="text-gray-300">Loading:</div>
            <div id="loadingIndicator" class="hidden">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          </div>
          <div id="loadingReasons" class="mt-2 text-sm text-gray-400"></div>
        </div>
      </div>

      <!-- Button State Example -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">Button State Example</h3>
        <div class="flex gap-4">
          <button id="toggleValidation" class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
            Toggle Validation Error
          </button>
          <button id="togglePermission" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Toggle Permission Error
          </button>
        </div>
        <div class="flex gap-4 items-center">
          <button id="submitButton" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Submit Form
          </button>
          <div id="submitReasons" class="text-sm text-gray-400"></div>
        </div>
      </div>
    </div>
  `);

  // Loading Example
  const loadingReasons = new MultipleReasons();
  const loadingIndicator =
    builder.container.querySelector('#loadingIndicator')!;
  const loadingReasonsEl = builder.container.querySelector('#loadingReasons')!;

  loadingReasons.on({
    change: hasReasons => {
      loadingIndicator.classList.toggle('hidden', !hasReasons);
      loadingReasonsEl.textContent = hasReasons
        ? `Current reasons: ${loadingReasons}`
        : 'No active loading operations';
      logger.log(
        hasReasons ? `Loading: ${loadingReasons}` : 'Loading complete'
      );
    },
  });

  builder.container
    .querySelector('#loadData')
    ?.addEventListener('click', async () => {
      const cleanup = loadingReasons.add('Loading data...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      cleanup();
    });

  builder.container
    .querySelector('#loadImages')
    ?.addEventListener('click', async () => {
      const cleanup = loadingReasons.add('Loading images...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      cleanup();
    });

  // Button State Example
  const submitReasons = new MultipleReasons();
  const submitButton = builder.container.querySelector(
    '#submitButton'
  ) as HTMLButtonElement;
  const submitReasonsEl = builder.container.querySelector('#submitReasons')!;

  let hasValidationError = false;
  let hasPermissionError = false;

  submitReasons.on({
    change: hasReasons => {
      submitButton.disabled = hasReasons;
      submitReasonsEl.textContent = hasReasons
        ? `Can't submit: ${submitReasons}`
        : 'Ready to submit';
      logger.log(
        hasReasons ? `Submit blocked: ${submitReasons}` : 'Submit enabled'
      );
    },
  });

  builder.container
    .querySelector('#toggleValidation')
    ?.addEventListener('click', () => {
      hasValidationError = !hasValidationError;
      submitReasons.set('Validation error', hasValidationError);
    });

  builder.container
    .querySelector('#togglePermission')
    ?.addEventListener('click', () => {
      hasPermissionError = !hasPermissionError;
      submitReasons.set('Permission denied', hasPermissionError);
    });

  submitButton.addEventListener('click', () => {
    if (!submitReasons.hasAny()) {
      logger.log('Form submitted successfully!');
      alert('Form submitted successfully!');
    }
  });
}
