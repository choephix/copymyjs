import { debounce } from '@/snippets/function/debounce';

export default function(container: HTMLElement) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="space-y-2">
        <input type="text" id="input" 
          class="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          placeholder="Type something..."
        />
        <p class="text-gray-400 text-sm">Type quickly to see debouncing in action (500ms delay)</p>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Debounced value:</p>
        <p id="result" class="font-mono text-green-400">Start typing...</p>
      </div>
    </div>
  `;

  const input = container.querySelector('#input')!;
  const result = container.querySelector('#result')!;

  const updateResult = debounce((value: string) => {
    result.textContent = value || 'Start typing...';
  }, 500);

  input.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;
    updateResult(value);
  });
}