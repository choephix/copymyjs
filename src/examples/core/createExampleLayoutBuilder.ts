interface Logger {
  log: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

interface ExampleLayoutBuilder {
  container: HTMLElement;
  addLogger: () => Logger;
  addHtml: (html: string) => void;
}

export function createExampleLayoutBuilder(parentElement: HTMLElement): ExampleLayoutBuilder {
  // Single wrapper with flex row
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-row gap-4';
  parentElement.appendChild(wrapper);

  // Main container that grows naturally
  const mainContainer = document.createElement('div');
  mainContainer.className = 'space-y-4 flex-1';
  wrapper.appendChild(mainContainer);

  let logContainer: HTMLElement | null = null;

  return {
    container: mainContainer,

    addLogger() {
      if (logContainer) return createLoggerInterface(logContainer);

      // Logger that matches height of mainContainer and scrolls
      logContainer = document.createElement('div');
      logContainer.className =
        'w-64 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs ' +
        'shrink-0 overflow-y-auto self-stretch max-h-[256px]';
      wrapper.appendChild(logContainer);

      return createLoggerInterface(logContainer);
    },

    addHtml(html: string) {
      mainContainer.insertAdjacentHTML('beforeend', html);
    },
  };
}

function createLoggerInterface(logElement: HTMLElement): Logger {
  const createLogEntry = (message: string, type: 'log' | 'warn' | 'error') => {
    const entry = document.createElement('div');
    entry.className = {
      log: 'text-gray-700 dark:text-gray-300',
      warn: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
    }[type] + ' leading-tight py-0.5';
    entry.textContent = message;
    logElement.appendChild(entry);

    // Scroll to bottom
    requestAnimationFrame(() => {
      logElement.scrollTop = logElement.scrollHeight;
    });
  };

  return {
    log: (message: string) => createLogEntry(message, 'log'),
    warn: (message: string) => createLogEntry(message, 'warn'),
    error: (message: string) => createLogEntry(message, 'error'),
  };
}
