# Exercise 11e: GitHub Actions

## Setup

This exercise reuses the existing repository. Exercise 2 is in `Exercise 2/`
(with a space), while its npm manifest and lockfile are at the repository root.
The remote is the [existing GitHub repository][repo]. Private visibility and
the teacher's accepted access are pending confirmation in GitHub Settings.

A personal GitHub repository has one owner. It can invite the teacher as a
collaborator, but cannot add a second owner. If the assignment requires an
actual Owner role, confirm the school organization setup with the teacher
before changing repository ownership or granting organization-wide access.

## External Actions and Security

I choose actions from their original repositories and review `action.yml`,
the release notes, and the source or entry point the action runs. I check who
maintains the project, when it last shipped or received fixes, and whether
reported security issues get addressed. I check token permissions and which
inputs can come from untrusted contributors. I also look for bundled npm
dependencies, container images, or downloads that could change independently.
Marketplace presence alone does not establish trust.

Every external `uses:` reference pins a full 40-character commit SHA. A tag
such as `v7` can move, but the SHA identifies the exact reviewed revision.
For each action I used `git ls-remote --tags` against the original `OWNER/REPO`
and matched the exact version tag. Where Git returned a `^{}` line for an
annotated tag, I used the peeled commit, not the tag object. I read the action
manifest at the resulting SHA and double-checked the three third-party
releases with `git rev-parse HEAD` after checking out their exact tags.

- [Checkout v7.0.1][checkout]: GitHub-maintained; uses `contents: read`.
- [Setup Node v7.1.0][setup-node]: GitHub-maintained; installs a Node runtime.
- [Comment Pull Request v3.0.1][comment]: community action; source posts
  through the GitHub API using the job token. Its pin dates to November 2024.
- [Markdownlint CLI2 v25.0.0][markdown]: community action; the October 2026
  pin wraps `markdownlint-cli2` 0.24.0 and fails on rule violations.
- [Scan Virus v0.20.1][scan]: community action; the October 2023 pin pulls a
  GHCR container by version tag rather than digest. The action SHA does not
  pin that image or the signature database. Check that the release still
  downloads signatures, and reassess both maintenance and dependency risk
  before promoting it to a required production check.

See GitHub's [secure use reference][security] for its pinning guidance.

## Task 1: CI

- `pull_request` runs on PRs targeting `main` when opened, updated with new
  commits (`synchronize`), or reopened. `schedule` and `workflow_dispatch`
  also allow a weekly run and a manual run.
- `ubuntu-latest` selects a hosted Linux runner. `contents: read` lets the
  job read the repository without granting write access.
- Checkout retrieves the code being checked without persisting the token in
  the local Git setup. Setup Node puts the selected Node.js and npm on `PATH`.
- `22.x` is a valid version range for the Node 22 LTS line. It matches the
  local Node major version, meets the toolchain requirements, and permits
  supported patch updates without moving to a new major version.
- `npm ci` installs from the committed lockfile at the repository root. It
  removes any existing `node_modules` and does not rewrite the manifest or
  the lockfile. It fails if the lockfile is missing or out of sync with
  `package.json`. `npm install` can resolve dependencies again and update
  the lockfile, which is useful when changing dependencies, not validating a
  known dependency tree. See the [npm ci documentation][npm-ci].
- `npm run lint` checks Exercise 2 with ESLint; `npm run format:check` checks
  Prettier style without rewriting files; `npm test` runs Mocha assertions.
  The old placeholder and write-mode format scripts were removed.

A clean local install passed lint, formatting, and both tests on Node
22.18.0. npm reported six audit advisories (one low and five moderate);
the quality checks do not constitute a dependency audit. `actionlint`
passed for all five workflows.

GitHub evidence is pending the first push of `ci_cd`. In the PR's **Checks**
tab and the corresponding **Actions** run, inspect each step. Push and
restore one example at a time: an unused variable for ESLint, a formatting
only change for Prettier, and an incorrect expected sum for Mocha. Each
failure should appear at its matching step. Record the run links, verify
the final passing run, and then merge the PR into `main`.

## Task 2: Pull Request Comment

`pull_request_target` runs only when a PR targeting `main` is opened. It uses
the trusted base-branch workflow and can write the comment even when the PR
is from a fork and repository policy permits the event. The job grants only
`pull-requests: write` to the built-in token. It sends a fixed `message`
without checking out or executing any PR code.

PR link and comment verification are pending. Once this workflow is on
`main`, open a fresh test PR and confirm the bot comment and run log.

## Task 3: Gollum

The wiki workflow writes the number of created and edited wiki pages to the
job summary, making documentation changes visible in Actions. The wiki is
separate from the usual checkout, so the workflow reads the event's `pages`
array from `GITHUB_EVENT_PATH` with `jq`. It prints counts rather than
interpolating page titles into a shell script and needs no token permissions.

A second constraint is that the workflow must be on the default branch and
the wiki must be enabled and available for this private repository's plan.
Live verification is pending: enable the wiki if supported, then create and
edit a page and check the two run summaries. Do not make the repository
public to enable the wiki.

## Task 4: GitHub Actions Marketplace

I chose [Markdownlint CLI2 for GitHub Actions][marketplace] to catch report
style issues before submission. The same check is useful for keeping team
runbooks and onboarding docs consistent. The pinned source wraps the CLI and
reports rule violations in the run log. This workflow checks this report only.

The `ci.yml` schedule starts at **06:17 UTC every Monday** and calls the
Markdown workflow. GitHub may delay a scheduled run. After the workflows
are on `main`, use **Actions > Review Exercise Markdown > Run workflow** to
test via `workflow_dispatch`. Confirm that the Markdown check ran and add
the specific workflow run link here. Live evidence is pending.

## Task 5: Malware Scan

[Scan Virus v0.20.1][scan] runs its Docker container on a hosted Linux runner.
The action itself requires no GitHub write access. Checkout needs
`contents: read`; ClamAV needs network access to refresh its official
signatures. The job scans the checked-out workspace without traversing Git
history. PRs catch changes before merge; `workflow_dispatch` lets a
maintainer rerun the scan. A schedule would also catch files newly detected
by updated signatures even if no commits changed.

This is a signature-based file check rather than a proof that code is safe.
Novel or obfuscated threats, encrypted archives, scanner limits, and files
not present in the checkout can leave gaps. It does not replace code review,
dependency auditing, or runtime monitoring.

The scanner is initially enabled. In its first PR run, check the signature
update, scanned-file statistics, and the `finish` and `found` outputs. To
test detection without real malware, use the [EICAR test file][eicar] in a
disposable runner workspace and confirm that ClamAV flags it. Do not commit
the test file or disable endpoint protection to download it. After checking
the scan, add `if: ${{ false }}` at job level and verify that another run
shows the job as **Skipped**. Both GitHub results are pending.

[repo]: https://github.com/Lfijtkr/M324_LEAN-SCHUEPFER
[checkout]: https://github.com/actions/checkout/tree/3d3c42e5aac5ba805825da76410c181273ba90b1
[setup-node]: https://github.com/actions/setup-node/tree/949feb2413d6458794dcd2491c4babbbce0c15c1
[comment]: https://github.com/thollander/actions-comment-pull-request/tree/24bffb9b452ba05a4f3f77933840a6a841d1b32b
[markdown]: https://github.com/DavidAnson/markdownlint-cli2-action/tree/696eb3f2509270d7b882d2aa68347bc676e7af34
[scan]: https://github.com/hugoalh/scan-virus-ghaction/tree/99c81e8991ad1074a14e5f22a21bce9be035e14e
[security]: https://docs.github.com/en/actions/reference/security/secure-use
[npm-ci]: https://docs.npmjs.com/cli/commands/npm-ci
[marketplace]: https://github.com/marketplace/actions/markdownlint-cli2-action
[eicar]: https://www.eicar.org/download-anti-malware-testfile/
