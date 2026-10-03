#!/usr/bin/env bash
# Task board for 4 people + their agents. See WORKFLOW.md section 3.
#   tasks/<ID>.md on main      = the task definition and its status (open | done)
#   origin branch claim/<ID>   = the lock. Pushing a new branch is atomic, so two
#                                people can never both claim the same task.
# Usage: scripts/task.sh list [ROLE] | claim ID | release ID | done ID | mine
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
cmd=${1:-list}; arg=${2:-}
me=$(git config user.name || echo unknown)

sync() {
  git fetch -q origin main
  git fetch -q --prune origin '+refs/heads/claim/*:refs/remotes/origin/claim/*' 2>/dev/null || true
}
field() { { git show "origin/main:tasks/$1.md" 2>/dev/null || true; } | sed -n "s/^$2: *//p" | head -1; }
claimant() { { git log -1 --format='%s' "refs/remotes/origin/claim/$1" 2>/dev/null || true; } | sed 's/^claim [^ ]* by //'; }
need_id() { [ -n "$arg" ] || { echo "usage: scripts/task.sh $cmd <ID>"; exit 2; }; }

case "$cmd" in
  list|mine)
    sync
    printf '%-8s %-5s %-8s %-28s %s\n' ID OWNER STATUS CLAIMED_BY TITLE
    for id in $(git ls-tree --name-only origin/main tasks/ | sed -n 's#^tasks/\(.*\)\.md$#\1#p'); do
      owner=$(field "$id" owner); status=$(field "$id" status)
      lane=$arg
      case "$lane" in SWE1|SWE2|SWE3) lane=SWE ;; esac
      [ "$cmd" = list ] && [ -n "$lane" ] && [ "$owner" != "$lane" ] && continue
      who=$(claimant "$id")
      [ "$status" != done ] && [ -n "$who" ] && status=claimed
      [ "$cmd" = mine ] && [[ "$who" != "$me "* ]] && continue
      title=$(git show "origin/main:tasks/$id.md" | sed -n 's/^# //p' | head -1)
      printf '%-8s %-5s %-8s %-28s %s\n' "$id" "$owner" "$status" "${who:0:28}" "$title"
    done ;;
  claim)
    need_id; sync
    git cat-file -e "origin/main:tasks/$arg.md" 2>/dev/null || { echo "no such task: $arg"; exit 1; }
    [ "$(field "$arg" status)" = done ] && { echo "$arg is already done"; exit 1; }
    # A unique commit (timestamped message) on top of main; its tree equals main's, so it changes nothing.
    sha=$(git commit-tree "origin/main^{tree}" -p origin/main -m "claim $arg by $me $(date -u +%Y-%m-%dT%H:%MZ)")
    if git push -q origin "$sha:refs/heads/claim/$arg" 2>/dev/null; then
      echo "CLAIMED $arg. Branch for the work: git switch -c swe/$arg origin/main"
    else
      sync; echo "TAKEN: $arg is claimed by $(claimant "$arg")"; exit 1
    fi ;;
  release|done)
    need_id
    git push -q origin --delete "claim/$arg" && echo "released claim/$arg"
    [ "$cmd" = done ] && echo "Make sure the PR that finished $arg set 'status: done' in tasks/$arg.md." ;;
  *) echo "usage: scripts/task.sh list [ROLE] | mine | claim ID | release ID | done ID"; exit 2 ;;
esac
