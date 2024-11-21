export default function(container: HTMLElement) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <button id="typeBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Type Message
        </button>
        <div id="output" class="font-mono text-lg"></div>
      </div>
    </div>
  `;

  const message = "Hello, TypeScript!";
  let isTyping = false;
  
  const output = container.querySelector('#output')!;
  const btn = container.querySelector('#typeBtn')!;
  
  async function typeMessage() {
    if (isTyping) return;
    isTyping = true;
    output.textContent = '';
    
    for (const char of message) {
      output.textContent += char;
      await new Promise(r => setTimeout(r, 100));
    }
    
    isTyping = false;
  }
  
  btn.addEventListener('click', typeMessage);
}
