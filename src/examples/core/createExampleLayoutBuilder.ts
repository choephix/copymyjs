interface Logger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

interface ExampleLayoutBuilder {
  container: HTMLElement;
  logger: Logger;
  addHtml: (html: string) => void;
}

export function createExampleLayoutBuilder(
  parentElement: HTMLElement
): ExampleLayoutBuilder {
  // Main wrapper with relative positioning
  const wrapper = document.createElement('div');
  wrapper.className = 'relative w-full h-full';
  parentElement.appendChild(wrapper);

  // Main container that fills available space
  const mainContainer = document.createElement('div');
  mainContainer.className = 'p-6 space-y-4 mr-[200px]';
  wrapper.appendChild(mainContainer);

  let logContainer: HTMLElement | null = null;

  // Create lazy logger that initializes UI on first use
  const lazyLogger: Logger = {
    log: createLazyLogMethod('log'),
    warn: createLazyLogMethod('warn'),
    error: createLazyLogMethod('error'),
  };

  function createLazyLogMethod(type: 'log' | 'warn' | 'error') {
    return (...args: unknown[]) => {
      if (!logContainer) {
        logContainer = document.createElement('div');
        logContainer.className = 
          'absolute top-0 bottom-0 right-0 w-[200px] ' +
          'font-mono text-xs ' +
          'transition-transform duration-300 ' +
          'overflow-hidden rounded-l-lg box-border ' +
          'animate-slide-in scrollbar-slim p-1';

        const innerContainer = document.createElement('div');
        innerContainer.className = 
          'w-full h-full overflow-y-auto overflow-x-hidden ' +
          'bg-[#19233a] border border-gray-700 ' +
          'rounded-lg p-2 box-border scrollbar-slim';
        
        logContainer.appendChild(innerContainer);
        wrapper.appendChild(logContainer);

        Object.assign(lazyLogger, createLoggerInterface(innerContainer));
      }

      const message = args.join(' ');
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
    entry.className =
      {
        log: 'text-gray-300 dark:text-gray-300',
        warn: 'text-yellow-400 dark:text-yellow-400',
        error: 'text-red-400 dark:text-red-400',
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
