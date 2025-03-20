import { tryCatch } from '../snippets/trycatch/tryCatch';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export function tryCatchExample(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  
  builder.addHtml(`
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">TryCatch Examples</h3>
      <div class="space-y-2">
        <button id="successBtn" class="px-4 py-2 bg-green-500 text-white rounded">Test Success</button>
        <button id="errorBtn" class="px-4 py-2 bg-red-500 text-white rounded">Test Error</button>
      </div>
      <div id="result" class="p-4 border rounded"></div>
    </div>
  `);

  const resultDiv = container.querySelector('#result') as HTMLElement;
  const successBtn = container.querySelector('#successBtn') as HTMLButtonElement;
  const errorBtn = container.querySelector('#errorBtn') as HTMLButtonElement;

  const displayResult = (result: any) => {
    resultDiv.innerHTML = `
      <pre class="text-sm">${JSON.stringify(result, null, 2)}</pre>
    `;
  };

  successBtn.addEventListener('click', async () => {
    const result = await tryCatch(
      new Promise((resolve) => resolve('🎉 Success!'))
    );
    displayResult(result);
  });

  errorBtn.addEventListener('click', async () => {
    const result = await tryCatch(
      new Promise((_, reject) => reject(new Error('❌ Oops!')))
    );
    displayResult(result);
  });
} 