# Agent instructions

## Room

Three seats: seat1, seat2, seat3. One person per seat. Seats are already assigned. Do not reassign. On first arrival, post a join message on ntfy that names who you are and which seat you are, then claim that seat's task with `bash scripts/task.sh claim <ID>`, then `git switch -c swe/<ID> origin/main`. Do not take a second seat. In the room means that seat has posted a join message on ntfy naming who they are.

Do not claim AL-01, AL-02, AL-03, AL-04, S2-06, or S3-07. Those need secrets or are already held. S3-03 is already held. AL-01 needs `DATABASE_URL` and `INTERNAL_SECRET` and stays with S. Do not ask S for those secrets. AL-05, AL-06, and AL-07 are done. Do not assign them. S2-06 is Hayden's Nessie task. Leave it.

@manager is the orchestrator and only does tasks that need S's secrets (`DATABASE_URL`, `INTERNAL_SECRET`, `SOLANA_PAYER_SECRET`, `NESSIE_KEY`, `SPECTRUM_PROJECT_SECRET`, `GEMINI_API_KEY`, S's `XAI_API_KEY`). Collaborators must not ask S for those secrets. A collaborator may ask its own user for an xAI key and store it only in that user's local env as `XAI_API_KEY`. Do not commit it. Never post it.

- @seat1 → AL-08 judging slide outline
- @seat2 → Selina on AL-11 (AL-10 is done)
- @seat3 → AL-09 People's Choice share copy (do not post it)

AL-06 (domain shortlist: search only, do not buy, ignore `.study`) is done. Do not assign it. Public site: https://brh26-brh-26.vercel.app.

Chat is ntfy only. Do not append to [agents/room.md](agents/room.md). Do not open a pull request just to speak. [agents/room.md](agents/room.md) is a pointer: chat is ntfy, that file is not the transcript.

Speak by HTTP POST to https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea (server `https://ntfy.sh`, same topic name). The title must include the @target (`@manager`, `@seat1`, `@seat2`, `@seat3`, or `@S`), for example `BRH26 @seat1`. Body is one sentence. No secrets, no env values, no stack traces.

Read by a short poll: GET `https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea/json?poll=1&since=30m` with a 15s timeout. At the start of a session, do that once. If the latest message addresses your seat and you have not replied, do that work. Collaborators only act on their own @seat. Manager is @manager. S is @S.

There is no Cursor push subscription for ntfy. This orchestrator session is not woken by ntfy. Collaborator sessions are not woken either. Do not claim otherwise.

When stuck, done, or joining: POST one ntfy message whose title contains the @target. Do not append to `agents/room.md`. Do not open a PR just to speak. Reply on ntfy when done or blocked. Do not spam progress.

Code still ships on a branch from `origin/main` through a pull request (do not force-push main; do not plain `git push` if the branch tracks origin/main). That path is for code, not for chat.

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
