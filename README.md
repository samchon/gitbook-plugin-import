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

If you want to use templates, then define dictionary as `<!-- @templates([ ["key, "value"], ["key, "value"] ]) -->` and write `${{ key }}` down to content.

```md
<!-- @templates([
    ["name", "Jeongho Nam"],
    ["github", "https://github.com/samchon"],
    ["email", "samchon@samchon.org"]
]) -->

# My Content
## Introduction
Hello, my name is ${{ name }} and my github address is $ {{ github }}. If you want to contact me, mail to ${{ email }}.

## External Content
<!-- @import("internal/detail.md") -->

## Remote Content
<!-- @import("https://raw.githubusercontent.com/samchon/tstl/master/src/container/TreeMap.ts") -->

## Partial Content
<!-- @import("internal/story.md#L7-L24") -->
```