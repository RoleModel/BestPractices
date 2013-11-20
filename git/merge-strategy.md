## [Home](../README.md)

## Merging Pull Requests

The default merging of Pull Requests on Github provides a less than optimal set of meta for merged branches.

Because of this the RoleModel preferred method of merging is described below.

### Rebase on Master

Before you merge rebase and squash commits as needed.  To do this from the command line you you switch to the master branch and pull the latest changes to ensure master is up to date.  Then switch back to your feature branch and rebase your changes on top of master using the following.

```bash
git rebase master
```

### Merge Feature Branch Locally

After you have rebase your feature branch on master, checkout master and run the following command to merge your feature branch.

```bash
git checkout master
git merge --no-ff <branch-name>
```

When running the above command you will be prompted for a commit message for your merge.  The commit message should be in the following format.

```
<title of Kanbanery card or summary of feature> [#<Kanbanery task number>] (#<Pull Request number>)

<highlights of feature change if any>
```

And example would look like

```
Return 404 on permissions API when no access [#1188645] (#4)

If a user no access to a study at all we want to be able communicate that to API clients, thus we will return a 404.
```

### How this affects Git history

The benefit of this strategy is that you can view the process of your feature branches (a high level changelog) by running the following.

```
git log --merges --oneline
```

This can be especially useful pair with the `since` option to see the features merge since a date in time, such as the last time you worked on the project.

```bash
git log --merges --oneline --since=yesterday
git log --merges --oneline --since=-7days
git log --merges --oneline --since=2013-11-19
```

Additionally if you want to only the individual commits of the history you can use the following to remove the merge commits from the view of the log.

```
git log --no-merges --oneline
```
