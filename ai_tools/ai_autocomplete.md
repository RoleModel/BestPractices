## [Home](../README.md)

# 1. AI Autocomplete

AI autocomplete tools can be very helpful in the right situations, but they can also be overly aggressive and unhelpful in the wrong situations. Most tools default to using `tab` to accept suggestions, but that can often result in unintentionally accepting suggestions when trying to navigate code or change indentation.

## Recommended Keybindings

Using `;` to accept suggestions (or another key that is easy to reach and not typed often) significantly improves the experience of using AI autocomplete tools.

In addition, it is helpful to add a keybinding to toggle AI completions on and off. Then if the suggestions are particularly unhelpful, such as when writing comments, they can be temporarily disabled.

### Settings for GitHub Copilot in Visual Studio Code

These keybindings incorporate the above suggestions and address a few other conflicts between common navigation shortcuts and Copilot's default keybindings.

```javascript
[
  // Unbind the default shortcut to accept inline suggestions with tab
  {
    "key": "tab",
    "command": "-editor.action.inlineSuggest.commit"
  },

  // Unbind the default "accept next word" shortcut because it interferes with
  // a common macOS navigation shortcut.
  {
    "key": "cmd+right",
    "command": "-editor.action.inlineSuggest.acceptNextWord",
  },

  // Recommended "accept full suggestion" shortcut. Pick a different key if you
  // often need to type semicolons.
  {
    "key": ";",
    "command": "editor.action.inlineSuggest.commit",
    "when": "inlineEditIsVisible && inlineSuggestionVisible && !editorHoverFocused"
  },

  // Suggested keyboard shortcuts to accept part of a suggestion
  {
    "key": "ctrl+shift+;",
    "command": "editor.action.inlineSuggest.acceptNextLine"
  },
  {
    "key": "ctrl+;",
    "command": "editor.action.inlineSuggest.acceptNextWord",
    "when": "inlineSuggestionVisible && !editorReadonly"
  },

  // Recommended shortcut to toggle inline completions
  {
    "key": "cmd+k cmd+a",
    "command": "github.copilot.completions.toggle"
  }
]
```
