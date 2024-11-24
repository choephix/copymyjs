import { createPrefixedStorageProxy } from '@/snippets/storage/prefixed-storage';
import { createJsonStorageProxy } from '@/snippets/storage/json-storage';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export function example1(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  const storage = createPrefixedStorageProxy('demo:', {
    theme: 'light',
    count: 0,
    items: ['default']
  });

  builder.addHtml(`
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex gap-4">
          <input 
            type="text" 
            id="key"
            placeholder="Key"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <input 
            type="text" 
            id="value"
            placeholder="Value"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button id="set" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Set
          </button>
        </div>
        
        <div class="flex gap-4">
          <input 
            type="text" 
            id="getKey"
            placeholder="Key to get/delete"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button id="get" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Get
          </button>
          <button id="delete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Storage Contents:</p>
        <pre id="output" class="font-mono text-sm text-green-400"></pre>
      </div>
    </div>
  `);

  const updateOutput = () => {
    const output = builder.container.querySelector('#output')!;
    const contents: Record<string, any> = {};
    
    // Get all items with our prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('demo:')) {
        contents[key.replace('demo:', '')] = storage[key.replace('demo:', '')];
      }
    }
    
    output.textContent = JSON.stringify(contents, null, 2);
  };

  builder.container.querySelector('#set')?.addEventListener('click', () => {
    const key = (builder.container.querySelector('#key') as HTMLInputElement).value;
    const value = (builder.container.querySelector('#value') as HTMLInputElement).value;
    
    try {
      storage[key] = JSON.parse(value);
    } catch {
      storage[key] = value;
    }
    
    logger.log(`Set ${key} = ${value}`);
    updateOutput();
  });

  builder.container.querySelector('#get')?.addEventListener('click', () => {
    const key = (builder.container.querySelector('#getKey') as HTMLInputElement).value;
    const value = storage[key];
    logger.log(`Get ${key} = ${JSON.stringify(value)}`);
  });

  builder.container.querySelector('#delete')?.addEventListener('click', () => {
    const key = (builder.container.querySelector('#getKey') as HTMLInputElement).value;
    delete storage[key];
    logger.log(`Deleted ${key}`);
    updateOutput();
  });

  updateOutput();
}

export function example2(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  const storage = createJsonStorageProxy('demo-json', {
    theme: 'light',
    count: 0,
    items: ['default']
  });

  builder.addHtml(`
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex gap-4">
          <input 
            type="text" 
            id="key"
            placeholder="Key"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <input 
            type="text" 
            id="value"
            placeholder="Value"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button id="set" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Set
          </button>
        </div>
        
        <div class="flex gap-4">
          <input 
            type="text" 
            id="getKey"
            placeholder="Key to get/delete"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button id="get" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Get
          </button>
          <button id="delete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Storage Contents:</p>
        <pre id="output" class="font-mono text-sm text-green-400"></pre>
      </div>
    </div>
  `);

  const updateOutput = () => {
    const output = builder.container.querySelector('#output')!;
    const contents = JSON.parse(localStorage.getItem('demo-json') || '{}');
    output.textContent = JSON.stringify(contents, null, 2);
  };

  builder.container.querySelector('#set')?.addEventListener('click', () => {
    const key = (builder.container.querySelector('#key') as HTMLInputElement).value;
    const value = (builder.container.querySelector('#value') as HTMLInputElement).value;
    
    try {
      storage[key] = JSON.parse(value);
    } catch {
      storage[key] = value;
    }
    
    logger.log(`Set ${key} = ${value}`);
    updateOutput();
  });

  builder.container.querySelector('#get')?.addEventListener('click', () => {
    const key = (builder.container.querySelector('#getKey') as HTMLInputElement).value;
    const value = storage[key];
    logger.log(`Get ${key} = ${JSON.stringify(value)}`);
  });

  builder.container.querySelector('#delete')?.addEventListener('click', () => {
    const key = (builder.container.querySelector('#getKey') as HTMLInputElement).value;
    delete storage[key];
    logger.log(`Deleted ${key}`);
    updateOutput();
  });

  updateOutput();
} 
