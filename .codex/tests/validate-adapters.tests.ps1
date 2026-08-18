$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$validator = Join-Path $repoRoot '.codex\validate-adapters.ps1'
$setup = Join-Path $repoRoot '.codex\setup-skill-links.ps1'

if (-not (Test-Path -LiteralPath $validator -PathType Leaf)) {
    throw "Validator not found: $validator"
}
if (-not (Test-Path -LiteralPath $setup -PathType Leaf)) {
    throw "Skill-link setup script not found: $setup"
}

& $validator -RepoRoot $repoRoot

$temporaryRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("codex-adapter-test-" + [guid]::NewGuid())
try {
    New-Item -ItemType Directory -Path (Join-Path $temporaryRoot '.claude\agents') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $temporaryRoot '.claude\skills\sample') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $temporaryRoot '.codex\agents') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $temporaryRoot '.agents\skills') -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $temporaryRoot '.claude\agents\sample.md') -Value "---`nname: sample`ndescription: sample`n---"
    Set-Content -LiteralPath (Join-Path $temporaryRoot '.claude\skills\sample\SKILL.md') -Value "---`nname: sample`ndescription: sample`n---"

    $failure = $null
    try {
        & $validator -RepoRoot $temporaryRoot
    }
    catch {
        $failure = $_.Exception.Message
    }
    if ($null -eq $failure) {
        throw 'Validator accepted a fixture with missing adapter and skill link.'
    }
    if ($failure -notmatch 'Missing agent adapter' -or $failure -notmatch 'Missing skill link') {
        throw "Validator did not report both expected failures:`n$failure"
    }

    & $setup -RepoRoot $temporaryRoot
    $createdLink = Get-Item -LiteralPath (Join-Path $temporaryRoot '.agents\skills\sample') -Force
    if (($createdLink.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -eq 0) {
        throw 'Setup did not create a directory link for the fixture skill.'
    }
}
finally {
    if (Test-Path -LiteralPath $temporaryRoot) {
        Remove-Item -LiteralPath $temporaryRoot -Recurse -Force
    }
}

Write-Output 'Codex adapter tests passed.'
