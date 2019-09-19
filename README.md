# Import
## Gitbook Plugin
Import contents from other documents

## Installation
Open the book.json and insert `import` value into the plugins variabl

```json
{
    "plugins": ["import"]
}
```

## Usage
Write `<!-- @import("path") -->` down to markdown file.

```md
# My Content
## Detail
<!-- @import("internal/detail.md") -->
```