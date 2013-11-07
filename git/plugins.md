## [Home](../README.md)

# Plugins

## Command Line Autocomplete

This plugin provides support for autocompleting:
* local and remote branch names
* local and remote tag names
* `.git/remotes` file names
* git `subcommands`
* tree paths within `ref:path/to/file` expressions
* common --long-options

1. Copy [this script](Resources/git-completion.bash) to your home directory in a file named 'git-completion.bash'
2. Add this line to your `~/.bash_profile`

```bash
# Git tab completion
source ~/git-completion.bash
```

This script will now autocomplete when you press <kbd>Tab</kbd> when using commands such as:
```bash
git checkout my_branch # my_branch will be autocompleted
git tag -d my_tag # my_tag will be autocompleted
```