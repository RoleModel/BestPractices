---
layout: post
title:  "Squashing Commits"
date:   2015-11-10 00:00:00 -0400
author: Caleb Woods, Jeff Terrell
approver: Ken Auer, Caleb Woods
order: 5
---

At RoleModel we generally recommend the squashing of commits on a feature branch
before merging. This provides the following benefits:

1. Single commit to reference task and PR numbers
   (see [Merge Strategies](merge-strategies))
2. Ease of rebasing features when included in other branches like release
   branches (avoids complicated "rebase thrashing")
3. Single place to provide in depth explanation of the feature (see
   [Commit Messages](commit-messages) best practice)

## Tradeoffs

In some cases, there may be two (or more) logically separated changes that you
want to keep separate. For example, a rule of refactoring is, "First make the
change easy, and then make the easy change"--which really is two logical steps
that are often relatively separate. In that case, using two (or more) commits is
acceptable. The important things are that each commit merged into a release
branch is (1) logically separated from other commits and (2) well described.

Generally speaking, though, it usually makes the most sense to squash all of the
code in a feature branch together.

## Example

Here is an example that we'll squash. Let's assume we have the following state
in our git repository.

```
$ git log --decorate --oneline --graph
* b9f319c (HEAD -> new-branch, origin/new-branch) Update API version
* cab2298 git-ignore more files
* 08139c2 (origin/release-v12, release-v12) [TR#564] Add company codes as message filter parameter
* c46bd09 [TR#672] Create dev API server
* 19ccdc5 [TR#571] Add simple mock-json test for multi-company feature
* c943c35 [TR#650] Improve testing approach for API responses
* 851fcf4 [TR#576] Add saved filters privilege
...
```

From that output we can see that we have two commits unique to our feature
branch. If we rebase onto the `release-v12` branch, we will replay those two
commits onto the current `HEAD` of `release-v12`. By itself this would be
boring, leaving us where we started. But with the `-i` (or `--interactive`)
switch, we can change our instructions to the rebase operation.

```
$ git rebase -i release-v12
```

Running this command will open your editor with something that looks like this:

```
pick cab2298 git-ignore more files
pick b9f319c Update API version
# Rebase 08139c2..b9f319c onto 08139c2
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
```

This shows all the commits that will be replayed. To squash everything into a
single commit we just change every commit after the first to `squash`.
(Abbreviating to `s` works too.)

```
pick cab2298 git-ignore more files
squash b9f319c Update API version
```

(Power tip: if you use vim or a sufficiently vim-like editor, the following
incantation will accomplish this change: `:2,$s/^pick/squash/`)

Save and close the file. That will trigger git to open your editor to edit the
commit message:

```
# This is a combination of 2 commits.
# The first commit's message is:
git-ignore more files
# This is the 2nd commit message:
Update API version
```

Edit this to be the final commit message according
to [our standards](commit-messages).

Save and close the file. You can now see the single commit in the log.

```
$ git log --decorate --oneline --graph
* 6fd7f35 (HEAD -> new-branch, origin/new-branch) [TR#678] <My final commit message>
* 08139c2 (origin/release-v12, release-v12) [TR#564] Add company codes as message filter parameter
* c46bd09 [TR#672] Create dev API server
* 19ccdc5 [TR#571] Add simple mock-json test for multi-company feature
* c943c35 [TR#650] Improve testing approach for API responses
* 851fcf4 [TR#576] Add saved filters privilege
...
```
