import { compressWithStreams, decompressWithStreams } from '@/snippets/string-compression';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

const lipsum1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const EXAMPLE_TEXTS = {
  'Short Text': 'Hello, World!',
  'Long Lipsum': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Very Long Lipsum': `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel risus et ligula semper finibus eget vitae sem. Etiam a eros volutpat, tincidunt libero eget, auctor lectus. Nullam ex nunc, faucibus et nunc gravida, tincidunt blandit lacus. Integer non orci vulputate, ultricies odio eget, rutrum felis. Pellentesque vulputate sodales lorem eu sollicitudin. Fusce dapibus et leo vel vulputate. Maecenas molestie libero magna, quis sagittis libero sagittis eu. Praesent euismod leo non neque facilisis, eget fringilla urna iaculis. Nunc eget nisl mollis, pellentesque turpis et, maximus ante. Phasellus id velit in orci mattis ullamcorper. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis eu suscipit sapien. Aenean lacinia pretium erat quis aliquam. Etiam placerat risus odio, ut sollicitudin felis consequat eget. Vivamus quis sem eget ante pellentesque congue quis at augue.

Suspendisse lobortis ullamcorper erat, in lobortis enim iaculis eu. Donec suscipit suscipit nunc, sed fringilla odio consequat vitae. Maecenas neque turpis, imperdiet non massa a, molestie blandit turpis. In commodo commodo dolor, sit amet venenatis nulla ornare ac. Curabitur ex eros, viverra eget porta id, mollis et leo. Proin cursus nulla mi, non pellentesque lorem semper quis. Maecenas quis erat eu lorem varius pellentesque. Maecenas dictum at velit tempus molestie. Fusce elementum, enim sed ullamcorper convallis, mi arcu feugiat ligula, in egestas arcu magna ut diam. Sed id posuere dolor.

Interdum et malesuada fames ac ante ipsum primis in faucibus. In bibendum dolor sit amet pellentesque viverra. Vivamus in venenatis leo. Vestibulum dolor mi, maximus eget tellus non, imperdiet commodo ante. Proin vehicula in mauris ut elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris in eros tristique nibh molestie tincidunt.

Curabitur eget elementum enim. Nullam auctor sodales ligula. Morbi luctus, odio ac cursus vestibulum, massa nisl posuere velit, a facilisis justo ex nec mauris. Nam interdum est in imperdiet porta. Phasellus sit amet lacinia metus. Integer porta, augue sit amet posuere sagittis, neque massa ornare sem, id egestas magna ex at metus. Morbi eros odio, tempus ac nunc et, sodales tempor mauris. Donec tincidunt pellentesque nulla eu iaculis. Integer dictum libero sed ipsum tempus imperdiet nec at nibh. Curabitur in nisl quam. Morbi sodales, felis id congue porttitor, odio tellus ornare nisi, consequat ornare odio metus at augue.

Donec eget purus nec ex viverra condimentum. Nulla sed interdum ipsum. In id arcu sit amet velit mollis lobortis. Pellentesque consequat, mi sit amet efficitur porttitor, erat metus aliquet felis, sit amet fermentum lorem eros in sem. Proin pellentesque condimentum erat, ut sollicitudin quam hendrerit in. Ut venenatis lacus ex, ac gravida lectus sagittis at. Nam risus dui, fringilla eu neque sed, scelerisque accumsan nisl. Sed finibus aliquam finibus. Etiam sagittis justo eget felis pharetra, non sagittis turpis tempor. In velit felis, scelerisque sed mauris ut, vestibulum ultricies enim. Sed sed molestie ex. Proin cursus dapibus libero, sit amet gravida erat rhoncus id. Nulla blandit dui metus, non lacinia leo tincidunt ac. Integer at consequat nunc, et efficitur tellus.`.trim(),
  'Repetitive Text': 'The quick brown fox jumps over the lazy dog. '.repeat(10),
  'Highly Repetitive': 'abc'.repeat(500),
  'JSON Data': JSON.stringify({
    users: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      active: true
    })),
    metadata: {
      version: '1.0',
      timestamp: new Date().toISOString()
    }
  }, null, 2),
  'Binary-like': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.split('').map(char => char.charCodeAt(0).toString(2)).join(' '),
  'Random Text': Array.from({ length: 100 }, () => 
    Math.random().toString(36).substring(2)
  ).join(' '),
  'Numbers Only': Array.from({ length: 100 }, (_, i) => i).join(' '),
  'HTML Code': `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Example Page</title>
      <style>
        body { font-family: sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="header">Welcome to Example Page</h1>
        <p>This is a sample HTML document with some CSS styling.</p>
      </div>
    </body>
    </html>
  `.trim(),
  'CSV Data': Array.from({ length: 20 }, (_, i) => 
    `User ${i + 1},user${i + 1}@example.com,${Math.random() > 0.5}`
  ).join('\n'),
  'URL List': Array.from({ length: 10 }, (_, i) => 
    `https://example.com/users/${i + 1}/profile?tab=settings&theme=dark`
  ).join('\n'),
  'Base64 Data': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='.repeat(5),
  'Whitespace Heavy': lipsum1.split(' ').map((word) => 
    '    '.repeat(Math.floor(Math.random() * 20)) + word.toLowerCase().replace(/[^a-z]/g, '')
  ).join('\n'),
  'Mixed Content': `
    User ID: 12345
    Name: John Doe
    Email: john@example.com
    Preferences: {
      "theme": "dark",
      "notifications": true,
      "language": "en-US"
    }
    Notes:
    - Meeting at 3 PM
    - Call Alice about project
    - Review PR #123
  `
};

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm text-gray-400 flex justify-between items-center">
          <span>Original Text (${String.fromCodePoint(0x2193)} to compress)</span>
          <span id="inputDirtyBadge" class="hidden px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs">
            Modified
          </span>
        </label>
        <textarea 
          id="input"
          rows="4"
          class="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none transition-all duration-200 text-xs"
          placeholder="Enter text to compress..."
        >Hello, this is some example text that will be compressed using the Web Streams API and the DEFLATE algorithm!</textarea>
      </div>

      <div class="flex justify-center gap-4">
        <button id="compress" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
          Compress ${String.fromCodePoint(0x2193)}
        </button>
        <button id="decompress" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm" disabled>
          Decompress ${String.fromCodePoint(0x2191)}
        </button>
      </div>

      <div class="space-y-2">
        <label class="text-sm text-gray-400 flex justify-between items-center">
          <span>Compressed Base64 (${String.fromCodePoint(0x2193)} to decompress)</span>
          <span id="compressedDirtyBadge" class="hidden px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs">
            Modified
          </span>
        </label>
        <textarea 
          id="compressed"
          rows="4"
          class="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none font-mono text-xs transition-all duration-200"
          placeholder="Compressed data will appear here..."
          spellcheck="false"
        ></textarea>
      </div>

      <div class="p-4 bg-gray-800/50 rounded">
        <div id="stats" class="font-mono text-xs space-y-1"></div>
      </div>

      <hr/>

      <div class="p-4 bg-gray-800/50 rounded">
        <p class="text-gray-300 mb-2 text-xs my-0 font-bold">Try these sample inputs</p> 
        <div class="flex flex-wrap gap-2" id="examples">
          ${Object.keys(EXAMPLE_TEXTS).map(name => `
            <button class="px-3 py-1.5 bg-gray-700/50 text-xs text-white rounded-full hover:bg-gray-600 transition-colors example-text" data-name="${name}">
              ${name}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `);

  const input = builder.container.querySelector('#input') as HTMLTextAreaElement;
  const compressBtn = builder.container.querySelector('#compress') as HTMLButtonElement;
  const decompressBtn = builder.container.querySelector('#decompress') as HTMLButtonElement;
  const compressedOutput = builder.container.querySelector('#compressed') as HTMLTextAreaElement;
  const statsOutput = builder.container.querySelector('#stats')!;

  let lastInputValue = input.value;
  let lastCompressedValue = '';

  const updateStats = (original: string, compressed: string) => {
    const originalChars = original.length;
    const originalBytes = new Blob([original]).size;
    const compressedChars = compressed.length;
    const compressedBytes = new Blob([atob(compressed)]).size;
    const ratio = ((1 - compressedBytes / originalBytes) * 100).toFixed(1);
    const ratioNum = parseFloat(ratio);

    statsOutput.innerHTML = `
      <div class="text-blue-400">Original: ${originalChars} chars (${originalBytes} bytes)</div>
      <div class="text-fuchsia-400">Compressed: ${compressedChars} chars (${compressedBytes} bytes)</div>
      <div class="${ratioNum > 0 ? 'text-emerald-400' : 'text-red-400'}">Compression ratio: ${ratio}%</div>
    `;
  };

  const checkDirtyState = () => {
    const inputIsDirty = input.value !== lastInputValue;
    const compressedIsDirty = compressedOutput.value !== lastCompressedValue;

    // Update badges
    const inputBadge = builder.container.querySelector('#inputDirtyBadge')!;
    const compressedBadge = builder.container.querySelector('#compressedDirtyBadge')!;
    
    inputBadge.classList.toggle('hidden', !inputIsDirty);
    compressedBadge.classList.toggle('hidden', !compressedIsDirty);

    // Update textarea styling
    input.classList.toggle('border-amber-500/50', inputIsDirty);
    input.classList.toggle('bg-amber-900/10', inputIsDirty);
    compressedOutput.classList.toggle('border-amber-500/50', compressedIsDirty);
    compressedOutput.classList.toggle('bg-amber-900/10', compressedIsDirty);

    // Update button states
    compressBtn.disabled = !input.value || !inputIsDirty;
    decompressBtn.disabled = !compressedOutput.value || !compressedIsDirty;
  };

  input.addEventListener('input', checkDirtyState);
  compressedOutput.addEventListener('input', checkDirtyState);

  compressBtn.addEventListener('click', async () => {
    const text = input.value || '';
    console.log('Compressing...', text);

    try {
      compressBtn.disabled = true;
      compressBtn.innerHTML = `Compressing... ${String.fromCodePoint(0x2193)}`;

      const compressed = await compressWithStreams(text);
      compressedOutput.value = compressed;
      lastInputValue = text;
      lastCompressedValue = compressed;
      
      updateStats(text, compressed);
      checkDirtyState();
    } catch (error) {
      logger.log('Compression failed:', error);
      compressedOutput.value = 'Compression failed: ' + error;
    } finally {
      compressBtn.disabled = false;
      compressBtn.innerHTML = `Compress ${String.fromCodePoint(0x2193)}`;
    }
  });

  decompressBtn.addEventListener('click', async () => {
    const compressed = compressedOutput.value;
    if (!compressed) return;

    try {
      decompressBtn.disabled = true;
      decompressBtn.innerHTML = `${String.fromCodePoint(0x2191)} Decompressing...`;
      
      const decompressed = await decompressWithStreams(compressed);
      input.value = decompressed;
      lastInputValue = decompressed;
      lastCompressedValue = compressed;
      
      updateStats(decompressed, compressed);
      checkDirtyState();
    } catch (error) {
      logger.log('Decompression failed:', error);
      input.value = 'Decompression failed: ' + error;
    } finally {
      decompressBtn.disabled = false;
      decompressBtn.innerHTML = `${String.fromCodePoint(0x2191)} Decompress`;
    }
  });

  // Handle example text buttons
  builder.container.querySelectorAll('.example-text').forEach(button => {
    button.addEventListener('click', () => {
      const name = (button as HTMLButtonElement).dataset.name!;
      const text = EXAMPLE_TEXTS[name as keyof typeof EXAMPLE_TEXTS];
      input.value = text;
      checkDirtyState();
      compressBtn.click();
    });
  });

  // Initial compression
  compressBtn.click();
} 
