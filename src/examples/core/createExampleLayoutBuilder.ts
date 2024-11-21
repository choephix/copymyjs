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
  // Create main container with a flex layout
  const wrapper = document.createElement('div');
  wrapper.className = 'flex gap-4';
  parentElement.appendChild(wrapper);

  // Create the main container for the example
  const container = document.createElement('div');
  container.className = 'space-y-4 flex-1';
  wrapper.appendChild(container);

  let logContainer: HTMLElement | null = null;

  console.log(container, parentElement);

  return {
    container,

    addLogger() {
      if (logContainer) return createLoggerInterface(logContainer);

      // Create logger container
      logContainer = document.createElement('div');
      logContainer.className =
        'w-64 p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-2 font-mono text-sm';
      wrapper.appendChild(logContainer);

      return createLoggerInterface(logContainer);
    },

    addHtml(html: string) {
      container.insertAdjacentHTML('beforeend', html);
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
    }[type];
    entry.textContent = message;
    logElement.appendChild(entry);

    // Scroll to bottom
    logElement.scrollTop = logElement.scrollHeight;
  };

  return {
    log: (message: string) => createLogEntry(message, 'log'),
    warn: (message: string) => createLogEntry(message, 'warn'),
    error: (message: string) => createLogEntry(message, 'error'),
  };
}
