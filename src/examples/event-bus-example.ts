import { EventBus } from '@/snippets/event-bus';

export default function(container: HTMLElement) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex gap-4">
          <button id="login" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Login
          </button>
          <button id="logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Logout
          </button>
          <button id="purchase" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Make Purchase
          </button>
        </div>
        
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input type="checkbox" id="logEvents" checked class="w-4 h-4 rounded bg-gray-700 border-gray-600">
            <span class="text-gray-300">Log Events</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" id="trackPurchases" checked class="w-4 h-4 rounded bg-gray-700 border-gray-600">
            <span class="text-gray-300">Track Purchases</span>
          </label>
        </div>
      </div>

      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Event Log:</p>
        <div id="output" class="font-mono text-sm space-y-1"></div>
      </div>
    </div>
  `;

  // Create event bus with typed events
  type AppEvents = {
    'login': () => void;
    'logout': () => void;
    'purchase': (amount: number) => void;
  };

  const bus = new EventBus<AppEvents>();
  const output = container.querySelector('#output')!;

  // Add log entry with timestamp
  const log = (message: string, type = 'info') => {
    const colors = {
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400'
    };
    const time = new Date().toLocaleTimeString();
    output.innerHTML = `<div class="${colors[type as keyof typeof colors]}">[${time}] ${message}</div>` + output.innerHTML;
  };

  // Event listeners
  const onLogin = () => log('User logged in', 'success');
  const onLogout = () => log('User logged out', 'warning');
  const onPurchase = (amount: number) => log(`Purchase made: $${amount}`, 'success');

  // Toggle event listeners based on checkboxes
  const logEvents = container.querySelector('#logEvents') as HTMLInputElement;
  const trackPurchases = container.querySelector('#trackPurchases') as HTMLInputElement;

  logEvents.addEventListener('change', () => {
    if (logEvents.checked) {
      bus.on({
        login: onLogin,
        logout: onLogout
      });
      log('Started logging auth events', 'info');
    } else {
      bus.off({
        login: onLogin,
        logout: onLogout
      });
      log('Stopped logging auth events', 'info');
    }
  });

  trackPurchases.addEventListener('change', () => {
    if (trackPurchases.checked) {
      bus.on({ purchase: onPurchase });
      log('Started tracking purchases', 'info');
    } else {
      bus.off({ purchase: onPurchase });
      log('Stopped tracking purchases', 'info');
    }
  });

  // Trigger events
  container.querySelector('#login')?.addEventListener('click', () => {
    bus.dispatch('login');
  });

  container.querySelector('#logout')?.addEventListener('click', () => {
    bus.dispatch('logout');
  });

  container.querySelector('#purchase')?.addEventListener('click', () => {
    const amount = Math.floor(Math.random() * 100) + 1;
    bus.dispatch('purchase', amount);
  });

  // Initial setup
  bus.on({
    login: onLogin,
    logout: onLogout,
    purchase: onPurchase
  });
}