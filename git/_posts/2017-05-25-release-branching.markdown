---
layout: post
title:  "Release Branching"
date:   2017-05-25 00:00:07 -0400
---

## Release Based Branching Strategy

This document outlines the use of a "release branch" to collect features
intended for a specific release before they are merged into the master branch,
including tradeoffs of release branches and an extended example of applying a
hotfix.

## Overview

```
       H hotfix
       o
A   B /
o---o master
     \
      C   D   E
      o---o---o  release
           \
            F
            o feature
```

## Principles

* **master** is always the clean deployable branch for production.
* **release branches** are started for each planned released.
* **feature branches** are created off a **release branch** and commits are
  typically squashed prior to merging back to **release branch**.

## Tradeoffs

Note: some projects at RoleModel do not have a release branch and instead merge
feature branches directly into `master`. What are the tradeoffs of this
decision?

* Without a release branch, it's harder (though not impossible) to maintain the
  property that `master` should always be ready for deploying to production. If
  you don't maintain that property, it requires more discipline to know which
  commits on `master` are safe for deployment.
* With a release branch, it's harder to apply hotfixes. A thorough example of
  the process is described below, including the necessary use of `git rebase
  --onto`. Without a release branch, rebasing atop a hotfix is no different
  than rebasing atop a merged feature.

## Release branches

Release branches are created off of master and will be "long running" branches
while features are being worked on for a release.  Ideally they should not run
longer than a release.

The naming for release branches will follow the following format
`release_<release-month>_<release-year>`, `release_october_2015`.  Note that
you can have multiple **release branches** at once, rebase will be used to
update them as things change.

## Feature branches

Feature branches are created off of the release branch they will be merged
into.  Work on a branch should be scoped to a single ticket or sub task and
broken into logical commits.

After code review is approved on a branch, the commits should be squashed
according to the [Squashing Commits](squashing) best practice.

## Hotfixes

When a bug is discovered that needs an urgent fix deployed to production,
create a hotfix branch from `master`:

```
       H hotfix
       o
A   B /
o---o master
     \
      C   D   E
      o---o---o  release
```

When the hotfix is ready, merge it into master and deploy to production:

```
A   B   H
o---o---o master
     \
      C   D   E
      o---o---o release
```

Next, you need to incorporate the hotfix into the `release` branch:

```
$ git checkout release
$ git rebase master
```

This will result in:

```
A   B   H
o---o---o master
         \
          C'  D'  E'
          o---o---o release
```

After the rebase all team members will need to reset their local release branch
to match the remote.

This can be done using `git reset --hard` or deleting and re-checking out the
branch.

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

### Syncing with other developers

Finally, tell the other developers on the project to reset their local release
branches to the remote release branch, since the history of the remote release
branch has changed. Assuming the developer has no unpushed commits on their
local release branch:

```
$ git checkout release
$ git fetch
$ git reset --hard origin/release
```

Otherwise, if they do have unpushed commits on their local release branch, the
following will work in most cases (but you can `git show origin/release@{1}` or
even `git log origin/release@{1}..` to see which commits you're about to rebase
onto `origin/release`; do `git reflog --help` for more info):

```
$ git checkout release
$ git fetch
$ git rebase --onto origin/release origin/release@{1}
```

## Rebasing feature branches

In addition when this rebase happens all outstanding **feature branches** will
need to be rebased using `git rebase --onto`.  See this [blog
post](http://www.calebwoods.com/2014/07/02/rebasing-dependent-feature-branches/)
for some details. Note: this is complicated stuff. If in doubt, ask your
project craftsman for help.

Here is a simple example before the **release branch** is rebased:

```
A   B   H
o---o---o master
     \
      C   D
      o---o  release
           \
            F
            o feature
```

After rebasing the **release branch** your state will look like:

```
A   B   H
o---o---o master
     \   \
      \   C'  D'
       \  o---o  release
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
A   B   H
o---o---o master
         \
          C'  D'
          o---o  release
               \
                F'
                o feature
```

If you have more than one commit unique to the feature branch, `F` should be
the first (i.e. earliest) of them. If you don't know which one that is, you
have a few options:

* If you haven't pushed master to origin yet, then `git log --oneline
  origin/master..feature` will list the commits that are in the `feature`
  branch and not in the `origin/master` branch.
* Rely on `git log` and your memory.
* If all else fails, you can use the git reflog to tell you what commit the
  `release` branch used to point to. If you followed these instructions,
  `release@{1}` will be the commit the `release` branch pointed to before it
  was rebased. Assuming that's true, `git log release@{1}..feature` will list
  the commits unique to the feature branch, which you can use to find your `F`.
