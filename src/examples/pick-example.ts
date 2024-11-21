import { pick } from '@/snippets/object-pick';

export default function(container: HTMLElement) {
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret123',
    createdAt: '2024-03-20'
  };

  const publicInfo = pick(user, ['name', 'email']);

  container.innerHTML = `
    <div class="space-y-4">
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Original object:</p>
        <pre class="font-mono text-blue-400">${JSON.stringify(user, null, 2)}</pre>
      </div>
      
      <div class="p-4 bg-gray-800 rounded">
        <p class="text-gray-300 mb-2">Picked properties (name, email):</p>
        <pre class="font-mono text-green-400">${JSON.stringify(publicInfo, null, 2)}</pre>
      </div>
    </div>
  `;
}