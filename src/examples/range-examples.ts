import { range } from '@/snippets/range/range';
import { range2D } from '@/snippets/range/range2d';
import { range3D } from '@/snippets/range/range3d';
import { range as rangeND } from '@/snippets/range/range-nd';
import { createExampleLayoutBuilder } from './core/createExampleLayoutBuilder';

export function example1(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-4">
      <div class="flex gap-4">
        <input 
          type="number" 
          id="start" 
          value="0"
          class="w-24 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700"
        />
        <input 
          type="number" 
          id="end" 
          value="5"
          class="w-24 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700"
        />
        <input 
          type="number" 
          id="step" 
          value="1"
          class="w-24 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700"
        />
        <button id="generate" class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          Generate
        </button>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Result:</p>
        <p id="result" class="font-mono text-green-400"></p>
      </div>
    </div>
  `);

  const update = () => {
    const start = Number(
      (builder.container.querySelector('#start') as HTMLInputElement).value
    );
    const end = Number(
      (builder.container.querySelector('#end') as HTMLInputElement).value
    );
    const step = Number(
      (builder.container.querySelector('#step') as HTMLInputElement).value
    );

    const result = range(start, end, step);
    const resultEl = builder.container.querySelector('#result')!;
    resultEl.textContent = `[${result.join(', ')}]`;
    logger.log(`Generated range(${start}, ${end}, ${step})`);
  };

  builder.container.querySelector('#generate')?.addEventListener('click', update);
  update();
}

export function example2(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400">X Range</label>
          <div class="flex gap-2">
            <input type="number" id="xStart" value="0" class="w-20 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
            <input type="number" id="xEnd" value="2" class="w-20 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-400">Y Range</label>
          <div class="flex gap-2">
            <input type="number" id="yStart" value="0" class="w-20 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
            <input type="number" id="yEnd" value="2" class="w-20 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
          </div>
        </div>
      </div>
      
      <button id="generate" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Generate 2D Grid
      </button>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Result:</p>
        <div id="grid" class="grid gap-2"></div>
      </div>
    </div>
  `);

  const update = () => {
    const xStart = Number(
      (builder.container.querySelector('#xStart') as HTMLInputElement).value
    );
    const xEnd = Number(
      (builder.container.querySelector('#xEnd') as HTMLInputElement).value
    );
    const yStart = Number(
      (builder.container.querySelector('#yStart') as HTMLInputElement).value
    );
    const yEnd = Number(
      (builder.container.querySelector('#yEnd') as HTMLInputElement).value
    );

    const points = range2D([xStart, xEnd], [yStart, yEnd]);
    const gridEl = builder.container.querySelector<HTMLDivElement>('#grid')!;
    
    gridEl.innerHTML = points
      .map(
        ([x, y]) =>
          `<div class="px-2 py-1 bg-gray-700 rounded font-mono text-green-400">[${x}, ${y}]</div>`
      )
      .join('');
    
    gridEl.style.gridTemplateColumns = `repeat(${xEnd - xStart}, auto)`;
    
    logger.log(`Generated 2D grid ${points.length} points`);
  };

  builder.container.querySelector('#generate')?.addEventListener('click', update);
  update();
}

export function example3(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="text-sm text-gray-400">X Range</label>
          <div class="flex gap-2">
            <input type="number" id="xStart" value="0" class="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
            <input type="number" id="xEnd" value="2" class="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-400">Y Range</label>
          <div class="flex gap-2">
            <input type="number" id="yStart" value="0" class="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
            <input type="number" id="yEnd" value="2" class="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
          </div>
        </div>
        <div>
          <label class="text-sm text-gray-400">Z Range</label>
          <div class="flex gap-2">
            <input type="number" id="zStart" value="0" class="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
            <input type="number" id="zEnd" value="2" class="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" />
          </div>
        </div>
      </div>
      
      <button id="generate" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Generate 3D Points
      </button>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Result:</p>
        <div id="points" class="grid gap-2 grid-cols-2"></div>
      </div>
    </div>
  `);

  const update = () => {
    const xStart = Number(
      (builder.container.querySelector('#xStart') as HTMLInputElement).value
    );
    const xEnd = Number(
      (builder.container.querySelector('#xEnd') as HTMLInputElement).value
    );
    const yStart = Number(
      (builder.container.querySelector('#yStart') as HTMLInputElement).value
    );
    const yEnd = Number(
      (builder.container.querySelector('#yEnd') as HTMLInputElement).value
    );
    const zStart = Number(
      (builder.container.querySelector('#zStart') as HTMLInputElement).value
    );
    const zEnd = Number(
      (builder.container.querySelector('#zEnd') as HTMLInputElement).value
    );

    const points = range3D(
      [xStart, xEnd],
      [yStart, yEnd],
      [zStart, zEnd]
    );
    
    const pointsEl = builder.container.querySelector('#points')!;
    pointsEl.innerHTML = points
      .map(
        ([x, y, z]) =>
          `<div class="px-2 py-1 bg-gray-700 rounded font-mono text-green-400">[${x}, ${y}, ${z}]</div>`
      )
      .join('');
    
    logger.log(`Generated 3D points: ${points.length} points`);
  };

  builder.container.querySelector('#generate')?.addEventListener('click', update);
  update();
}

export function example4(container: HTMLElement) {
  const builder = createExampleLayoutBuilder(container);
  const { logger } = builder;

  builder.addHtml(`
    <div class="space-y-4">
      <div class="space-y-2">
        <div id="ranges"></div>
        <button id="addDimension" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
          Add Dimension
        </button>
      </div>
      
      <button id="generate" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Generate Points
      </button>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Result:</p>
        <div id="points" class="grid gap-2 grid-cols-2 font-mono text-green-400"></div>
      </div>
    </div>
  `);

  const rangesEl = builder.container.querySelector('#ranges')!;
  
  function addDimensionInputs() {
    const dim = rangesEl.children.length;
    const dimensionEl = document.createElement('div');
    dimensionEl.className = 'flex gap-4 items-center';
    dimensionEl.innerHTML = `
      <label class="text-sm text-gray-400 w-24">Dimension ${dim + 1}</label>
      <div class="flex gap-2">
        <input type="number" class="start w-20 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" value="0" />
        <input type="number" class="end w-20 px-2 py-1 bg-gray-800 text-white rounded border border-gray-700" value="2" />
      </div>
      ${dim > 0 ? '<button class="remove px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Remove</button>' : ''}
    `;
    
    dimensionEl.querySelector('.remove')?.addEventListener('click', () => {
      dimensionEl.remove();
      update();
    });
    
    rangesEl.appendChild(dimensionEl);
  }

  const update = () => {
    const ranges: [number, number][] = Array.from(rangesEl.children).map(el => {
      const start = Number((el.querySelector('.start') as HTMLInputElement).value);
      const end = Number((el.querySelector('.end') as HTMLInputElement).value);
      return [start, end];
    });

    const points = rangeND(ranges);
    const pointsEl = builder.container.querySelector('#points')!;
    
    pointsEl.innerHTML = points
      .map(
        point =>
          `<div class="px-2 py-1 bg-gray-700 rounded">[${point.join(', ')}]</div>`
      )
      .join('');
    
    logger.log(`Generated ${points.length} points in ${ranges.length}D`);
  };

  builder.container
    .querySelector('#addDimension')
    ?.addEventListener('click', () => {
      addDimensionInputs();
      update();
    });

  builder.container.querySelector('#generate')?.addEventListener('click', update);

  // Add initial dimension
  addDimensionInputs();
  update();
} 
