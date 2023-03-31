---
layout: post
title:  "The Purpose of Git"
date:   2017-05-25 00:00:01 -0400
---

### Or: Philosophy of Git

## Abstract

Use git to tell a story rather than to strictly record what happened.

## Two views

There are two competing philosophies for how to use git. One view says that git
should record _what happened_. What series of steps did the developers take
to add this feature? The other view says that git should record _why things
came to be as they are_. We'll call the former view the _git as log_ view and
the latter view the _git as history_ view.

## Our recommendation

At RoleModel, we prefer the _git as history_ view. A log generally has less
meaning to humans than a history. Although logs in general contain more data
and often can be composed into a variety of stories, neither of these values is
particularly useful in a git context: the commit contains all the change-level
data of interest, and a variety of stories isn't useful.

Just as histories are more interesting and meaningful for humans to read than a
daily chronicle of what happened when, so a history-based view of git will be
more useful for (present and future) developers on a project.

Also, at RoleModel we sometimes go to some length to ensure that the code we
create is legible to humans (especially those hypothetical humans not yet on
the project). We consider it worth the effort in all but very short term
projects to optimize for the reader of code rather than the writer of code.

We apply the same argument to git messages. It is definitely more difficult to
rewrite history with git than to merely record what happened. You must learn
(and, indeed, get comfortable with) `git rebase`, for example. But all future
readers of the code will have an easier time understanding what happened.

## Tradeoffs

As with spikes and other short-lived projects, where code legibility is often
not worth the cost of slower development speed, it may make sense for
short-term projects to use a log-based view of git.
