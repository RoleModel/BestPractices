## [Home](../README.md)

## 6. Linear History

At RoleModel we commend the practice of keeping git histories linear. This
document discusses why.

## Two approaches

There are broadly two views on how to structure the history of a git repository:
merging or rebasing. The merge view exhorts thorough reliance on git's
unprecedented ability to create and use _merge commits_, which is simply a
commit with more than one parent. The Linux kernel, which is perhaps the
flagship git project because
[it spawned git](https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git) and
because it has more activity than almost any other project, adheres to this
view. Its maintainers have been known to create "octopus merges" with more than
two parents; in fact,
[one commit has 66 parents](https://www.destroyallsoftware.com/blog/2017/the-biggest-and-weirdest-commits-in-linux-kernel-git-history)!

The other view is to rely on git's ability to _rebase_ commits onto another
commit, which effectively replays the commits onto a new starting point. Using
rebase allows us to have a _linear_ (or at least linearizable) history. You can
see an example of what linear vs. non-linear history looks like in
the [Merge Strategies](merge-strategies.md#background) best practice.

As an aside, those who view the [purpose of git](purpose-of-git.md) as a log
of what happened (rather than a logical history) eschew the use of history
rewriting techniques like `git rebase`, and so take the merge view.

## Recommendation

At RoleModel we recommend linear history in almost all cases. The one exception
is a very short-lived project that is unlikely to have anybody needing to
understand the history.

## Considerations

The main tradeoff that we recognize is time spent creating the history vs. time
spent reading and understanding the history. For long-lived projects, we
optimize for the latter, just as we spend extra development time making the code
legible for later readers. For short-lived projects, however, it may make sense
to optimize for writing rather than reading.

Another consideration is how the two approaches reconcile conflicts, which
happen when git can't figure out how to bring two histories together. In the
merge-based view, a conflict is surfaced during the merge. Resolving the
conflict once is sufficient. In a rebase, however, there is sometimes a repeated
conflict at every new commit that is being replayed. If you rebase before
squashing, as we recommend, this can become annoying fast. Git's `rerere` option
can help with this, which `re`plays `re`corded (conflict) `re`solutions. Note
also that you may be rebasing more commits than you really need to or intend to;
the `--onto` option to `git rebase` can help with this.

One more subtle type of conflict is worth mentioning to illustrate how each
approach handles it. Say you're merging a feature into the current release
branch that changes some interface in your code. Yet, since the time you
branched from the release branch, somebody else committed code that depended on
the old interface. The merging or rebasing can happen without conflicts, but the
code will be broken. In the merge approach, this will be apparent only at the
merge commit, so it's important to run tests locally before pushing the merge
commit, even if there were no conflicts. In the rebase approach, this may be
apparent earlier in the feature branch once rebasing is finished, and one could
amend the commit that changed the interface to also change the new calling code.
But the newly rebased feature branch should be tested before fast-forward
merging into the release branch.

One last consideration is [bisecting](https://git-scm.com/docs/git-bisect). It's
easy to understand how bisecting works with a linear history. With a non-linear
history, it's harder to know how it works and harder to have confidence that the
bisecting process correctly identifies the point of breakage. (However, care
still must be taken not to introduce broken commits into the history, or the
bisection may get caught at that point.)
