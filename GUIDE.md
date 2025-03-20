# Guide

## How to add a new article

1. Write your snippet(s) to `src/snippets`. These must be exported such that they can be used elsewhere in the codebase, but also well separated into different files (even if variations of the same snippet).
2. Write example usage of the snippet(s) in `src/examples`. Each example file must be an exported function that takes a container HTMLElement as an argument, and adds necessary content to it. Use `const builder = createExampleLayoutBuilder(container);` to make your life easier.
3. Add new page content to `src/content/posts/<article-slug>.mdx`. Combine regular markdown for the article text; with `<CodeSnippet file="path-to-file" />` to directly print a code snippet file as-is; as well as `<Example component="path-to-example-file" namedExport?="function-name-(defaults-to-default-export)" />` to embed a live example in the article.
