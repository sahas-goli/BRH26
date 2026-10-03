# Agent instructions

Collaborators with no `web/.env.local` take exactly one of AL-05, AL-06, AL-07. One person per task. Claim with `bash scripts/task.sh claim <ID>`, then `git switch -c swe/<ID> origin/main`.

Do not claim AL-01, AL-02, AL-03, AL-04, S2-06, S3-03, or S3-07. Those need secrets or are already held. AL-01 needs `DATABASE_URL` and `INTERNAL_SECRET` and stays with S. Do not ask S for those secrets.

AL-05 is the poster. AL-06 is the domain shortlist (search only, do not buy, ignore `.study`). AL-07 is the public-site storyboard. Public site: https://brh26-brh-26.vercel.app.

S2-06 is Hayden's Nessie task. Leave it.

Read WORKFLOW.md fully before doing anything, then the PLAN.md sections your task's `spec:` line names.
SWE may edit any path marked SWE in PLAN.md section 3. Claim only a task named above that is still free, with `bash scripts/task.sh`.
