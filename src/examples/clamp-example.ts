import { clamp } from '@/snippets/number/clamp';

export default function(container: HTMLElement) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="space-y-2">
        <input type="range" id="input" min="0" max="100" value="50"
          class="w-full"
        />
        <p class="text-gray-400 text-sm">Move the slider to see clamping in action</p>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Value clamped between 25 and 75:</p>
        <p id="result" class="font-mono text-green-400">50</p>
      </div>
    </div>
  `;

  const input = container.querySelector('#input')!;
  const result = container.querySelector('#result')!;

  input.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    const clamped = clamp(value, 25, 75);
    result.textContent = String(clamped);
  });
}