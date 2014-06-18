## [Home](../README.md)

## Merging Pull Requests

The default merging of Pull Requests on Github provides a less than optimal set of metadata for merged branches.

Because of this the RoleModel preferred method of merging is described below.

### Rebase on Master (or any other target branch)

The process begins by rebasing to master and, possibly, squashing some commits.

Practices and ways to squash commits vary, but the basic process is described [here](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html).  To rebase, switch to the master branch and pull the latest changes to ensure master is up to date, then switch back to your feature branch and rebase your changes on top of master using the following:

```bash
git checkout master
git pull --rebase origin master

git checkout <branch-name>
git rebase master # or target branch
    # this is a good point at which to squash any commits
git push -f origin <branch-name> # force-push rebased branch to remote
```

Note: pushing the rebased branch with a force requires any other members of the team that may have had that branch checked out to reset their local branch to the new state of origin because the history they are using is now out of sync. This can be done with the following commands:


```bash
git checkout <branch-name>
git reset --hard origin/<branch-name>
```

### Merge Feature Branch Locally

After you have rebased your feature branch on master, switch to master and run the following commands to merge your feature branch:

```bash
git checkout master
git merge --no-ff <branch-name> # forces a merge commit and will open commit prompt
```

When running the above command you will be prompted for a commit message for your merge. The commit message should be in the following format:

```
<title of Kanbanery card or summary of feature> [<Task abbreviation> #<Kanbanery task number>] (<Source Control abbreviation> #<Pull Request number>)

<highlights of feature change if any>
```

And example would look like:

```
Return 404 on permissions API when no access [KB #1188645] (GH #4)

If a user no access to a study at all we want to be able communicate that to API clients, thus we will return a 404.
```

#### Abbreviations

* Tasks
  * KB - Kanbanery
  * TR - Trello
  * LK - Lean Kit
* Source Control
  * GH - Github
  * GL - Gitlab
  * BB - BitBucket

### Push the merged changes to the remote

You now have a fully merge repository, but the remote does not.  Push those changes now.

```git push
```

### Cleanup

Finally, once you have merged your feature branch, push your changes to the remote repository and delete the branch:

```git push
git push origin --delete <branch-name>    # or shortcut: git push origin :<branch-name>
git branch -d <branch-name>
```

At this point your changes are merged into the remote repository and the completed branches have been removed.  

### Dependent Feature Branch

Although the goal of our workflow and tight feedback cycle is to have each developer keep only Pull Request open at a time there can be situation where you will need code that is in a 1st feature branch that hasn't been merge to complete a 2nd feature branch.

In that case we have preferred strategy of branching and rebasing. Lets do an example with branches named `master`, `feature1`, and `feature2`. Let say you completed your `feature1` branch, but need a class it added to complete `feature2`. First thing you should do is try to get `feature1` merged to `master`, but if that's not possible then the best strategy is to branch off of `feature1` to create `feature2`.

Now that you have these dependent features they will need to merge into master eventually. When that time come it's best to follow the normal procedure to rebase and merge `feature1` into master and then do the same with `feature2`. This will ensure that your changes are not duplicated and the history will cleanly show the 2 different features.

The other option you have in this situation is to branch `feature2` off of `master` and merge `feature1` into `feature2`. While this will work it's not as clean as the rebasing option and will most likely make your final merging more difficult if you have any merge conflicts.

### How this affects Git history

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

Additionally if you want to only the individual commits of the history you can use the following to remove the merge commits from the view of the log:

```
git log --no-merges --oneline
```
