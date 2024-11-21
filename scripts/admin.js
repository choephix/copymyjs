import enquirer from 'enquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');

// ANSI escape codes for colors
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

async function getAllPosts() {
  const files = await fs.readdir(BLOG_DIR);
  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8');
      const isDraft = /draft:\s*true/.test(content);
      return { file, isDraft, willBeDraft: isDraft };
    })
  );
  return posts;
}

async function toggleDrafts(selectedFiles, posts) {
  for (const file of selectedFiles) {
    const filePath = path.join(BLOG_DIR, file);
    let content = await fs.readFile(filePath, 'utf-8');
    const post = posts.find(p => p.file === file);
    
    if (/draft:\s*true/.test(content)) {
      content = content.replace(/draft:\s*true/, 'draft: false');
    } else if (/draft:\s*false/.test(content)) {
      content = content.replace(/draft:\s*false/, 'draft: true');
    } else {
      content = content.replace(
        /(description:.*\n)/,
        `$1draft: ${post.willBeDraft}\n`
      );
    }
    
    await fs.writeFile(filePath, content);
  }
}

function formatChoice(post) {
  const prefix = post.willBeDraft ? 'DRAFT' : '     ';
  const color = post.willBeDraft ? colors.yellow : colors.green;
  return `${color}${prefix} ${post.file.replace('.mdx', '')}${colors.reset}`;
}

async function main() {
  const posts = await getAllPosts();
  
  const prompt = new enquirer.MultiSelect({
    name: 'posts',
    message: 'Select posts to toggle draft status (space to select, enter to confirm)',
    choices: posts.map((post) => ({
      name: post.file,
      message: formatChoice(post),
      onChoice(state, choice) {
        const post = posts.find(p => p.file === choice.name);
        if (state.submitted) return;
        
        if (choice.enabled) {
          post.willBeDraft = !post.isDraft;
        } else {
          post.willBeDraft = post.isDraft;
        }
        
        choice.message = formatChoice(post);
      }
    })),
    result(names) {
      return this.map(names);
    }
  });

  try {
    const selected = await prompt.run();
    if (Object.keys(selected).length === 0) {
      console.log('No posts selected. Exiting...');
      return;
    }

    await toggleDrafts(Object.keys(selected), posts);
    console.log(`${colors.green}✓ Successfully updated draft status for selected posts!${colors.reset}`);
  } catch (err) {
    if (err.message === 'canceled') {
      console.log(`${colors.yellow}Operation cancelled${colors.reset}`);
      return;
    }
    console.error(`${colors.red}Error:${colors.reset}`, err);
  }
}

console.clear();
main();