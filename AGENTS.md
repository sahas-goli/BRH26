# Agent instructions

## Room

Four people: Sahas, Hayden, Audrey, and Selina. Address each other by name (`@Sahas`, `@Hayden`, `@Audrey`, `@Selina`). Do not use seat numbers.

On first arrival, post a join message on ntfy that names who you are, then claim your task with `bash scripts/task.sh claim <ID>`, then `git switch -c swe/<ID> origin/main`. Do not take someone else's task. In the room means you have posted a join message on ntfy naming who you are.

Do not claim AL-01, AL-02, AL-03, AL-04, S2-06, or S3-07. Those need secrets or are already held. S3-03 is already held. AL-01 needs `DATABASE_URL` and `INTERNAL_SECRET` and stays with Sahas. Do not ask Sahas for those secrets. AL-05, AL-06, and AL-07 are done. Do not assign them. S2-06 stays with Sahas. Leave it.

@Sahas is the orchestrator and only does tasks that need his secrets (`DATABASE_URL`, `INTERNAL_SECRET`, `SOLANA_PAYER_SECRET`, `NESSIE_KEY`, `SPECTRUM_PROJECT_SECRET`, `GEMINI_API_KEY`, Sahas's `XAI_API_KEY`). Collaborators must not ask Sahas for those secrets. A collaborator may ask its own user for an xAI key and store it only in that user's local env as `XAI_API_KEY`. Do not commit it. Never post it.

- @Hayden → AL-08 judging slide outline
- @Selina → AL-11 (AL-10 is done)
- @Audrey → AL-09 People's Choice share copy (do not post it)

AL-06 (domain shortlist: search only, do not buy, ignore `.study`) is done. Do not assign it. Public site: https://brh26-brh-26.vercel.app.

Chat is ntfy only. Do not append to [agents/room.md](agents/room.md). Do not open a pull request just to speak. [agents/room.md](agents/room.md) is a pointer: chat is ntfy, that file is not the transcript.

Speak by HTTP POST to https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea (server `https://ntfy.sh`, same topic name). The title must include the @target (`@Sahas`, `@Hayden`, `@Audrey`, or `@Selina`), for example `BRH26 @Hayden`. Body is one sentence. No secrets, no env values, no stack traces.

Read by a short poll: GET `https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea/json?poll=1&since=30m` with a 15s timeout. At the start of a session, do that once. If the latest message addresses you and you have not replied, do that work. Collaborators only act on their own name. Sahas is @Sahas.

There is no Cursor push subscription for ntfy. This orchestrator session is not woken by ntfy. Collaborator sessions are not woken either. Do not claim otherwise.

When stuck, done, or joining: POST one ntfy message whose title contains the @target. Do not append to `agents/room.md`. Do not open a PR just to speak. Reply on ntfy when done or blocked. Do not spam progress.

Code still ships on a branch from `origin/main` through a pull request (do not force-push main; do not plain `git push` if the branch tracks origin/main). That path is for code, not for chat.

Git Bash:

```bash
curl -fsS --max-time 15 "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea/json?poll=1&since=30m"
curl -fsS -H "Title: BRH26 @Hayden" -H "Priority: 3" -d "AL-08: one sentence" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
```

PowerShell (`curl.exe`, because `curl` is an alias):

```powershell
curl.exe -fsS --max-time 15 "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea/json?poll=1&since=30m"
curl.exe -fsS -H "Title: BRH26 @Hayden" -H "Priority: 3" -d "AL-08: one sentence" "https://ntfy.sh/brh26-11a5192222b1bdc25d0b45c23a2e1aea"
```

Read [WORKFLOW.md](WORKFLOW.md) fully before doing anything, then the PLAN.md sections your task's `spec:` line names. SWE may edit any path marked SWE in PLAN.md section 3.
