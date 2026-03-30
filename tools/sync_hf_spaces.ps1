param(
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$spaceMappings = @(
    @{
        Name = "Learning-Playground_03-2026"
        Source = "https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026"
        Target = "spaces/learning-playground"
    },
    @{
        Name = "Cancer-Research-Suite_03-2026"
        Source = "https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026"
        Target = "spaces/cancer-research-suite"
    },
    @{
        Name = "PHYLO-03_2026-01_A1-brca2-mirna"
        Source = "https://huggingface.co/spaces/K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna"
        Target = "spaces/phylo-brca2-mirna"
    }
)

$cacheRoot = Join-Path $env:TEMP "krnd_hf_space_cache"
New-Item -ItemType Directory -Force -Path $cacheRoot | Out-Null

function Sync-Space {
    param([hashtable]$Mapping)

    $cacheDir = Join-Path $cacheRoot $Mapping.Name
    $targetDir = Join-Path $RepoRoot $Mapping.Target

    if (Test-Path (Join-Path $cacheDir ".git")) {
        git -C $cacheDir pull --ff-only | Out-Host
    }
    else {
        git clone --depth 1 $Mapping.Source $cacheDir | Out-Host
    }

    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

    Get-ChildItem -Force $targetDir | Where-Object { $_.Name -ne '.gitkeep' } | Remove-Item -Recurse -Force

    Get-ChildItem -Force $cacheDir | Where-Object { $_.Name -ne '.git' } | ForEach-Object {
        Copy-Item $_.FullName -Destination $targetDir -Recurse -Force
    }

    $syncNote = @(
        "Source: $($Mapping.Source)"
        "SyncedAt: $(Get-Date -Format s)"
        "Target: $($Mapping.Target)"
    ) -join [Environment]::NewLine

    Set-Content -Path (Join-Path $targetDir 'SYNC_SOURCE.txt') -Value $syncNote -Encoding UTF8
}

foreach ($mapping in $spaceMappings) {
    Write-Host "Syncing $($mapping.Name) -> $($mapping.Target)"
    Sync-Space -Mapping $mapping
}

Write-Host "Done."
