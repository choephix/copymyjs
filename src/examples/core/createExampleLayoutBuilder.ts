interface Logger {
  log: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

interface ExampleLayoutBuilder {
  container: HTMLElement;
  logger: Logger;
  addHtml: (html: string) => void;
}

export function createExampleLayoutBuilder(parentElement: HTMLElement): ExampleLayoutBuilder {
  // Single wrapper with flex row
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-row gap-4 overflow-hidden';
  parentElement.appendChild(wrapper);
  
  // Main container that grows naturally
  const mainContainer = document.createElement('div');
  mainContainer.className = 'space-y-4 flex-1 min-h-0 p-6';
  wrapper.appendChild(mainContainer);

  let logContainer: HTMLElement | null = null;
  
  // Create lazy logger that initializes UI on first use
  const lazyLogger: Logger = {
    log: createLazyLogMethod('log'),
    warn: createLazyLogMethod('warn'),
    error: createLazyLogMethod('error'),
  };

  function createLazyLogMethod(type: 'log' | 'warn' | 'error') {
    return (message: string) => {
      if (!logContainer) {
        // Initialize logger UI on first use
        logContainer = document.createElement('div');
        logContainer.className =
          'w-64 p-2 bg-[#19233a] font-mono text-xs ' +
          'shrink-0 overflow-y-auto self-stretch max-h-[200px] ' + 
          'outline outline-1 outline-gray-700 ' +
          'animate-slide-in';
        wrapper.appendChild(logContainer);
        
        // Replace lazy methods with real ones
        Object.assign(lazyLogger, createLoggerInterface(logContainer));
      }
      
      // Forward to the real method
      lazyLogger[type](message);
    };
  }

  return {
    container: mainContainer,
    logger: lazyLogger,
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
