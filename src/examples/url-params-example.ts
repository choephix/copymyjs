import { createUrlParamsProxy } from '@/snippets/url-params-proxy';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;
  
  builder.addHtml(`
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex gap-4">
          <input 
            type="text" 
            id="paramName"
            placeholder="Parameter name"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <input 
            type="text" 
            id="paramValue"
            placeholder="Parameter value"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button 
            id="setParam"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Set Parameter
          </button>
        </div>
        
        <div class="flex gap-4">
          <input 
            type="text" 
            id="deleteParamName"
            placeholder="Parameter to delete"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button 
            id="deleteParam"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete Parameter
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Current URL Parameters:</p>
        <pre id="output" class="font-mono text-sm text-green-400"></pre>
      </div>

      <div class="p-4 bg-gray-800/50 rounded text-sm text-gray-400">
        Note: Changes are reflected in the URL bar and persist across page refreshes
      </div>
    </div>
  `);

  // Create URL params proxy with some defaults
  const params = createUrlParamsProxy({
    theme: 'light',
    page: 1,
    filters: { active: true }
  });

  const updateOutput = () => {
    const output = builder.container.querySelector('#output')!;
    output.textContent = JSON.stringify(params, null, 2);
    logger.log('URL parameters updated');
  };

  // Initial output
  updateOutput();

  // Set parameter
  builder.container.querySelector('#setParam')?.addEventListener('click', () => {
    const nameInput = builder.container.querySelector('#paramName') as HTMLInputElement;
    const valueInput = builder.container.querySelector('#paramValue') as HTMLInputElement;
    
    const name = nameInput.value.trim();
    let value: any = valueInput.value.trim();

    if (!name) return;

    // Try to parse as JSON if it looks like an object or array
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
    // Try to parse as number
    else if (!isNaN(Number(value))) {
      value = Number(value);
    }
    // Parse booleans
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;

    (params as any)[name] = value;
    logger.log(`Set parameter ${name} = ${JSON.stringify(value)}`);
    updateOutput();

    // Clear inputs
    nameInput.value = '';
    valueInput.value = '';
  });

  // Delete parameter
  builder.container.querySelector('#deleteParam')?.addEventListener('click', () => {
    const input = builder.container.querySelector('#deleteParamName') as HTMLInputElement;
    const name = input.value.trim();

    if (!name) return;

    delete (params as any)[name];
    logger.log(`Deleted parameter ${name}`);
    updateOutput();

    // Clear input
    input.value = '';
  });
}
