## [Home](../README.md)

## Release based Branching Strategy

## Overview

```
       G hotfix
       o
A   B / \
o---o----o master
     \
      C   D   E
      o---o---o  release
           \ /
            F
            o feature
```

## Principles

* **master** is always the clean deployable branch for production
* **release branches** are started for each planned released
* **feature branches** are created off a **release branch** and all commits are squashed prior to merging back to **release branch**
  * **squashed commit** should follow the same format of **merge commits**

## Merge Commits

Merge commits and [squashed](squashing.md) commits on feature branches should follow the [Merge Commit Format](merge-commit-format.md).  Example:

```
Add Logstash formatting to logger [JI #MYEDC-7777] (GL #333)

To support sending logs to our ELK stack the logs need to be in a specific format
for processing.

Also:
  * Add logging of all SQL requests to logger
```

When [squashing](squashing.md) commits, add details from the source commits.  Using an `Also` section can be a good way to reuse source commit messages.

## Release branches

Release branches are created off of master and will be "long running" branches while features are being worked on for a release.  Ideally they should not run longer than a release.

The naming for release branches will follow the following format `release_<release-month>_<release-year>`, `release_october_2015`.  Note that you can have multiple **release branches** at once, rebase will be used to update them as things change.

## Feature branches

Feature branches are created off of the release branch they will be merged into.  Work on a branch should be scoped to a single ticket or sub task and broken into logical commits.

After code review is approved on a branch, it should be squashed into a single commit following the merge commit formatting.  This is done for a couple of reasons:

1. Formatting as a merge commit is done as the actual merge commits will be lost when the release branch is rebased on master.
2. Squashing commits means that all the "thrashing" that happens on PR will not need to be resolved when rebasing.

## Hotfix

When master is updated for a hotfix, the release branch will be rebased on master to pickup the fix.

```
       G hotfix
       o
A   B / \
o---o----o master
     \
      C   D   E
      o---o---o  release
```

To update from the above state use:

```
$ git checkout release
$ git rebase master
```

This will result in:

```
       G hotfix
       o
A   B / \
o---o----o master
          \
           H   I   J
           o---o---o  release
```

After the rebase all team members will need to reset their local release branch to match the remote.

This can be done using `git reset --hard` or deleting and re-checking out the branch.

```
$ git fetch
$ git checkout release
$ git reset --hard origin/release
```

or

```
$ git branch -D release
$ git fetch
$ git checkout release
```

In addition when this rebase happens all outstanding **feature branches** will need to be rebased using `git rebase --onto`.  See this [blog post](http://www.calebwoods.com/2014/07/02/rebasing-dependent-feature-branches/) for some details.

Here is a simple example before the **release branch** is rebased:

```
A   B   G
o---o---o master
     \
      C   D
      o---o  release
           \
            F
            o feature
```

After the **release branch** your state will look like:

```
A   B   G
o---o---o master
         \
          H   I
          o---o  release
           \
            C   D   F
            o---o---o feature
```

To clean up use `git rebase --onto`:

```
$ git checkout feature
$ git rebase --onto release F^
```

Which will result in:

```
A   B   G
o---o---o master
         \
          H   I
          o---o  release
               \
                J
                o feature
```
