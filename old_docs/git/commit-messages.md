## [Home](../README.md)

## 3. Commit Message Format

If [the purpose of git is to record a logical history of what
happened](purpose-of-git.md), then it's essential to have good commit messages,
since they are the substance of the history.

To motivate and describe what constitutes a "good" commit message, we have
found no better resource than [Deliberate
Git](http://rakeroutes.com/blog/deliberate-git) by Stephen Ball.

### Deliberate Git

A brief summary follows, but we recommend reading the whole thing.

- A good commit subject is written in the present tense and as a command.
- Good commit bodies:
  - can be informal,
  - describe the "Why?",
  - are messages to your team, and
  - contain links to more information.
- Well written commits explain:
  - what the code change does,
  - why the change is necessary,
  - alternatives considered, and
  - potential consequences.
- To maintain good development flow, you can use WIP commits and reorganize the
  commits into a logical history later using `git rebase -i`.
- Git commits are searchable in a variety of ways to quickly find a change you
  are looking for.

### Extra Information

At RoleModel, we like to include in the "Subject" line (i.e. the first line of
the commit message) an abbreviated reference to the canonical resource(s)
associated with the change. For example, if a change is for card number 123 on
the project's Trello board, include `[TR #123]`. Also, if there is a
corresponding pull request on Github or your repo host, you can include that
number in parentheses, like `(GH #4)`.

Here's a template to describe what we mean:

```
<title of card or summary of feature> [<board abbreviation> #<card number>] (<source control abbreviation> #<pull request number>)

<highlights of feature change if any>
```

For example:

```
Return 404 on permissions API when no access [TR #45] (GH #4)

If a user cannot access a study at all we want to be able communicate that to API clients, thus we will return a 404.
```

Note: git commits and the code are the sources of truth. External references
made in commit messages may become broken if tools change for managing cards or
PRs. If there is critical information related to the commit, copy it into the
commit message body and consider using fully qualified URLs if you want to
ensure the link will work in the future.

#### Canonical Abbreviations

|Tasks            |Source Control
|:----------------|:-------------
|  TR - Trello    |  GH - Github
|  JI - Jira      |  GL - Gitlab
|  LK - LeanKit   |  BB - BitBucket
|  KB - Kanbanery |
