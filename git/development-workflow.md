## [Home](../README.md)

## 2. Git Development Workflow

This document describes the high-level process of using git as part of the
software development process, including development commits, rewriting history,
code reviews, squashing, rebasing, and merging.

### Check project README

Not all projects will conform exactly to our git best practices. Some are
deliberate deviations; others are accidental. As a first step, check the project
README for any mention of how to use git. Project-level instructions should
supercede general best practices.

### Create a branch

Start by creating a branch from the [release branch](release-branching.md) or
from the master branch if your project is not using the release branch strategy.
Switch to your new branch.

### Develop

Now, implement the feature. The focus is generally on development, not using
git, during this phase. Some developers will not use git at all until the entire
feature is done. Others will add code to the index when it feels done, but
commit only at the end. Others will create terse work-in-progress (WIP) commits
as they go. Still others will take the time to create commits that are cleanly
separated in functionality and well described.

Any of these approaches is acceptable. It is useful to maintain your development
flow and not get hung up on git. However, note that it is a kindness to your
reviewer to have good logical commits, and commits are generally easier to
combine than to separate, so you may find the overall development process easier
if you bias towards many small commits rather than committing at the end.

### Prepare the development story for your reviewer

Next, tell a logical story of how this feature came to be, in preparation for
your reviewer seeing your code. As described
in [The Purpose of Git](purpose-of-git.md), we don't recommend using git as a
log of _what happened_ but rather as a _readable history_. At a high level, the
difference is that the latter will contain cleanly separated and well described
commits.

Unless you were disciplined with your development process and already have a
good story in your commit messages, you will need to rewrite history. Our
general recommendation is to use `git rebase -i` for
this. [Commit Messages](commit-messages.md) talks more about what a good
history looks like and includes a tutorial of using `git rebase -i`. Just
remember: the point is to explain what you did, and why, to your reviewer, so
that he doesn't get a large glob of changes with no explanation.

### Open a pull request

Once your history of changes is ready for review, open a pull request (called a
merge request in Gitlab). Inform your reviewer that the code is ready for
review.

### Respond to code review comments

Sometimes your reviewer will approve your code as-is, with no revisions needed.
Other times, he may have questions about what you did or why you did it that
way. Other times, he may want you to change what you did in some respects,
either by yourself or in a pairing session.

If you do need to change your code, append new commits to the history rather
than rewriting history. Once your reviewer has read your history, don't change
the story on him. If various kinds of changes (or "fixups") are needed, keeping
each kind in its own commit is a kindness to your reviewer, since it keeps
related changes closer together.

### Merge your branch

When your code is approved to be merged, there are a few things to do to ensure
clean merging: rebase, squash, merge, push, and clean up.

#### Rebase

To ensure a [linear history](linear-history.git), it's important to rebase
your branch onto the `HEAD` of the
current [release branch](release-branching.md). First, fetch the latest code
from `origin`. Then rebase your code onto it.

#### Squash

Once your branch is rebased, [squash your commits](squashing.md). In most
cases, a feature is a good granularity for commits at this level. Again,
the [Commit Messages](commit-messages.md) best practice provides a good way
to think about this issue.

#### Merge

Next, merge your branch into the release branch, typically with the `--ff-only`
option to `git merge`. More details can be found in
the [Merge Strategy](merge-strategy.md) best practice.

#### Push

Next you need to push your local updates to the `origin` remote, so that others
will see your changes.

If you get an error that a fast-forward merge was not possible, it may mean that
somebody else pushed commits to the release branch, and you need to fetch the
latest commits and rebase again.

You should be careful to push your local feature branch (typically using the
`--force-with-lease` option to overwrite history on the remote) before you push
your local release branch so that your pull request (or merge request) is
correctly marked as "merged".

#### Clean up

Finally, your feature is done and merged into the release branch. Delete your
feature branch, both locally and on the `origin` remote, so that it doesn't
linger and clutter the list of open branches.

### Appendix: git command reference

So far, we've elided the commands one would use during development, in order not
to distract from the concepts. We include them here for completeness.

To create a new branch named `feature` that branches from `release`, and
simultaneously switch to the `feature` branch, say:

```
git checkout -b feature release
```

To create commits during development, say `git status` and follow the
instructions to add and remove files from the index, or staging area for changes
before they are committed. When you're ready to create a commit from what's in
the index, say `git commit`. (You may want to set your `$EDITOR` environment
variable before you do.)

To rewrite history, we recommend reading
[the relevant section from the Pro Git Book](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History).
Don't worry too much about messing things up. If you do, you can abort any
in-progress rebase or, worst case, simply reset your branch to be what's on
`origin`. Remember that your local changes (including rebases) aren't published
until you `push`. If you're intimidated, ask for help.

To open a pull request, you can use the web-based UI of GitHub or Gitlab. Or, if
GitHub is your `origin`, you can use the `hub` command for to open a preview
page for the pull request. The following instructions assume `git` is aliased to
`hub`, which is common practice when using `hub` since it passes unrecognized
commands through to `git`.

```
git checkout feature        # switch to your feature branch
git push -u origin feature  # push it to `origin`
git compare feature         # use the `hub` command to open a comparison webpage
```

To respond to code review comments, you're usually stuck with the web UI and in
some cases email replies. If you want to add new commits to your pull request:

```
# on your `feature` branch
# do normal development, including `git add` and `git commit`
git push
```

To rebase your `feature` branch onto the latest `release` branch:

```
git checkout release
git pull
git checkout feature
git rebase release
```

If you run into problems with the rebasing, it helps to remember what rebasing
is actually doing: it replays commits onto a new starting point (the updated
`release` branch in this case). `git status` can help orient you to where you
are in the rebase process. Also, `git rebase --onto` is helpful to more
precisely specify which commits should be replayed where, and `git rebase -i` is
helpful to provide a preview of which commits are getting replayed before it
actually happens. But, this is perhaps the most tricky part of using git, and it
does take a while to orient to what's going on. Don't be afraid to ask for help.

Assuming you escaped from the rebase unscathed, you can squash your commits with
`git rebase -i`, which opens up a text editor. If you change the commands in all
but the first line to `squash`, all of your commits will be squashed into the
first one, and you will have the chance to combine the commit messages before
everything is committed. For more information, read
[the Pro Git book](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#_squashing) or
[Deliberate Git](http://www.rakeroutes.com/blog/deliberate-git/).

To merge your squashed `feature` branch into `release`, say:

```
git checkout release
git merge --ff-only feature
```

To push your changes up, say:

```
git checkout feature
git push
git checkout release
git push
```

The ordering is important here, so that any open PRs will get marked as "merged"
instead of merely "closed".

If your last `git push` was rejected, it probably means that somebody else
pushed commits to `origin/release` before you could. In that case, from the
`release` branch, say:

```
git fetch origin
git rebase origin/release
git push
```

To delete your feature branch locally and on `origin`, say:

```
git branch -d feature
git push origin --delete feature
```
