#!/usr/bin/env node
/**
 * Faceless walkthrough video producer.
 *
 * Takes a structured video script (an array of scenes — each with
 * narration text + a visual definition) and produces a YouTube-ready
 * 1080p MP4 with synthesised narration and text-overlay visuals.
 *
 * No founder face required. No paid API. Uses:
 *   - edge-tts (free, no API key) for narration
 *   - ffmpeg + drawtext for visuals
 *
 * Usage:
 *   node scripts/produce-walkthrough-video.mjs --script=video-scripts/01-vantage-walkthrough.json
 *
 * Script format (JSON):
 * {
 *   "title": "Vantage AI Walk-Through — How It Works in 90 Seconds",
 *   "voice": "en-GB-RyanNeural",
 *   "outputName": "01-vantage-walkthrough",
 *   "scenes": [
 *     {
 *       "narration": "Vantage is the AI job preparation tool...",
 *       "visual": {
 *         "type": "title-card",
 *         "text": "Vantage AI",
 *         "subtitle": "Walk-through · 2026",
 *         "bg": "#4F46E5"
 *       }
 *     },
 *     {
 *       "narration": "Step one: paste a job URL.",
 *       "visual": {
 *         "type": "image",
 *         "path": "public/og-image.png",
 *         "caption": "Step 1 — Paste a job URL"
 *       }
 *     },
 *     {
 *       "narration": "Step two: upload your CV.",
 *       "visual": {
 *         "type": "text-card",
 *         "text": "Step 2",
 *         "subtitle": "Upload your CV",
 *         "bg": "#0a0814"
 *       }
 *     }
 *   ]
 * }
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---- Args ----
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value || true;
  return acc;
}, {});

const SCRIPT_PATH = args.script;
if (!SCRIPT_PATH) {
  console.error('Usage: node scripts/produce-walkthrough-video.mjs --script=<path-to-json>');
  process.exit(1);
}

const SCRIPT = JSON.parse(readFileSync(resolve(ROOT, SCRIPT_PATH), 'utf-8'));
const { title, voice = 'en-GB-RyanNeural', outputName, scenes } = SCRIPT;

const WORK_DIR = resolve(ROOT, 'dist-videos', `_work-${outputName}`);
const OUTPUT = resolve(ROOT, 'dist-videos', `${outputName}.mp4`);

// Clean and recreate work dir
if (existsSync(WORK_DIR)) rmSync(WORK_DIR, { recursive: true, force: true });
mkdirSync(WORK_DIR, { recursive: true });
mkdirSync(dirname(OUTPUT), { recursive: true });

console.log(`[walkthrough] Producing: ${title}`);
console.log(`[walkthrough] Voice: ${voice}`);
console.log(`[walkthrough] Scenes: ${scenes.length}`);

// ---- Helpers ----
function escFfmpegText(s) {
  // ffmpeg drawtext escaping: backslash special chars, single-quote the value
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/%/g, '\\%');
}

function getDuration(file) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`,
    { encoding: 'utf-8' }
  );
  return parseFloat(out.trim());
}

function genTts(text, outPath) {
  // Write text to a temp file to avoid PowerShell argument escaping hell
  const tmpText = outPath.replace('.mp3', '.txt');
  writeFileSync(tmpText, text, 'utf-8');
  // Rate +0% sounds natural for walkthrough content
  execSync(
    `python -m edge_tts --voice ${voice} --file "${tmpText}" --write-media "${outPath}"`,
    { stdio: 'pipe' }
  );
  rmSync(tmpText);
}

function genSceneVideo(scene, audioPath, outPath, sceneIdx) {
  const dur = getDuration(audioPath);
  const v = scene.visual;
  let videoFilter = '';

  if (v.type === 'title-card') {
    // Solid-color background + large title + subtitle
    const bg = v.bg || '#4F46E5';
    const text = escFfmpegText(v.text || title);
    const sub = escFfmpegText(v.subtitle || '');
    videoFilter = [
      `color=c=${bg}:s=1920x1080:d=${dur}`,
      `,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${text}':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=(h-text_h)/2-40`,
      sub
        ? `,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${sub}':fontcolor=white@0.7:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2+50`
        : '',
    ].join('');
    execSync(
      `ffmpeg -y -f lavfi -i "${videoFilter}" -t ${dur} -pix_fmt yuv420p -c:v libx264 -preset fast -crf 18 "${outPath}"`,
      { stdio: 'pipe' }
    );
  } else if (v.type === 'text-card') {
    // Step / heading / subtitle on solid bg
    const bg = v.bg || '#0a0814';
    const text = escFfmpegText(v.text || '');
    const sub = escFfmpegText(v.subtitle || '');
    videoFilter = [
      `color=c=${bg}:s=1920x1080:d=${dur}`,
      `,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${text}':fontcolor=white:fontsize=120:x=(w-text_w)/2:y=(h-text_h)/2-80`,
      sub
        ? `,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${sub}':fontcolor=#A8E6CF:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2+50`
        : '',
    ].join('');
    execSync(
      `ffmpeg -y -f lavfi -i "${videoFilter}" -t ${dur} -pix_fmt yuv420p -c:v libx264 -preset fast -crf 18 "${outPath}"`,
      { stdio: 'pipe' }
    );
  } else if (v.type === 'image') {
    // Static image with optional caption overlay at bottom
    const imgPath = resolve(ROOT, v.path);
    if (!existsSync(imgPath)) {
      throw new Error(`Image not found: ${imgPath}`);
    }
    const captionFilter = v.caption
      ? `,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${escFfmpegText(v.caption)}':fontcolor=white:fontsize=48:box=1:boxcolor=black@0.7:boxborderw=20:x=(w-text_w)/2:y=h-text_h-60`
      : '';
    // Loop the static image, pad/scale to 1920x1080
    execSync(
      `ffmpeg -y -loop 1 -t ${dur} -i "${imgPath}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#0a0814,setsar=1${captionFilter}" -pix_fmt yuv420p -c:v libx264 -preset fast -crf 18 "${outPath}"`,
      { stdio: 'pipe' }
    );
  } else if (v.type === 'bullet-list') {
    // Heading + bulleted lines
    const bg = v.bg || '#0a0814';
    const heading = escFfmpegText(v.heading || '');
    const bullets = (v.bullets || []).slice(0, 5);
    const headingFilter = heading
      ? `,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${heading}':fontcolor=white:fontsize=64:x=120:y=120`
      : '';
    const bulletFilters = bullets
      .map(
        (b, i) =>
          `,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='${escFfmpegText('• ' + b)}':fontcolor=white@0.9:fontsize=44:x=160:y=${260 + i * 80}`
      )
      .join('');
    execSync(
      `ffmpeg -y -f lavfi -i "color=c=${bg}:s=1920x1080:d=${dur}${headingFilter}${bulletFilters}" -t ${dur} -pix_fmt yuv420p -c:v libx264 -preset fast -crf 18 "${outPath}"`,
      { stdio: 'pipe' }
    );
  } else {
    throw new Error(`Unknown visual type: ${v.type}`);
  }

  console.log(`[walkthrough]   scene ${sceneIdx + 1}/${scenes.length} (${dur.toFixed(1)}s) ${v.type}`);
}

// ---- Generate per-scene audio + video ----
const sceneFiles = [];
scenes.forEach((scene, i) => {
  const audioPath = resolve(WORK_DIR, `scene-${String(i).padStart(3, '0')}.mp3`);
  const videoPath = resolve(WORK_DIR, `scene-${String(i).padStart(3, '0')}.mp4`);
  console.log(`[walkthrough] TTS scene ${i + 1}/${scenes.length}`);
  genTts(scene.narration, audioPath);
  genSceneVideo(scene, audioPath, videoPath, i);
  sceneFiles.push({ video: videoPath, audio: audioPath });
});

// ---- Build concat list ----
// We need to mux each scene video with its audio first, then concat
const muxedFiles = [];
sceneFiles.forEach(({ video, audio }, i) => {
  const muxed = resolve(WORK_DIR, `muxed-${String(i).padStart(3, '0')}.mp4`);
  execSync(
    `ffmpeg -y -i "${video}" -i "${audio}" -c:v copy -c:a aac -b:a 192k -shortest "${muxed}"`,
    { stdio: 'pipe' }
  );
  muxedFiles.push(muxed);
});

const concatList = resolve(WORK_DIR, 'concat-list.txt');
writeFileSync(
  concatList,
  muxedFiles.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'),
  'utf-8'
);

// ---- Final concat ----
console.log(`[walkthrough] Concatenating ${muxedFiles.length} scenes…`);
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${concatList}" -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -pix_fmt yuv420p -movflags +faststart "${OUTPUT}"`,
  { stdio: 'pipe' }
);

// ---- Cleanup work dir ----
if (!args.keepwork) rmSync(WORK_DIR, { recursive: true, force: true });

const finalDur = getDuration(OUTPUT);
console.log(`\n[walkthrough] ✓ Output: ${OUTPUT}`);
console.log(`[walkthrough]   Duration: ${finalDur.toFixed(1)}s`);
console.log(`[walkthrough]   Title: ${title}`);
console.log(`[walkthrough]   Upload to YouTube and use the script's title as the video title.`);
