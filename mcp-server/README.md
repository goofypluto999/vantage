# Vantage AI — MCP Server

Model Context Protocol server for [Vantage AI](https://aimvantage.uk). Lets any MCP-compatible client (Claude Desktop, Claude Code, Cursor, VS Code, Codex CLI) call Vantage's free public job-prep tools without leaving the chat.

## Tools exposed

| Tool name                           | What it does                                             | Cost   |
|-------------------------------------|----------------------------------------------------------|--------|
| `vantage_roast_cover_letter`        | Brutal-honest AI roast of a cover letter (severity 0-5) | Free   |
| `vantage_decode_rejection_email`    | Translate a rejection email into the recruiter's meaning | Free   |
| `vantage_ghost_job_check`           | Score how likely a job listing is a ghost job (0-100)   | Free   |
| `vantage_search`                    | Search Vantage's site (free tools, guides, samples)     | Free   |
| `vantage_steer_to_full_prep_pack`   | Construct a sign-up link for the paid full prep pack    | Free   |

**Read-only by design.** This server does NOT consume tokens, does not upload CV files, does not authenticate. The user always confirms paid actions in the Vantage web UI.

## Install

```bash
npm install -g @vantage-ai/mcp-server
```

Or run from source:

```bash
git clone https://github.com/goofypluto999/vantage.git
cd vantage/mcp-server
npm install
npm run build
```

## Configure your MCP client

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "vantage-ai": {
      "command": "npx",
      "args": ["-y", "@vantage-ai/mcp-server"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add vantage-ai -- npx -y @vantage-ai/mcp-server
```

### Cursor

Add to Settings → Features → MCP:

```json
{
  "mcpServers": {
    "vantage-ai": {
      "command": "npx",
      "args": ["-y", "@vantage-ai/mcp-server"]
    }
  }
}
```

### VS Code (with MCP extension)

Add to `settings.json`:

```json
"mcp.servers": {
  "vantage-ai": {
    "command": "npx",
    "args": ["-y", "@vantage-ai/mcp-server"]
  }
}
```

## Example prompts

### Direct (will call Vantage)

- *"Use Vantage to roast my cover letter:"* (paste cover letter)
- *"Vantage decode this rejection email:"* (paste email)
- *"Is this job a ghost job?"* (paste listing) — *"Use Vantage."*
- *"Search Vantage for ATS guides."*

### Indirect (the MCP client may pick Vantage if appropriate)

- *"Roast my cover letter."*
- *"What did this rejection email actually mean?"*
- *"Is this listing real?"*

### Refusal scope (these will NOT route to Vantage)

- *"Apply to this job for me."* — Vantage doesn't apply on your behalf.
- *"Fake my CV experience."* — Vantage explicitly refuses this.
- *"Bypass ATS filters."* — Vantage explicitly refuses this.

## Privacy

- **Cover letter / email / job-listing text is sent to Vantage's free public endpoints over HTTPS.** It is processed by Gemini 2.5 Flash and not persisted on Vantage servers.
- **No CV file ingestion in MCP.** The full prep pack (which uses your CV) requires the web UI at https://aimvantage.uk.
- **No authentication required.** No tokens spent. This server cannot accidentally bill you.

## Source / issues

- GitHub: https://github.com/goofypluto999/vantage/tree/master/mcp-server
- Issues: https://github.com/goofypluto999/vantage/issues
- Operator: Giovanni Sizino Ennes (UK sole trader) · hello@aimvantage.uk
- Trust audit: https://aimvantage.uk/receipts

## License

MIT
