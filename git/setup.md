## [Home](../README.md)

## Setting up git

brew install git
brew install hub

alias git="hub"

## Creating a pull-request

```
# On master
git checkout -b my_feature_branch
git push -u origin my_feature_branch
```

Then, make your commits and push them. Now, compare your branch with master through github by running this:

```git compare my_feature_branch```

This will open a github page where you can make your new pull-request with a title and description.