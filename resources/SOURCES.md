# Sources (repull these as they change)

Captured 2026-10-02. **User-given** links come first; keep them verbatim.

## User-given
| Link | Feeds | Repull |
|---|---|---|
| https://docs.google.com/document/d/1vokzpAsvmQqu62QP_InjNWLkyw-wguj1_4NvOxA0kIY/edit?tab=t.0#heading=h.qzo7y89gu38z | [01](01-general-info-doc.md), tracks (Capital One, SpaceX, Photon, generic) | Drive MCP `read_file_content` id `1vokzpAsvmQqu62QP_InjNWLkyw-wguj1_4NvOxA0kIY` |
| https://docs.google.com/document/d/1NHrE-zrTy1DDI-0d1FkQAStY7yizpfoao3BqESUHHM0/edit?tab=t.0 | [02](02-theme-navigation.md) | Drive MCP id `1NHrE-zrTy1DDI-0d1FkQAStY7yizpfoao3BqESUHHM0` |
| https://docs.google.com/presentation/d/1HytL8PP48KtWOhP_aJ7BdhmIkyhY8bUU2go4iSU_tO0/edit?slide=id.p#slide=id.p | [01](01-general-info-doc.md), [02](02-theme-navigation.md), Photon track | Drive MCP id `1HytL8PP48KtWOhP_aJ7BdhmIkyhY8bUU2go4iSU_tO0` |
| https://www.mlh.com/events/bigred-hacks-2026/prizes | `tracks/mlh-*.md` | WebFetch |
| https://www.bigredhacks.com/ | [03](03-devpost-and-website.md) sponsors, site FAQ | React SPA (also names the registration portal): `curl` index, then grep the `assets/index-*.js` bundle (arrays `C9` tracks, `kc` FAQ, `qc` schedule, `ax` sponsors; names change per build) |

## Verbal (merged, raw files deleted)
Opening ceremony audio, via an Otter auto-transcript plus a text dump of the first half, supplied by the user. Merged into the "Spoken" sections of [02](02-theme-navigation.md), [01](01-general-info-doc.md) and `tracks/`. Auto-transcript: names and numbers garbled in places ("Rock Imagine" = Grok Imagine, "11 Labs" = ElevenLabs, "ESD/ESPN 120" = PSB 120). Raw files remain in git history (commit fe14373) if needed.

## Found along the way
| Link | Feeds | Repull |
|---|---|---|
| https://bigredhacks2026.devpost.com/ (+ /rules, /resources, /project-gallery) | [03](03-devpost-and-website.md), track prizes | WebFetch (curl gets 403) |
| https://somethingreat.notion.site/Hackathon-Guidelines-for-Photon-3dce443f36bb803696daf4135f063cd1 | [photon track](tracks/photon-imessage-agents.md) | POST `https://somethingreat.notion.site/api/v3/loadCachedPageChunkV2` with page id `3dce443f-36bb-8036-96da-f4135f063cd1`, `limit` 200, parse `recordMap.block` titles |
| https://mlh.link/{elevenlabs,gemini,solana,tigerdata,presage,GoDaddyRegistry} | `tracks/mlh-*.md` | `curl -sL` the short link: it is a meta-refresh page; read `content="0; url=..."` for the partner page (`mlh.com/partners/<name>`; GoDaddy goes to tech.study). Partner pages hold more `mlh.link/<slug>` links (quickstart, docs, faucet, SDK) that resolve the same way. Resolved targets are listed inside each track file |
| https://brh-registration-portal.netlify.app/ | [03](03-devpost-and-website.md) | React SPA: `curl` index, grep `assets/index-*.js` for UI strings. Supabase-backed; do not probe its API |
| `<event>.devpost.com/project-gallery?winner=true` for each past year (links in [03](03-devpost-and-website.md)) | [past-winners.md](past-winners.md) | WebFetch the gallery, then each project page for prize badges (the filter pads its list with non-winners after the real ones) |
| https://forms.gle/AA9s7pa7BAV7VE2i9, https://discord.gg/5SRr3pm7N | [01](01-general-info-doc.md) | n/a |

New links from the user get added here first, then the files they feed.
