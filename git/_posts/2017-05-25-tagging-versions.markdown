---
layout: post
title:  "Tagging Versions"
date:   2017-05-25 00:00:00 -0400
author: Jeff Terrell
approver: Caleb Woods
order: 10
---

Or, how to capture relevant information about deployments.

<a name="rationale"></a>
## 0. Rationale

Without a plan, production deployments will happen and information about what
was deployed will be scattered in various places. Hotfixes can add more
complexity and confusion. The need almost invariably arises for a specific
accounting of what was deployed. To that end, I propose the following best
practice.

<a name="levels"></a>
## 1. Levels of information

Git already records commits, which include a summary message by the developer
making the change. This level of information—both the actual files and lines
changed as well as the summary messages—are the ground-level truth of what
changed. It should be possible to easily list the commits specific to a version.

The customer typically does not care about this level of information. Instead,
customers track things at the level of tasks and features. Such features are
typically tracked in Trello or another project management tool as "cards" (or
similar). Cards have an associated identifying number. These card numbers should
be explicitly listed in the information about a deployment using the process
described below.

<a name="versions"></a>
## 2. Versions

Each deployment should have a version number associated with it. There is a
one-to-one relationship between deployments and versions.

The craftsman overseeing a project should decide on a versioning scheme for the
project. One such scheme is described here and used throughout this document,
but others (such as a date-based one) are also acceptable, and may be better in
some cases.

For purposes of illustration in this document, we will use version numbers of
the form `major.minor.patch`, e.g. `2.4.1`, where the patch is optional and, if
not specified, defined to be `0` (so `2.4` is a sort of shorthand for `2.4.0`).
Each regularly scheduled deployment, referred to as a regular deployment, should
result in a new minor version number. In most cases, the minor version number
should be incremented. When the project craftsman deems the new version to be
especially significant, the major version number should be incremented and the
minor version should be reset to 0.

(Note: this approach is similar to, but intentionally different
from, [Semantic Versioning](http://semver.org/), which is a ubiquitous version
numbering scheme more suitable for libraries. The projects targeted by this best
practice document are never included as a dependency of another project.)

A "hotfix" occurs when a bug was deployed to production or if, for some other
reason, a change needs to be deployed outside of the regular schedule. Hotfixes
should increment the patch number. Each new regular deployment should reset the
patch number to `0`.

<a name="tagging"></a>
## 3. Tagging versions

Git supports tags, which are names associated with a specific commit. These tags
may be annotated with a message and sync'd between remotes (e.g. pushed up to
`origin`).

Each version should be tagged with a tag whose name is `v<version>`, e.g.
`v2.4.1`. The tag should be annotated with a message that includes the version
number, a summary if applicable, and a list of the card numbers and card titles
introduced by this version. The cards should be sorted by number. Here is an
example message for a tag named `v2.4.1`:

    Version 2.4.1

    Hotfix to fix a typo and fix a permission

    Includes the following cards from the Trello board:
    - #144 - Correct misspelling of "mispelled"
    - #145 - Blacklist new spammers

When creating a tag with `git tag`, use the `-a` option to create an annotated
tag (i.e. one with a message). When the tag is created, be sure to push the tag
to the server with `git push --tags`.

<a name="deployment"></a>
## 4. Tagging a deployment

Assuming your project follows
the [Release based Branching Strategy](release-branching) best practice,
tagging a deployment is simple, whether it's a regular deployment or a hotfix.
As soon as the release branch or hotfix is merged into master, tag the latest
commit on master, like so:

    git tag -a <tagname> master

For `<tagname>`, use the new version number, as detailed in
<a href="#versions">Section 2</a>. To find the most recent version number (so you
can know what the new one should be), use these commands:

    git fetch --tags  # ensure you have all tag names locally
    git tag -l | grep '^v' | sort -t. -k1,1n -k2,2n -k3,3n | tail -n1

<a name="information"></a>
## 5. Gathering information

<a href="#levels">Section 1</a> described two levels of information: git commits
and customer-visible tasks. Using the process described in this document,
gathering such information is straightforward.

To get a list of commits between two versions `v1.0` and `v1.1`, you can use the
git syntax `v1.0..v1.1`. You can pass this to, for example, `git log`, `git log
--oneline`, or even `git diff`.

To get a list of cards in version `v1.1`, just view the tag's message with
`git show v1.1`.
