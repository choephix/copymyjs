export default function (container: HTMLElement) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <button id="colorBtn" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Change Color
        </button>
        <div id="box" class="w-16 h-16 bg-blue-500 transition-colors duration-500"></div>
      </div>
    </div>
  `;

  const colors = ['blue', 'red', 'green', 'purple', 'orange'];
  let currentIndex = 0;

  const box = container.querySelector('#box')!;
  const btn = container.querySelector('#colorBtn')!;

  btn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % colors.length;
    box.className = `w-16 h-16 bg-${colors[currentIndex]}-500 transition-colors duration-500`;
  });
}
