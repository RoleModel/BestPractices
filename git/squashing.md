## [Home](../README.md)

## Squashing Commits

At RoleModel we recommend the squashing of commits on a feature branch before merging.  This provides the following benefits:

1. Single commit to reference task and PR numbers (see [Merge Strategy](merge-strategy.md))
2. Ease of rebasing features when included in other branches like release branches (avoids complicated "rebase thrashing")
3. Single place to provide in depth explanation of the feature (see [Better Communication and Documentation with Git](http://rolemodelsoftware.com/blog/communicating-better-with-git.html))

## Example

Here is an example that we'll squash.  Let's assume we have the follow state to our git repo.

```
$ git log --oneline --graph
* 1f80132 recommend advanced notice for extended time off
* 57ae0ea Change Skype standup to Slack standup
* 4f91fe4 Fix standup link
* 5eb055d Change Skype Standup document to focus on Slack
*   7aca5e2 Add Rails upgrade checklist
|\
| * 4e1f379 Add start of Rails upgrade checklist
```

From that output we can see that `5eb055d` is the first commit of our branch.  We'll use that in our command to initiate the rebase:

```
$ git rebase -i 5eb055d^
```

You can rebase that as "rebase interactively starting with the base of parent comment of `5eb055d`".  This means `5eb055d` and all later commits will be included in our rebase.

Running this command will open your editor with something that looks like this:

```
pick 5eb055d Change Skype Standup document to focus on Slack
pick 4f91fe4 Fix standup link
pick 57ae0ea Change Skype standup to Slack standup
pick 1f80132 recommend advanced notice for extended time off

# Rebase 7aca5e2..1f80132 onto 7aca5e2
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
```

This shows all the commits that will be replayed.  To squash everything into a single commit we just change every commit after the first to squash:

```
pick 5eb055d Change Skype Standup document to focus on Slack
squash 4f91fe4 Fix standup link
squash 57ae0ea Change Skype standup to Slack standup
squash 1f80132 recommend advanced notice for extended time off
```

Save and close the file.  That will trigger git to open your editor to edit the commit message:

```
# This is a combination of 4 commits.
# The first commit's message is:
Change Skype Standup document to focus on Slack

# This is the 2nd commit message:

Fix standup link

# This is the 3rd commit message:

Change Skype standup to Slack standup

# This is the 4th commit message:

recommend advanced notice for extended time off
```

Edit this to be the final commit message according to [our standards](merge-commit-format.md), which may look something like:

```
Refactor Standup document to reference Slack [TR #435] (GH #45)

Also added requirements for a `timeoff` section to the checkin format.
```

Save and close the file.  You can now see the single commit in the log.

```
$ git log --oneline --graph
* 6fd7f35 Refactor Standup document to reference Slack [TR #435] (GH #45)
*   7aca5e2 Add Rails upgrade checklist
```
