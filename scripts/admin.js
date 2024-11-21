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
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

async function parsePostFrontmatter(content) {
  const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (!key || !valueParts.length) continue;
    
    const value = valueParts.join(':').trim();
    // Remove quotes if present
    frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
  }
  
  return frontmatter;
}

async function getAllPosts() {
  const files = await fs.readdir(BLOG_DIR);
  const showFilenames = process.argv.includes('--byfilename');
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8');
      const frontmatter = await parsePostFrontmatter(content);
      const isDraft = frontmatter.draft === 'true';
      const publishDate = new Date(frontmatter.publishDate);
      const isScheduled = !isDraft && publishDate > new Date();
      
      return {
        file,
        title: showFilenames ? file.replace('.mdx', '') : frontmatter.title,
        category: frontmatter.category || 'uncategorized',
        isDraft,
        isScheduled,
        publishDate,
        willBeDraft: isDraft
      };
    })
  );

  // Sort by category and then by title
  return posts.sort((a, b) => {
    if (a.category !== b.category) return b.category.localeCompare(a.category);
    return (a.publishDate?.getTime() || 0) - (b.publishDate?.getTime() || 0)
    //return a.file.localeCompare(b.file);
  });
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
  let prefix, color;
  
  if (post.willBeDraft) {
    prefix = 'DRAFT';
    color = colors.yellow;
  } else if (post.isScheduled) {
    prefix = 'SCHED';
    color = colors.cyan;
  } else {
    prefix = '     ';
    color = colors.green;
  }

  return `${color}${prefix} | ${post.title}${colors.reset}`;
}

function formatCategory(category) {
  const categoryName = category?.toUpperCase() || '';
  return `\n${colors.blue}${colors.bold}${categoryName}${colors.reset}\n`;
}

async function main() {
  const posts = await getAllPosts();
  let currentCategory = '';
  
  const prompt = new enquirer.MultiSelect({
    name: 'posts',
    message: 'Select posts to toggle draft status (space to select, enter to confirm)',
    choices: posts.map((post) => {
      // Add category header if category changes
      const choices = [];
      if (currentCategory !== post.category) {
        currentCategory = post.category;
        choices.push({
          role: 'separator',
          message: formatCategory(post.category)
        });
      }
      
      choices.push({
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
      });
      
      return choices;
    }).flat(),
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