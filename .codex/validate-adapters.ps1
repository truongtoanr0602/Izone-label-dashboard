param(
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$errors = [System.Collections.Generic.List[string]]::new()
$claudeAgents = Join-Path $RepoRoot '.claude\agents'
$claudeSkills = Join-Path $RepoRoot '.claude\skills'
$codexAgents = Join-Path $RepoRoot '.codex\agents'
$codexSkills = Join-Path $RepoRoot '.agents\skills'

Get-ChildItem -LiteralPath $claudeAgents -File -Filter '*.md' | ForEach-Object {
    $name = $_.BaseName
    $adapter = Join-Path $codexAgents "$name.toml"
    if (-not (Test-Path -LiteralPath $adapter -PathType Leaf)) {
        $errors.Add("Missing agent adapter: .codex/agents/$name.toml")
        return
    }

    $content = Get-Content -Raw -LiteralPath $adapter
    foreach ($field in @('name', 'description', 'developer_instructions')) {
        if ($content -notmatch "(?m)^$field\s*=") {
            $errors.Add("Agent adapter $name.toml is missing required field: $field")
        }
    }
    if ($content -notmatch [regex]::Escape(".claude/agents/$name.md")) {
        $errors.Add("Agent adapter $name.toml does not reference .claude/agents/$name.md")
    }
}

Get-ChildItem -LiteralPath $claudeSkills -Directory | ForEach-Object {
    $name = $_.Name
    $linkPath = Join-Path $codexSkills $name
    if (-not (Test-Path -LiteralPath $linkPath -PathType Container)) {
        $errors.Add("Missing skill link: .agents/skills/$name")
        return
    }

    $link = Get-Item -LiteralPath $linkPath -Force
    if (($link.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -eq 0) {
        $errors.Add("Skill path is not a directory link: .agents/skills/$name")
        return
    }

    $expected = [System.IO.Path]::GetFullPath($_.FullName).TrimEnd('\')
    $actual = [System.IO.Path]::GetFullPath($link.Target[0]).TrimEnd('\')
    if ($actual -ne $expected) {
        $errors.Add("Skill link .agents/skills/$name targets '$actual', expected '$expected'")
    }
}

if ($errors.Count -gt 0) {
    throw ($errors -join [Environment]::NewLine)
}

Write-Output 'Codex agent adapters and skill links are valid.'
