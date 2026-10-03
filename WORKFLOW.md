# How we work: 4 people, 4 agents, 4 computers, one repo

What we build: [PLAN.md](PLAN.md). This file covers how we build it without stepping on each other. Agents: read this file fully, then the PLAN.md sections your task's `spec:` line points to.

## 1. The loop

```
scripts/task.sh list SWE          # 1. see the software lane: open, claimed, done
scripts/task.sh claim S2-03       # 2. atomic lock; if it says TAKEN, pick another
git switch -c swe/S2-03 origin/main
...work, commit small, in any SWE path...
npm --prefix web run check        # 3. typecheck + tests must pass
# 4. set "status: done" in tasks/S2-03.md in the same branch
gh pr create --fill && gh pr merge --rebase --delete-branch
scripts/task.sh done S2-03        # 5. drop the lock
# 6. post "MERGED S2-03" in team chat, then go back to 1
```

## 2. One-time setup (each person, about 15 min)

1. `git clone https://github.com/Sahas266/BRH26 && cd BRH26`, then `gh auth login`, and set `git config user.name "<first name>"` (the claim lock shows this name).
2. Install Node 20+ and npm. On Windows, run `scripts/task.sh` from Git Bash.
3. Get secrets from the team password note or DM (section 6) and put them in `web/.env.local`, plus `agent/.env.local` for the Photon agent.
4. Accept the Vercel team invite.
5. Cursor: keep Settings > Agents > Attribution on, so commits get `Co-authored-by: Cursor`. That trailer is our SpaceX-track evidence (section 8). Claude Code is fine too, but **commit code through Cursor Agent whenever you can**.
6. Start your agent with the role prompt from section 9.

## 3. The task board

Your idea, "claim, push, pull before claiming," is the right shape. The weak spot is that two people can both pull, both see a task open, and both commit a claim to the same file. The second push then hits a merge conflict in the task file instead of a clean "no." We fix that with two rules.

- **One software lane.** Every software task has `owner: SWE`. Anyone may claim any open SWE task. ALL tasks are for anyone. `scripts/task.sh list SWE1`, `SWE2`, or `SWE3` still lists the SWE lane.
- **The lock is a branch, not a file edit.** `scripts/task.sh claim <ID>` pushes a brand-new branch `claim/<ID>` to GitHub. Creating a branch that already exists is rejected by the server, so exactly one claim can win. The loser sees `TAKEN: <ID> is claimed by <name> <time>`. There is no file edit, no merge conflict and no commit noise on main.
- **Done lives in the task file.** The PR that finishes a task sets `status: done` in `tasks/<ID>.md`, so the board's history is in git. After merging, `scripts/task.sh done <ID>` deletes the lock branch.

| Command | What it does |
|---|---|
| `scripts/task.sh list [ROLE]` | Fetches and prints every task (or one lane) with open, claimed (by whom, since when) or done |
| `scripts/task.sh mine` | Your claimed tasks |
| `scripts/task.sh claim ID` | Atomic claim; exits 1 if it is taken or done |
| `scripts/task.sh release ID` | Give a task back without finishing it |
| `scripts/task.sh done ID` | Remove the lock after the done PR has merged |

**Rules.**
- Hold at most 2 claims at a time.
- Check `depends_on:` before claiming. If a dependency is not done, build against mocks (section 7) or pick something else.
- **Stale claims:** if a claim is older than 3 h with no pushed commits on its work branch, ask in chat. If there is no answer within 15 min (the owner is probably asleep), anyone may `release` it and reclaim it. Post `STOLE <ID>` so the owner knows.
- **New work:** add a `tasks/<ID>.md` file in your lane (copy an existing one) in any PR. Use IDs like `S2-08`.

## 4. Git flow

- **Branches** are named `<role>/<task-id>`, e.g. `swe/S1-02`, always cut from fresh `origin/main`.
- **Commits** are small, and each message starts with the task ID: `S1-02: forward endpoint enforces fanout`.
- **Merge** through a PR with `gh pr merge --rebase --delete-branch`. Use rebase, not squash, so every Cursor trailer survives. Self-merging is allowed once `npm --prefix web run check` and `npm --prefix web run build` both pass locally.
- **Merge at least every 2 hours.** Long-lived branches are how parallel agents end up in conflict hell; if a task is half done, merge it behind a mock flag.
- **Keep main deployable.** Vercel deploys main to production and every branch to a preview URL. SWE3 sets the project's Ignored Build Step to `bash -c 'case "$VERCEL_GIT_COMMIT_REF" in claim/*) exit 0;; *) exit 1;; esac'` so claim branches never build.
- **Never force-push main, and never rewrite someone else's branch.** If main breaks, the person who broke it fixes or reverts it (`git revert <sha>`) within 15 min, and posts `BROKEN main` until it is fixed.
- **Before every push:** `git fetch && git rebase origin/main`. On a conflict in a file you do not own, do not resolve it yourself: take main's version (`git checkout --theirs <file>` during a rebase), then ask the owner.

## 5. Ownership and contracts

- The ownership map is PLAN.md section 3. **SWE may edit any SWE path.** A change in a path you do not own still needs a `REQUEST <owner>: <what>` in chat, or a tiny PR. Never edit it silently.
- **Shared contracts** are `web/lib/types.ts`, `db/schema.sql`, `.env.example`, `web/package.json` and its lockfile, and PLAN.md section 4. To change one:
  1. Post `CONTRACT: <one-line change>` in chat.
  2. Open a PR containing only the contract change (plus PLAN.md section 4 if relevant).
  3. Wait for a thumbs-up from each affected owner, or 20 minutes if they are asleep.
  4. Merge it, then everyone rebases.
  - Additive changes (a new optional field, a new table) need only the chat post.
- **Dependencies:**
  1. Post `DEP: <package> (web)`.
  2. Rebase, then `npm --prefix web install <package>`.
  3. Commit only the `package.json` and lockfile changes, and merge right away.
  4. Lockfile conflict: `git checkout origin/main -- web/package-lock.json && npm --prefix web install`, then commit.
- **S3-01 scaffold creates every shared root file**: `layout.tsx`, `tsconfig`, `next.config`, `.gitignore`, and stub route files for every endpoint. After that, any SWE may fill any software file.

## 6. Secrets

- **Never commit secrets.** That covers `.env.local`, Solana keypairs, and API keys; `.gitignore` covers all of them. Agents must never print secret values in chat, commits or logs.
- Share secrets in one pinned note in the team chat (or 1Password). SWE3 copies them into Vercel environment variables. `INTERNAL_SECRET` is shared by web, agent and bridge.
- If a secret leaks into a commit, rotate it immediately. Rewriting history is a waste of time; the key is already burned.
- 07:30 Sunday, before making the repo public: SWE3 runs `git log -p | grep -iE "secret|key=|private"` and checks the hits.

## 7. Never blocked: mocks and integration order

- **Mock flags** `PAYOUT_MODE`, `NESSIE_MODE`, `PHOTON_ENABLED`, `GEMINI_ENABLED` and `GROK_ENABLED` default to mock or off. In mock mode the code still writes the same rows and events, so the UI and controller can be built before any sponsor integration works.
- If your dependency is not merged, code against the types in `web/lib/types.ts` and the API table in PLAN.md section 4.3, and stub the call. The scaffold's 501 stubs mean every route exists from 11:30.
- **Integration order:** the M1 mock loop (15:00) comes first, then each integration flips its flag on in a preview, then on prod. Flip a flag on prod only after its owner has run the path twice.
- **Who runs what where:**
  - Vercel runs `web/`.
  - The DGX runs `agent/` (in `tmux`, with a `cloudflared` tunnel for `/send`) and `sim/`.

## 8. Cursor evidence (SpaceX track)

- Do most coding in Cursor Agent with attribution trailers on.
- At 05:00, each person exports their Cursor chat transcripts into `cursor-transcripts/<role>/`.
- SWE3 screen-records 60 s of Cursor use for the Devpost video.
- Mention Grok Bot use for planning if anyone uses it.

## 9. Agent session-start prompts

Paste the block for your role as the first message of every new agent session.

```
You are the <ROLE> agent for Six Hops (BigRed//Hacks 2026). Read WORKFLOW.md fully, then PLAN.md
sections 1, 3, 4 and the sections named in your task's "spec:" line.
Your owned paths: <PATHS FROM PLAN.md SECTION 3>. Edit nothing else. If you need a change elsewhere,
stop and tell me what to ask its owner. Shared contracts (web/lib/types.ts, db/schema.sql,
.env.example, web/package.json) change only via the CONTRACT procedure in WORKFLOW.md section 5:
stop and ask me first.
Work loop: scripts/task.sh list SWE; claim any open SWE task whose depends_on are done (or mockable);
branch swe/<ID> from origin/main; small commits prefixed with the task ID; run
npm --prefix web run check before every push; set status: done in tasks/<ID>.md; open and merge the PR
with --rebase; scripts/task.sh done <ID>; tell me the one-line MERGED message to post.
Never print secrets. Never force-push. Never invent an API marked VERIFY in PLAN.md; implement it
behind its mock flag and tell me what to verify. Prefer the simplest code that meets "Done when".
```

| Role | Paste into `<PATHS ...>` |
|---|---|
| SWE | Every path marked SWE in PLAN.md section 3. |

## 10. Talking to each other

One team chat. Messages start with a tag, so a skim is enough:

| Tag | Meaning |
|---|---|
| `MERGED <ID>` | merged to main; one line on what changed |
| `CONTRACT <change>` | shared contract change coming; affected owners thumbs-up |
| `DEP <pkg>` | adding a dependency now |
| `REQUEST <owner>: <what>` | need a change in a path you own |
| `BLOCKED <ID>: <on what>` | say what would unblock you |
| `BROKEN main` / `FIXED main` | |
| `GO/NOGO <test>: <result>` | go/no-go results (PLAN.md section 10) |
| `SLEEP until <time>` / `AWAKE` | so others know whose claims may go stale |

**Standups**: 5 minutes, in person, at 11:30, 12:30, 15:00, 18:00, 21:00, 23:00 and 05:00. Cover what merged, what is blocked, and what each person claims next. At 12:30, also decide which spokes survive the go/no-go tests.

## 11. Freeze and submission

- **03:00 feature freeze:** bug fixes only. Each fix is still a PR.
- **05:00 code freeze:** no code changes, except a fix the whole team agrees on for something that breaks the demo.
- **After 05:00:**
  - write-ups in `submission/<track>.md` (owners in PLAN.md section 13);
  - deck;
  - Cursor transcripts (everyone);
  - backup video (AL-03);
  - Devpost by 08:15 (AL-04);
  - make the repo public after the secret scrub.

## 12. Troubleshooting

- **The agent edited a file it does not own:** `git checkout origin/main -- <file>`, then send the owner a REQUEST.
- **`scripts/task.sh` says permission denied or `\r` errors:** run it as `bash scripts/task.sh ...` from Git Bash. `.gitattributes` keeps it LF.
- **Claim push fails for a reason other than TAKEN** (auth, network): `gh auth status`, then retry. A claim only counts once the script prints `CLAIMED`.
- **Two people built the same thing anyway:** keep whichever merged first, and the other person releases and moves on. Don't merge the two.
- **A teammate is asleep holding a blocker:** follow the stale-claim rule in section 3, or build against the mock and leave the real call for them.
- **Vercel prod is broken but main looks fine:** check the environment variables in Vercel (SWE3) before debugging code.
