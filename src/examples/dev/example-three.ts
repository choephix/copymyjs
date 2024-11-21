export default function(container: HTMLElement) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <button id="bounceBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Bounce!
        </button>
        <div id="ball" class="w-8 h-8 bg-red-500 rounded-full transform translate-y-0 transition-transform duration-300"></div>
      </div>
    </div>
  `;

  const ball = container.querySelector('#ball')!;
  const btn = container.querySelector('#bounceBtn')!;
  let isAnimating = false;
  
  async function bounce() {
    if (isAnimating) return;
    isAnimating = true;
    
    const positions = ['-translate-y-16', 'translate-y-0'];
    
    for (let i = 0; i < 6; i++) {
      ball.className = `w-8 h-8 bg-red-500 rounded-full transform ${positions[i % 2]} transition-transform duration-300`;
      await new Promise(r => setTimeout(r, 300));
    }
    
    isAnimating = false;
  }
  
  btn.addEventListener('click', bounce);
}
