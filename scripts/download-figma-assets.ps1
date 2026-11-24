$ErrorActionPreference = "Stop"

# Run from the Link-Vault project folder:
# powershell -ExecutionPolicy Bypass -File .\scripts\download-figma-assets.ps1

$projectRoot = Split-Path -Parent $PSScriptRoot
$assetFolder = Join-Path $projectRoot "public\assets\figma"
New-Item -ItemType Directory -Force -Path $assetFolder | Out-Null

$assets = [ordered]@{
    "react-reference.png" = "https://www.figma.com/api/mcp/asset/13eeeb37-9676-46bb-bde7-b19bade6d31d.png"
    "tailwind-reference.png" = "https://www.figma.com/api/mcp/asset/41fb9985-b274-4013-ae52-40b5338e8a04.png"
    "brand-mark.svg" = "https://www.figma.com/api/mcp/asset/90f71ac2-a692-4af4-b616-c47508812c57.svg"
    "all-bookmarks.svg" = "https://www.figma.com/api/mcp/asset/15585668-d7fb-4d85-b530-01c2dad3c888.svg"
    "favorites.svg" = "https://www.figma.com/api/mcp/asset/ae1573c2-3994-404d-8ca5-caa5a7deb0d7.svg"
    "new-collection.svg" = "https://www.figma.com/api/mcp/asset/6ac82c0f-0692-48b1-af5c-9f0be84ab856.svg"
    "collection-folder.svg" = "https://www.figma.com/api/mcp/asset/9867cad9-750e-477b-bc69-67828fc2f1b0.svg"
    "search.svg" = "https://www.figma.com/api/mcp/asset/a3dc0976-a9c9-4a6c-ab2d-a8613387a540.svg"
    "sort.svg" = "https://www.figma.com/api/mcp/asset/c8f41eb5-de71-4edb-b88f-1ff7d765d6b3.svg"
    "view-grid.svg" = "https://www.figma.com/api/mcp/asset/4f5e778d-d90a-4f64-bd03-6c640242c3e6.svg"
    "view-list.svg" = "https://www.figma.com/api/mcp/asset/419fbaa2-cf2e-4524-b889-eb3e4b39ddd4.svg"
    "settings.svg" = "https://www.figma.com/api/mcp/asset/0ef5314b-7649-4314-936b-4514aea4dab8.svg"
    "bookmark.svg" = "https://www.figma.com/api/mcp/asset/7188532f-09a2-488f-a311-0dafc8718381.svg"
    "external-link.svg" = "https://www.figma.com/api/mcp/asset/8a982396-c271-47a0-b62b-042b02520c49.svg"
    "star.svg" = "https://www.figma.com/api/mcp/asset/0cd7d6e5-757e-4af7-b798-ee574cb01889.svg"
    "copy.svg" = "https://www.figma.com/api/mcp/asset/eeb1b317-5944-4705-8bfc-28fb6e607222.svg"
    "more.svg" = "https://www.figma.com/api/mcp/asset/c60b1de6-abe9-4b01-9676-147d1373405a.svg"
    "trash.svg" = "https://www.figma.com/api/mcp/asset/0989df01-50bb-4824-9a29-f13fc216df87.svg"
    "placeholder.svg" = "https://www.figma.com/api/mcp/asset/61a2759f-2546-41cc-b161-44ed109a4193.svg"
    "huggingface-logo.svg" = "https://www.figma.com/api/mcp/asset/854b6d0f-a0e4-4bca-aed8-9b5120d8999a.svg"
}

$downloaded = 0
$failed = @()

foreach ($entry in $assets.GetEnumerator()) {
    $destination = Join-Path $assetFolder $entry.Key
    try {
        Invoke-WebRequest -Uri $entry.Value -OutFile $destination -TimeoutSec 30 -Headers @{
            "User-Agent" = "Mozilla/5.0 LinkVaultAssetDownloader"
        }
        $file = Get-Item $destination
        if ($file.Length -lt 80) {
            throw "Downloaded file is unexpectedly small ($($file.Length) bytes)."
        }
        Write-Host "[OK] $($entry.Key) ($($file.Length) bytes)" -ForegroundColor Green
        $downloaded++
    }
    catch {
        if (Test-Path $destination) { Remove-Item $destination -Force }
        Write-Warning "Could not download $($entry.Key): $($_.Exception.Message)"
        $failed += $entry.Key
    }
}

Write-Host ""
Write-Host "Downloaded: $downloaded / $($assets.Count)"
if ($failed.Count -gt 0) {
    Write-Warning "These original Figma assets could not be downloaded. The UI has fallbacks for missing files:"
    $failed | ForEach-Object { Write-Host " - $_" }
    Write-Warning "Figma asset URLs can expire. Re-export the assets from the Figma viewer if the links have expired."
}
