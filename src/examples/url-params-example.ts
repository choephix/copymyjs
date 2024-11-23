import { createUrlParamsProxy } from '@/snippets/url-params-proxy';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function (container: HTMLElement) {
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
            Set
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
            Delete
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Current URL Parameters:</p>
        <div id="output" class="font-mono text-sm space-y-1"></div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Default Values:</p>
        <div id="defaults" class="font-mono text-sm space-y-1"></div>
      </div>

      <div class="p-4 bg-gray-800/50 rounded text-sm text-gray-400">
        Note: Changes are reflected in the URL bar and persist across page refreshes
      </div>
    </div>
  `);

  // Create URL params proxy with some defaults
  const defaultParams = {
    theme: 'light',
    page: 1,
    filters: { active: true },
  };
  
  const params = createUrlParamsProxy(defaultParams);

  const updateOutput = () => {
    const output = builder.container.querySelector('#output')!;
    const defaults = builder.container.querySelector('#defaults')!;
    output.innerHTML = ''; // Clear existing content
    defaults.innerHTML = ''; // Clear existing defaults
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // First show parameters that are in our defaults (whether overridden or not)
    Object.entries(defaultParams).forEach(([key, defaultValue]) => {
      const row = document.createElement('div');
      const currentValue = (params as any)[key];
      const isFromUrl = urlParams.has(key);
      
      row.className = isFromUrl 
        ? 'flex items-center gap-2 text-yellow-400'
        : 'flex items-center gap-2 text-blue-400';
      
      const keySpan = document.createElement('span');
      keySpan.className = 'min-w-[100px]';
      keySpan.textContent = key;
      
      const separator = document.createElement('span');
      separator.textContent = ':';
      
      const valueSpan = document.createElement('span');
      valueSpan.textContent = JSON.stringify(currentValue);
      
      const typeAndSource = document.createElement('span');
      typeAndSource.className = 'ml-2 text-gray-500';
      typeAndSource.textContent = `// ${typeof currentValue}${
        currentValue && typeof currentValue === 'object' ? ` (${Array.isArray(currentValue) ? 'array' : 'object'})` : ''
      }, ${isFromUrl ? 'from URL' : 'from defaults'}`;
      
      row.appendChild(keySpan);
      row.appendChild(separator);
      row.appendChild(valueSpan);
      row.appendChild(typeAndSource);
      output.appendChild(row);
    });
    
    // Then show URL parameters that aren't in defaults
    Array.from(urlParams.entries()).forEach(([key, value]) => {
      if (!(key in defaultParams)) {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 text-gray-500';
        
        const keySpan = document.createElement('span');
        keySpan.className = 'min-w-[100px]';
        keySpan.textContent = key;
        
        const separator = document.createElement('span');
        separator.textContent = ':';
        
        const valueSpan = document.createElement('span');
        let parsedValue = value;
        try {
          parsedValue = JSON.parse(value);
        } catch {
          // Keep as string if parsing fails
        }
        valueSpan.textContent = JSON.stringify(parsedValue);
        
        const typeInfo = document.createElement('span');
        typeInfo.className = 'ml-2 text-gray-600';
        typeInfo.textContent = `// ${typeof parsedValue}`;
        
        row.appendChild(keySpan);
        row.appendChild(separator);
        row.appendChild(valueSpan);
        row.appendChild(typeInfo);
        output.appendChild(row);
      }
    });

    // Show default values
    Object.entries(defaultParams).forEach(([key, value]) => {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-2 text-blue-400';
      
      const keySpan = document.createElement('span');
      keySpan.className = 'min-w-[100px]';
      keySpan.textContent = key;
      
      const separator = document.createElement('span');
      separator.textContent = ':';
      
      const valueSpan = document.createElement('span');
      valueSpan.textContent = JSON.stringify(value);
      
      const typeInfo = document.createElement('span');
      typeInfo.className = 'ml-2 text-gray-500';
      typeInfo.textContent = `// ${typeof value}${
        value && typeof value === 'object' ? ` (${Array.isArray(value) ? 'array' : 'object'})` : ''
      }`;
      
      row.appendChild(keySpan);
      row.appendChild(separator);
      row.appendChild(valueSpan);
      row.appendChild(typeInfo);
      defaults.appendChild(row);
    });
    
    logger.log('URL parameters updated');
  };

  // Initial output
  updateOutput();

  // Set parameter
  builder.container
    .querySelector('#setParam')
    ?.addEventListener('click', () => {
      const nameInput = builder.container.querySelector(
        '#paramName'
      ) as HTMLInputElement;
      const valueInput = builder.container.querySelector(
        '#paramValue'
      ) as HTMLInputElement;

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
  builder.container
    .querySelector('#deleteParam')
    ?.addEventListener('click', () => {
      const input = builder.container.querySelector(
        '#deleteParamName'
      ) as HTMLInputElement;
      const name = input.value.trim();

      if (!name) return;

      delete (params as any)[name];
      logger.log(`Deleted parameter ${name}`);
      updateOutput();

      // Clear input
      input.value = '';
    });
}
