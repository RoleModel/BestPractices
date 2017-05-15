## [Home](../README.md)

## Merging Pull Requests

The default merging of Pull Requests on Github provides a less than optimal set of metadata for merged branches.

Because of this the RoleModel preferred method of merging is described below.

### Rebase on Master (or any other target branch)

The process begins by rebasing to master and [squashing](squashing.md) your commits.

To rebase, switch to the master branch and pull the latest changes to ensure master is up to date, then switch back to your feature branch and rebase your changes on top of master using the following:

```bash
git checkout master
git pull --rebase origin master

git checkout <branch-name>
git rebase master # or target branch
#<-- squash commits
git push -f origin <branch-name> # force-push rebased branch to remote
```

Note: Any other members of the team that may have had your branch checked out now must reset their local branch to the new state of origin because the history they are using is now out of sync. This can be done with the following commands:

```bash
git fetch
git checkout <branch-name>
git reset --hard origin/<branch-name>
```

### Merge Feature Branch Locally

After you have rebased your feature branch on master, switch to master and run the following commands to merge your feature branch:

```bash
git checkout master
git merge --no-ff <branch-name> # forces a merge commit and will open commit prompt
```

When running the above command you will be prompted for a commit message for your merge. The commit message should follow the [Commit Messages](commit-messages.md) best practice.

### Push the Merged Changes to the Remote

Your merge is now completed locally but needs to be updated on the remote repository.

```bash
git push origin master
```

### Cleanup

Finally, once you have merged your feature branch, use these commands to push your changes to the remote repository and delete the branch:

```bash
git push origin --delete <branch-name>    # or shortcut: git push origin :<branch-name>
git branch -d <branch-name>
```

At this point your changes are merged into the remote repository and the completed branches have been removed.

### How This Affects Git History

The benefit of this strategy is that you can view the process of your feature branches (a high level changelog) by running the following:

```
git log --merges --oneline
```

This can be especially useful when paired with the `--since` option to see the features merged since a date in time, such as the last time you worked on the project:

```bash
git log --merges --oneline --since=yesterday
git log --merges --oneline --since=-7days
git log --merges --oneline --since=2013-11-19
```

Additionally, if you want to use only the individual commits of the history, you can use the following to remove the merge commits from the view of the log:

```
git log --no-merges --oneline
```
