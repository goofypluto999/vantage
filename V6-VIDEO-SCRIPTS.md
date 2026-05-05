# V6 Video Production — DEPRECATED

This document originally contained 5 talking-head video scripts under the assumption Gio would record himself on camera. **That assumption was wrong** — Gio explicitly does not appear on camera, by design.

**The new approach:** faceless narrated walkthrough videos. No founder face. No fraud. Same V6 SERP capture.

## Current source of truth

- **Video script JSON files:** `video-scripts/01-vantage-walkthrough.json` through `video-scripts/05-vantage-vs-final-round-ai.json`
- **Production pipeline:** `scripts/produce-walkthrough-video.mjs` (uses edge-tts + ffmpeg, both free, no API keys)
- **Generated videos:** `dist-videos/*.mp4` (gitignored — regenerate by running the pipeline)

## Regenerating any video

```powershell
cd "C:\Cloaude Logic\vantage"
node scripts/produce-walkthrough-video.mjs --script=video-scripts/01-vantage-walkthrough.json
```

## Changing the voice

Edit the `voice` field in any JSON script. Available voices include:
- `en-GB-RyanNeural` (current — British male, professional)
- `en-GB-LibbyNeural` — British female, neutral
- `en-GB-SoniaNeural` — British female, younger
- `en-US-GuyNeural` — American male
- `en-US-JennyNeural` — American female, very natural

For the full voice list:
```powershell
python -m edge_tts --list-voices
```

## Changing the script content

Edit the JSON. Each scene has:
- `narration` — what gets spoken (use commas and periods for natural pacing — edge-tts respects punctuation)
- `visual` — one of: `title-card`, `text-card`, `bullet-list`, `image`

## Adding new videos

1. Copy any existing JSON script as a template
2. Change `outputName`, `title`, and rewrite the scenes
3. Run the pipeline

The deprecated scripts originally written for talking-head recordings are preserved in this file's git history for reference, but should not be used.
