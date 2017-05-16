## [Home](../README.md)

## 5. Merge Strategies

Once your feature branch is approved by a reviewer and ready to merge, how do
you merge it into the [release branch](release-branching.md)?

The [Git Development Workflow](development-workflow.md) best practice
describes the process at a high level, including rebasing, squashing, merging,
pushing, and cleaning up. This document provides more detail about the merge
step.

### Background

There are two types of merges: fast-forward (FF) merges and non-fast-forward
(non-FF) merges. Also, non-FF merges can be _linearizable_, meaning there is no
ambiguity about the logically linear ordering of commits. Note that linearizable
non-FF merges can be reduced to a FF merge, a property that we discuss below.

Let's consider the difference with an example. Say this is your starting point
(ignoring the complexity of a release branch for now):

```
A   B   C
o---o---o master
     \
      F   G
      o---o feature
```

A non-linearizable non-FF merge of `feature` into `master` would look like this:

```
A   B   C    M
o---o---o---o master
     \     /
      F   G
      o---o feature
```

Here `M` is a _merge commit_, which is a commit with more than one parent
commit. Note that even if the `feature` branch is deleted, the structure of the
commit history remains the same, and `M` is still needed.

The other two examples require rebasing `feature` onto master first, resulting
in:

```
A   B   C
o---o---o master
         \
          F'  G'
          o---o feature
```

Now a _linearizable_ non-FF merge is possible, which looks like this:

```
A   B   C        M'
o---o---o--------o master
         \      /
          F'  G'
          o---o feature
```

In this case, we still have a merge commit `M'` with two parents. And again,
even if the `feature` branch is deleted, the git history still contains the
above structure because of the merge commit. The history is linearizable
because, despite the merge commit, there is no ambiguity about the logical
ordering of commits. More technically, this is true because there is no overlap
between the two parents of `M'`: all the commits of one branch (the feature
branch) come after all the commits of the other branch (the master branch).

Lastly, with a rebased `feature` branch, we can instead to a FF merge, which
looks like this:

```
A   B   C   F'  G'
o---o---o---o---o master, feature
```

In this case, there are no merge commits and a simple linear structure. Deleting
the `feature` branch again has no consequence on the structure of the history
but merely removes the label.

### Recommendation

As described above, there are three types of merge strategies:

1. non-linearizable non-FF merges (discouraged)
2. linearizable non-FF merges (sometimes useful)
3. FF merges (recommended)

The value we generally prioritize at RoleModel is understandability for humans.
In terms of git, we want humans reading the git history to be able to navigate
and understand the history as easily as possible.

For that reason, we discourage Strategy 1. Although such merges tend to be
easier to create since no rebasing is required, they are in almost every case
harder for humans to understand and reason about. This is primarily because they
are not linearizable. (You can read more about the tradeoffs of linear histories
in the [Linear History](linear-history.md) best practice.)

We encourage the use of Strategy 3. Just as FF merges were easier to explain
above, they are also easier to understand and reason about. They can be more
complicated to create because you must rebase, but we generally find the cost to
be worth paying in all but short-lived projects.
(The [Purpose of Git](purpose-of-git.md) best practice discusses this
tradeoff at a more philosophical level.)

Finally, we consider it useful on occasion to use Strategy 2, when it is worth
recording in the historical record the fact that multiple commits are closely
related. We discourage Strategy 2 if there is only a single commit to be merged,
since the merge commit itself provides no additional information. **Note that
merge commits can be lost in `git rebase` events and will not show up in `git
blame` lists.**

### Appendix: git commands

So far, we've elided the commands one would use to create the various kinds of
history, in order not to distract from the concepts. We include them here for
completeness.

To create a non-linearizable non-FF merge of `feature` into `master`, say:

```
git checkout master
git merge --no-ff feature
```

To rebase feature onto the latest commit(s) of `master`, say:

```
git checkout feature
git rebase master
```

To create a linearizable non-FF merge (assuming the above rebase step has
already happened), do the same `--no-ff` merge as above:

```
git checkout master
git merge --no-ff feature
```

To create an FF merge (assuming the above rebase step has already happened and
the commits are already [squashed](squashing.md) as necessary), say:

```
git checkout master
git merge --ff-only feature
```

Typically, you will want to delete the `feature` branch (locally and on
`origin`) after it has been merged into `master`. To do that, assuming you're
already on the `master` branch, say:

```
git branch -d feature
git push origin --delete feature  # or `git push origin :feature`
```
