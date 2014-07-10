## [Home](../README.md)

# Pull-Requests with Git

## Creating a pull-request

```
# On master
git checkout -b my_feature_branch
git push -u origin my_feature_branch
```

Then, make your commits and push them. Now, compare your branch with master through github by running this:

```git compare my_feature_branch```

This will open a github page where you can make your new pull-request with a title and description.

## Converting an existing GitHub issue to a pull-request

This is useful if you have an issue that is more of a subtask of a real task on Kanbanery and have listed several of these as [GitHub issues](https://github.com/blog/831-issues-2-0-the-next-generation).

Make sure you have `hub` installed and that you are on the feature branch that you've made from the instructions above. Then, simply run this command:

```bash
# Replace 42 with the issue number
$ git pull-request -i 42
```

For more information on the options you can specify when converting an issue to a pull-request, see [this blog post](http://opensoul.org/blog/archives/2012/11/09/convert-a-github-issue-into-a-pull-request/).
