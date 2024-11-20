import { unique } from '@/snippets/array/unique';

export default function(container: HTMLElement) {
  const numbers = [1, 2, 2, 3, 3, 3, 4, 5, 5];
  const uniqueNumbers = unique(numbers);

  container.innerHTML = `
    <div class="space-y-4">
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Original array:</p>
        <p class="font-mono text-blue-400">[${numbers.join(', ')}]</p>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Unique values:</p>
        <p class="font-mono text-green-400">[${uniqueNumbers.join(', ')}]</p>
      </div>
    </div>
  `;
}