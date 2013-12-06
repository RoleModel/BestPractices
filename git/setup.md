## [Home](../README.md)

## Setting up git

If git is not installed it can be install via homebrew or by downloading the XCode command line tools.  The homebrew installation is listed below.

In addition to git it is recommend to also install [hub](https://github.com/github/hub) a command line tool which adds additional git functionality for working with Github.  The normal installation of hub is to alias hub to git as hub will automatically delegate any commands it doesn't recognize directly to git.

```
brew install git
brew install hub

# in .bash_profile add
alias git="hub"
```

## Additional config

It is recommended set the follow configurations for git to make your life easier.

First get all the colors.  The following command turn on colors so the diffs and other terminal output by git will be color coded.

```bash
git config --global color.ui auto
```

Set your default push to tracking.  Avoid having to type extra characters and prevent accidentally pushing feature branch to master it recommended to set your default push setting to tracking using the following.

```bash
git config --global push.default tracking
```

Next time you want to push a just run `git push`, if you haven't pushed the branch before you will get an error that there is no tracking branch and a command you can copy to set the tracking branch to be one on origin with the same name.  This command will look similar to the following.

```bash
git push
# error no tracking branch
git push --set-upstream origin feature_branch
```

## Aliases

Many developers like to make aliases for common git commands to save time and typing.  These can come in two forms git aliases and bash aliases for git commands.

### Git Aliases

Below are commands to setup the a standard git alias.

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch

```

Git aliases can also be used to encapsulate commonly used commands and argument combinations.

```bash
git config --global alias.aa add --all
git config --global alias.d diff --staged
git config --global alias.count shortlog -sn
git config --global alias.l log --pretty=format:%C(yellow)%h%Cblue%d%Creset %s %C(white) %an, %ar%Creset --graph
```

### Git Bash Aliases

The most common git command to be aliased is `git status`.  Many developers will alias that command to 1 or 2 characters by adding one of the following to their `.bash_profile`

```bash
alias gs="git status"
# or
alias s="git status"
# or for shorter terminal output
alias gs="git status -sb"
```

## Git Status in Command Prompt

Another useful part of git config is to have the branch names and status of the working directory expressed in your command prompt when in a git repo. Below is an example you can add to your `.bash_profile` as are starting point.

```bash
# in .bash_profile
function _git_color() {
  `command git branch > /dev/null 2>&1`; if [ $? -eq 0 ]; then
    clean=`command git status | grep "nothing to commit" | wc -l`
    if [ "$clean" -eq "1" ]; then
      echo '\e[0;32m'; else # clean working directory
      stagged=`command git status | grep "not staged for commit" | wc -l`
      if [ "$stagged" -eq "1" ]; then
        echo '\e[1;31m'; else # unstagged changes
        echo '\e[1;33m'; # all changes stagged
      fi;
    fi;
  fi;
}

function minutes_since_last_commit {
    now=`date +%s`
    last_commit=`command git log --pretty=format:'%at' -1 2>/dev/null`
    if $lastcommit ; then
      seconds_since_last_commit=$((now-last_commit))
      minutes_since_last_commit=$((seconds_since_last_commit/60))
      echo $minutes_since_last_commit
    else
      echo "-1"
    fi
}

# Show branch in status line
PS1='\n\w$(__git_ps1 " (`_git_color``minutes_since_last_commit`|%s\e[00m)")\n\$ '
```
