#!/usr/bin/env node
/**
 * V6 video post-production — turns raw phone footage + ElevenLabs narration
 * into a YouTube-ready MP4.
 *
 * Workflow:
 *  1. Gio records raw face/B-roll footage on his phone (no narration)
 *  2. Gio pastes the V6 script into ElevenLabs in his browser, downloads
 *     the MP3 narration
 *  3. Gio runs:
 *       node scripts/produce-v6-video.mjs \
 *         --raw="C:/path/to/raw-footage.mp4" \
 *         --audio="C:/path/to/narration.mp3" \
 *         --title="Vantage AI Review — Is It Worth It?" \
 *         --output="dist-videos/01-vantage-ai-review.mp4"
 *  4. Output is YouTube-ready 1080p MP4 with intro card, lower-thirds, end-screen
 *
 * Requirements: ffmpeg in PATH (already verified). No npm deps.
 *
 * What this script does:
 *  - Takes the raw footage
 *  - Replaces its audio track with the ElevenLabs narration
 *  - Trims to the length of the narration (so silent tail is removed)
 *  - Adds a 2-second branded intro card with the video title
 *  - Adds a 3-second branded end-screen with aimvantage.uk + Subscribe
 *  - Burns in lower-thirds at the 5-second mark with "I'm Gio · founder · aimvantage.uk"
 *  - Encodes to YouTube-friendly H.264 1080p, AAC audio
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// ---- Parse args ----
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value || true;
  return acc;
}, {});

const RAW = args.raw;
const AUDIO = args.audio;
const TITLE = args.title || 'Vantage AI';
const OUTPUT = args.output || 'dist-videos/output.mp4';

if (!RAW || !AUDIO) {
  console.error('Usage: node scripts/produce-v6-video.mjs --raw=<path> --audio=<path> [--title=<title>] [--output=<path>]');
  process.exit(1);
}
if (!existsSync(RAW)) { console.error(`Raw footage not found: ${RAW}`); process.exit(1); }
if (!existsSync(AUDIO)) { console.error(`Audio not found: ${AUDIO}`); process.exit(1); }

mkdirSync(dirname(OUTPUT), { recursive: true });

// ---- Get audio duration ----
function getDuration(file) {
  const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`, { encoding: 'utf-8' });
  return parseFloat(out.trim());
}
const audioSec = getDuration(AUDIO);
const totalSec = audioSec + 5; // 2s intro + audio + 3s outro
console.log(`[v6-produce] Audio length: ${audioSec.toFixed(1)}s. Final video: ${totalSec.toFixed(1)}s.`);

// ---- Build the ffmpeg filter graph ----
// Strategy:
//  - Take raw footage, trim to audio length
//  - Replace audio with ElevenLabs narration
//  - Prepend a 2-second intro card (solid colour + title text)
//  - Append a 3-second end-screen (solid colour + aimvantage.uk text)
//  - Burn in lower-third at second 5 for ~3s with "I'm Gio · aimvantage.uk"

// Escape title for ffmpeg filter (single quotes must be backslash-escaped)
const escTitle = TITLE.replace(/'/g, "\\'").replace(/:/g, '\\:');
const SITE = 'aimvantage.uk';

const cmd = [
  'ffmpeg -y',
  // Inputs
  `-i "${RAW}"`,
  `-i "${AUDIO}"`,
  // Generate intro card (2s, dark violet bg, white title text)
  `-f lavfi -t 2 -i "color=c=0x4F46E5:s=1920x1080:d=2"`,
  // Generate end-screen (3s, dark bg, aimvantage.uk text)
  `-f lavfi -t 3 -i "color=c=0x0a0814:s=1920x1080:d=3"`,
  // Filter graph
  `-filter_complex "`,
  // 0: raw video, scaled to 1920x1080 + cropped, trimmed to audio length
  `[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,trim=duration=${audioSec},setpts=PTS-STARTPTS[main];`,
  // 2: intro card with title overlay
  `[2:v]drawtext=text='${escTitle}':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2-50,drawtext=text='aimvantage.uk':fontcolor=white@0.7:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2+50[intro];`,
  // 3: end-screen
  `[3:v]drawtext=text='${SITE}':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=(h-text_h)/2-40,drawtext=text='Try free \\: 3 analyses\\, no card':fontcolor=white@0.7:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2+50[outro];`,
  // Concat: intro + main + outro
  `[intro][main][outro]concat=n=3:v=1:a=0[v]`,
  `"`,
  // Map streams: video from filter, audio from input 1 (with delay so it starts AFTER the intro)
  `-map "[v]"`,
  `-map 1:a`,
  // Pad audio with 2s silence at start to align with intro
  `-af "adelay=2000|2000"`,
  // Output settings
  `-c:v libx264 -preset medium -crf 20`,
  `-c:a aac -b:a 192k`,
  `-pix_fmt yuv420p`,
  `-movflags +faststart`,
  `"${OUTPUT}"`,
].join(' ');

console.log(`[v6-produce] Running ffmpeg…`);
console.log(`[v6-produce] (this can take 1-3 minutes for a 3-min video)\n`);

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`\n[v6-produce] ✓ Output: ${resolve(OUTPUT)}`);
  console.log(`[v6-produce]   Upload to YouTube. Title: ${TITLE}`);
} catch (err) {
  console.error(`[v6-produce] FAILED: ${err.message}`);
  process.exit(1);
}
