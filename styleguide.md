---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
permalink: /styleguide/
---

# Styleguide

## Framework

This website is built with [Jekyll](https://jekyllrb.com/docs/) for the static site generation.
It also uses [Optics](https://docs.optics.rolemodel.design/) for all its styles.

## Adding Posts

New posts can be added to the `/_posts` folder and will show up in the `All Posts` page.

Static Pages can be added to the `/_static_pages` folder which will automatically add a link in the sidebar under the Introduction section

If you want to create a new category like the existing ones, you can create a folder like `/support`, add a `/support/_posts` folder and any posts inside will have the `support` category in their front-matter. You can add an `index.md` and loop through the posts to create links.

## Jekyll Plugins

The `jekyll-timeago` plugin is available which allows you to create timeago dates like so `{ { '2020-04-13T10:20:00Z' | timeago } }`
{% assign date = '2020-04-13T10:20:00Z' %}
- Original date - {{ date }}
- With timeago filter - {{ date | timeago }}

## Syntax Highlighting

You can also use syntax highlighing with the standard markdown syntax.

```
This is just plain text
```

```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

```js
function print_hi(name) {
  console.log("Hi, #{name}")
}
print_hi('Tom')
// prints 'Hi, Tom' to STDOUT.
```

```bash
$ bundle exec jekyll serve
```

```json
{
  "key": "value",
  "Another Key": {
    "Nested Key": "Nested Value"
  },
  "One More Key": ["Item 1", "Item 2"]
}
```

```scss
@mixin {
  color: red;
}
```

```css
:root {
  --custom-property: red;
}
```

```html
<div class="alert-info alert--muted">
  <span class="material-symbols-outlined alert__icon">info</span>
  <div class="alert__messages">
    <div class="alert__title">Intended audience</div>
    <div class="alert__description">
      This article is written for developers that are familiar with the basics of React,
      but are still pretty early in their journey.
    </div>
  </div>
</div>
```

If a syntax used does not show the language tag, you can add a new one by adding the following lines to the `_sass/componets/syntax-highlighting.scss` file

```scss
div.language-{new language} {
  @extend %language-badge;

  &::before {
    content: "{new language}";
  }
}
```

## Optics Components

Any components available in Optics are available here.

E.G. [The Alert Component](https://docs.optics.rolemodel.design/?path=/docs/components-alert--info) can be used for notices, callouts, and warnings

<div class="alert-info alert--muted">
  <span class="material-symbols-outlined alert__icon">info</span>
  <div class="alert__messages">
    <div class="alert__title">Intended audience</div>
    <div class="alert__description">
      This article is written for developers that are familiar with the basics of React, but are still pretty early in their journey.
    </div>
  </div>
</div>

<div class="alert-danger alert--muted">
  <div class="alert__messages">
    <div class="alert__description text-center">
      Warning: Each child in a list should have a unique "key" prop.
    </div>
  </div>
</div>
