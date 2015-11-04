## Merge Commit Format

Use the following format for squashed and merge commit messages.

Note that the extra details should be included in the squashed commits rather than the merge commit.  This is done as the squashed commit is the one that will show up when searching git history.

```
<title of card or summary of feature> [<Task abbreviation> #<task number>] (<Source Control abbreviation> #<Pull Request number>)

<highlights of feature change if any>
```

And example would look like:

```
Return 404 on permissions API when no access [TR #45] (GH #4)

If a user cannot access a study at all we want to be able communicate that to API clients, thus we will return a 404.
```

#### Abbreviations

|Tasks            |Source Control
|:----------------|:-------------
|  TR - Trello    |  GH - Github
|  JI - Jira      |  GL - Gitlab
|  LK - LeanKit   |  BB - BitBucket
|  KB - Kanbanery |
