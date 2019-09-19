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
## External Content
<!-- @import("internal/detail.md") -->

## Remote Content
<!-- @import("https://raw.githubusercontent.com/samchon/tstl/master/src/container/TreeMap.ts") -->

## Partial Content
<!-- @import("internal/story.md#L7-L24") -->
```