# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues in `ShanesNotes/rescue-town-builders`. Use the `gh` CLI for all issue operations.

## Conventions

- **Create an issue**: `gh issue create --repo ShanesNotes/rescue-town-builders --title "..." --body-file <file>`.
- **Read an issue**: `gh issue view <number> --repo ShanesNotes/rescue-town-builders --comments`.
- **List issues**: `gh issue list --repo ShanesNotes/rescue-town-builders --state open --json number,title,body,labels,comments`.
- **Comment on an issue**: `gh issue comment <number> --repo ShanesNotes/rescue-town-builders --body "..."`.
- **Apply / remove labels**: `gh issue edit <number> --repo ShanesNotes/rescue-town-builders --add-label "..."` / `--remove-label "..."`.
- **Close**: `gh issue close <number> --repo ShanesNotes/rescue-town-builders --comment "..."`.

Infer the repo from `git remote -v` when inside the clone. Use explicit `--repo ShanesNotes/rescue-town-builders` from scripts or automation.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --repo ShanesNotes/rescue-town-builders --comments`.
