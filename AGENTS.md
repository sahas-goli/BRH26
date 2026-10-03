# Agent instructions

Collaborators with no `web/.env.local` take exactly one of AL-06, AL-08, AL-09, AL-10, AL-11. One person per task. Claim with `bash scripts/task.sh claim <ID>`, then `git switch -c swe/<ID> origin/main`.

Do not claim AL-01, AL-02, AL-03, AL-04, S2-06, S3-03, or S3-07. Those need secrets or are already held. AL-01 needs `DATABASE_URL` and `INTERNAL_SECRET` and stays with S. Do not ask S for those secrets. AL-05 and AL-07 are done.

AL-06 is the domain shortlist (search only, do not buy, ignore `.study`). AL-08 is the judging slide outline. AL-09 is the People's Choice share copy (do not post it). AL-10 is the Cursor transcript export notes. AL-11 is the team registration form check (no personal data in git). AL-05 was the poster. AL-07 was the public-site storyboard. Public site: https://brh26-brh-26.vercel.app.

S2-06 is Hayden's Nessie task. Leave it.

Read WORKFLOW.md fully before doing anything, then the PLAN.md sections your task's `spec:` line names.
SWE may edit any path marked SWE in PLAN.md section 3. Claim only a task named above that is still free, with `bash scripts/task.sh`.

## Notify S

POST once to this ntfy topic when you are stuck, blocked on S, or finished a claimed task. One notification per event. Do not send progress spam, secrets, env values, or stack traces.

S subscribes on the web at https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea, or in the ntfy app with topic `brh26-11a5192222b1bdc25d0b45c23a2e1aea` on server `https://ntfy.sh`.

Git Bash (`curl`):

```bash
curl -fsS -H "Title: BRH26 stuck" -H "Priority: high" -H "Tags: warning" -d "AL-08: one-sentence blocker" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
curl -fsS -H "Title: BRH26 done" -H "Priority: default" -H "Tags: white_check_mark" -d "AL-08: https://github.com/Sahas266/BRH26/pull/1" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
curl -fsS -H "Title: BRH26 needs S" -H "Priority: high" -H "Tags: rotating_light" -d "AL-01: only S can apply the hosted database env" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
```

PowerShell (`curl.exe`, because `curl` is an alias):

```powershell
curl.exe -fsS -H "Title: BRH26 stuck" -H "Priority: high" -H "Tags: warning" -d "AL-08: one-sentence blocker" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
curl.exe -fsS -H "Title: BRH26 done" -H "Priority: default" -H "Tags: white_check_mark" -d "AL-08: https://github.com/Sahas266/BRH26/pull/1" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
curl.exe -fsS -H "Title: BRH26 needs S" -H "Priority: high" -H "Tags: rotating_light" -d "AL-01: only S can apply the hosted database env" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
```

Replace the task id, the one-sentence blocker, and the PR url. Omit the PR url on done if there is none.
