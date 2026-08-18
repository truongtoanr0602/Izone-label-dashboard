param(
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$sourceRoot = Join-Path $RepoRoot '.claude\skills'
$linkRoot = Join-Path $RepoRoot '.agents\skills'

if (-not (Test-Path -LiteralPath $sourceRoot -PathType Container)) {
    throw "Canonical skill directory not found: $sourceRoot"
}

New-Item -ItemType Directory -Path $linkRoot -Force | Out-Null

Get-ChildItem -LiteralPath $sourceRoot -Directory | ForEach-Object {
    $linkPath = Join-Path $linkRoot $_.Name
    if (Test-Path -LiteralPath $linkPath) {
        $existing = Get-Item -LiteralPath $linkPath -Force
        if (($existing.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -eq 0) {
            throw "Refusing to replace non-link skill path: $linkPath"
        }
        return
    }

    New-Item -ItemType Junction -Path $linkPath -Target $_.FullName | Out-Null
}

Write-Output 'Codex skill links are ready.'
