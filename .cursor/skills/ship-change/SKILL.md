---
name: ship-change
description: Commit the finished work of an OpenSpec change, push it to a feature branch, and open a pull request that describes the change. Use after the change is implemented and reviewed, before /opsx-archive.
---

# Ship change

The user gives a change name (for example `trip-management`). If none is given, use the only active change in openspec/changes/, or ask which one.

Read openspec/changes/<name>/proposal.md, specs/ and tasks.md first. They are the source for the commit message and the PR description.

Pre-flight checks. Stop and report if any of them fails:
1. `git remote -v` shows an `origin`.
2. `gh auth status` shows a logged-in GitHub account.
3. `.gitignore` exists and ignores node_modules, .next and .env files.
4. `git status` shows something to commit.

Steps:
1. Check the current branch.
   - If it is main or master, create and switch to `feat/<change-name>`. Uncommitted work comes with you.
   - If it is already a feature branch, stay on it.
2. Check tasks.md. If any task is unchecked, list them and ask whether to continue.
3. Look for things that must not be committed: .env files, API keys, tokens, database connection strings, node_modules, build output. If you find any, stop and tell the user. Do not stage them.
4. Stage files by name. Do not use `git add .` or `git add -A`. List every file you are staging and say in one line what each group is (feature code, openspec files, project setup).
5. Write the commit message from the proposal:
   - First line: `feat(<change-name>): <short summary>`, under 72 characters.
   - Body: 2 to 4 lines on what changed and why.
6. Show the staged files and the commit message. Wait for the user's approval before committing.
7. After approval: commit, then `git push -u origin <branch>`.
8. Open the PR with `gh pr create --base main --title "<commit first line>" --body "<PR body>"`. Add `--draft` if the user asks for a draft.
9. Print the PR link.

PR body template:

    ## Summary
    <what this change adds, from proposal.md, in 2 to 3 sentences>

    ## What changed
    <the requirements from the specs, in plain language>

    ## Out of scope
    <what the proposal says was left out on purpose, and any recorded risks>

    ## How to test
    <steps taken from the spec scenarios>

    ## Where to look
    Focus on openspec/changes/<change-name>/ and the code for this feature.
    If this is the first feature, the diff also includes the project scaffold and OpenSpec setup.

Rules:
- Never commit directly to main or master.
- Never force push. Never use `--no-verify`.
- Never commit secrets or .env files.
- Never skip the approval in step 6.
- Do not run /opsx-archive. Archiving happens after the PR is merged.
- Make only the git and gh calls this skill needs. Do not edit any code or spec files.
- If any command fails, stop and report the error. Do not retry with different flags to get around it.