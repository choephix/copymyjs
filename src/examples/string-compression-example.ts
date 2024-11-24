import { compressWithStreams, decompressWithStreams } from '@/snippets/string-compression';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export default function (container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-6">
      <div class="space-y-4">
        <textarea 
          id="input"
          rows="4"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          placeholder="Enter text to compress..."
        >Hello, this is some example text that will be compressed using the Web Streams API and the DEFLATE algorithm!</textarea>
        
        <div class="flex gap-4">
          <button id="compress" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Compress
          </button>
          <button id="decompress" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" disabled>
            Decompress
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Compressed (Base64):</p>
        <p id="compressed" class="font-mono text-sm text-blue-400 break-all"></p>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Stats:</p>
        <div id="stats" class="font-mono text-sm space-y-1"></div>
      </div>
    </div>
  `);

  const input = builder.container.querySelector('#input') as HTMLTextAreaElement;
  const compressBtn = builder.container.querySelector('#compress') as HTMLButtonElement;
  const decompressBtn = builder.container.querySelector('#decompress') as HTMLButtonElement;
  const compressedOutput = builder.container.querySelector('#compressed')!;
  const statsOutput = builder.container.querySelector('#stats')!;

  let lastCompressed = '';

  const updateStats = (original: string, compressed: string) => {
    const originalSize = new Blob([original]).size;
    const compressedSize = new Blob([atob(compressed)]).size;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    statsOutput.innerHTML = `
      <div class="text-blue-400">Original size: ${originalSize} bytes</div>
      <div class="text-green-400">Compressed size: ${compressedSize} bytes</div>
      <div class="text-yellow-400">Compression ratio: ${ratio}%</div>
    `;
  };

  compressBtn.addEventListener('click', async () => {
    const text = input.value;
    if (!text) return;

    try {
      compressBtn.disabled = true;
      compressBtn.textContent = 'Compressing...';
      
      const compressed = await compressWithStreams(text);
      lastCompressed = compressed;
      
      compressedOutput.textContent = compressed;
      updateStats(text, compressed);
      decompressBtn.disabled = false;
      
      // logger.log(`Compressed ${text.length} characters`);
    } catch (error) {
      logger.log('Compression failed:', error);
      compressedOutput.textContent = 'Compression failed: ' + error;
    } finally {
      compressBtn.disabled = false;
      compressBtn.textContent = 'Compress';
    }
  });

  decompressBtn.addEventListener('click', async () => {
    if (!lastCompressed) return;

    try {
      decompressBtn.disabled = true;
      decompressBtn.textContent = 'Decompressing...';
      
      const decompressed = await decompressWithStreams(lastCompressed);
      input.value = decompressed;
      
      // logger.log(`Decompressed back to ${decompressed.length} characters`);
    } catch (error) {
      logger.log('Decompression failed:', error);
      input.value = 'Decompression failed: ' + error;
    } finally {
      decompressBtn.disabled = false;
      decompressBtn.textContent = 'Decompress';
    }
  });

  // Initial compression
  compressBtn.click();
} 
