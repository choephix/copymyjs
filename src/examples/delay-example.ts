import { delayMs } from '@/snippets/async-delay';

export default function(container: HTMLElement) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex gap-4">
        <button id="start" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Start Countdown
        </button>
        <div id="status" class="py-2 text-gray-400">Click to start</div>
      </div>
    </div>
  `;

  const statusEl = container.querySelector('#status')!;
  const buttonEl = container.querySelector('#start')!;

  async function runDemo() {
    buttonEl.setAttribute('disabled', 'true');
    statusEl.textContent = 'Starting...';
    
    for (let i = 3; i >= 1; i--) {
      await delayMs(1000);
      statusEl.textContent = `${i}...`;
    }
    
    await delayMs(1000);
    statusEl.textContent = 'Done!';
    buttonEl.removeAttribute('disabled');
  }

  buttonEl.addEventListener('click', runDemo);
}