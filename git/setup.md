## [Home](../README.md)

## 0. Setting up git

If git is not installed, it can be installed via your operating system's package
manager (e.g. Homebrew on MacOS).

We recommend also installing [hub](https://github.com/github/hub), a
command-line tool which adds additional git functionality for working with
Github. (It's also available in Homebrew on MacOS.) The normal installation of
hub aliases the `git` command to call `hub`, because hub will automatically
delegate any commands it doesn't recognize directly to git. To do that, add a
line like the following to your shell's initialization file (`~/.bash_profile`,
or `~/.zprofile` for zsh):

```
alias git='hub'
```

## Aliases

Many developers like to make aliases for common git commands to save time and
typing. These can come in two forms: git aliases and shell aliases for git
commands.

### Git Aliases

Below are commands to setup the a standard git alias.

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
```

For example, with these aliases installed, `git st` is an alias for
`git status`.

Git aliases can also be used to encapsulate commonly used commands and argument
combinations.

```bash
git config --global alias.aa 'add --all'
git config --global alias.d 'diff --staged'
git config --global alias.pf 'push --force-with-lease'
git config --global alias.l1 'log --graph --decorate --oneline'
git config --global alias.l2 'log --pretty=format:"%C(yellow)%h%Cblue%d%Creset %s %C(white) %an, %ar%Creset" --graph'
```

Aliases can also be set by editing your `~/.gitconfig` file in the `[alias]`
section. See the `git-config(1)` man page for more information.

### Shell Aliases

The most common git command to be aliased is `git status`. Many developers will
alias that command to 1 or 2 characters by adding one of the following to their
`.bash_profile` (or `.zprofile` for zsh).

```bash
alias gs="git status"
# or
alias s="git status"
# or for shorter terminal output
alias gs="git status -sb"
```

## Git Status in Command Prompt

Another useful part of git config is to have the branch names and status of the
working directory expressed in your command prompt when in a git repo. For bash,
check out [bash-git-prompt](https://github.com/magicmonty/bash-git-prompt). Zsh
ships with git completion and prompt support; for more information, see
[this appendix in the git book](https://git-scm.com/book/en/v2/Appendix-A:-Git-in-Other-Environments-Git-in-Zsh).

## Two-factor Authentication

Some code that we have access to is confidential. It's not a bad idea to enable
two-factor authentication (2FA) for your git service accounts like
[Github](https://help.github.com/articles/about-two-factor-authentication/)
and
[Gitlab](https://docs.gitlab.com/ce/user/profile/account/two_factor_authentication.html).

Note: 2FA based on SMS messages
[is not secure](http://www.forbes.com/sites/laurashin/2016/12/20/hackers-have-stolen-millions-of-dollars-in-bitcoin-using-only-phone-numbers/).
For better security, use an app on your mobile phone like Google Authenticator.
