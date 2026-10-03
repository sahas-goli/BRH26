# Agent instructions

## Room

Three seats: seat1, seat2, seat3. One person per seat. Seats are empty until an agent joins. On first arrival, take the lowest empty seat by appending a join line to [agents/room.md](agents/room.md), then claim that seat's task with `bash scripts/task.sh claim <ID>`, then `git switch -c swe/<ID> origin/main`. Do not take a second seat.

Do not claim AL-01, AL-02, AL-03, AL-04, S2-06, or S3-07. Those need secrets or are already held. S3-03 is already held. AL-01 needs `DATABASE_URL` and `INTERNAL_SECRET` and stays with S. Do not ask S for those secrets. AL-05 and AL-07 are done. Do not assign them. S2-06 is Hayden's Nessie task. Leave it.

- @seat1 → AL-08 judging slide outline
- @seat2 → AL-06 domain shortlist (search only, do not buy, ignore `.study`)
- @seat3 → AL-09 People's Choice share copy (do not post it)

Queued, not assigned: AL-10 (Cursor transcript export notes), AL-11 (team registration form check, no personal data in git). @manager assigns those when a seat is free. Public site: https://brh26-brh-26.vercel.app.

[agents/room.md](agents/room.md) is the chat transcript. Append a line (`UTC time | from | to | message`). Do not rewrite history. Every room message also gets one ntfy POST so S's phone and the manager see it. Title includes the @ being pinged, for example `BRH26 @seat1`. Body is one sentence. No secrets, no env values, no stack traces. Topic: https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea (server `https://ntfy.sh`, same topic name).

Every session start: `git pull`, read the end of `agents/room.md`, and poll ntfy once with a 15s timeout. If the latest ping addresses your seat and you have not replied, do that work. Collaborators only act on their own @seat. Manager is @manager. S is @S.

When stuck, done, or joining: append to `agents/room.md`, push via the normal PR path (do not force-push main; do not plain `git push` if the branch tracks origin/main), and POST one ntfy message whose title contains the @target. Reply in the room when done or blocked. Do not spam progress.

Git Bash:

```bash
curl -fsS --max-time 15 "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea/json?poll=1&since=30m"
curl -fsS -H "Title: BRH26 @seat1" -H "Priority: 3" -d "AL-08: one sentence" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
```

PowerShell (`curl.exe`, because `curl` is an alias):

```powershell
curl.exe -fsS --max-time 15 "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea/json?poll=1&since=30m"
curl.exe -fsS -H "Title: BRH26 @seat1" -H "Priority: 3" -d "AL-08: one sentence" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
```

Read [WORKFLOW.md](WORKFLOW.md) fully before doing anything, then the PLAN.md sections your task's `spec:` line names. SWE may edit any path marked SWE in PLAN.md section 3.
