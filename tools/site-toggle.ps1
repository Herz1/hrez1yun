param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $siteRoot '.site-server.pid'
$sitePort = 8000
$siteUrl = "http://127.0.0.1:$sitePort/index.html"

function Remove-StalePidFile {
    if (Test-Path -LiteralPath $pidFile) {
        Remove-Item -LiteralPath $pidFile -Force
    }
}

function Get-ListeningPids {
    $pattern = "^\s*TCP\s+127\.0\.0\.1:$sitePort\s+\S+\s+LISTENING\s+(\d+)\s*$"
    $pids = foreach ($line in (& netstat -ano -p tcp)) {
        $match = [regex]::Match($line, $pattern)
        if ($match.Success) {
            [int]$match.Groups[1].Value
        }
    }
    return @($pids | Sort-Object -Unique)
}

function Get-TrackedServer {
    if (-not (Test-Path -LiteralPath $pidFile)) {
        return $null
    }

    $pidText = (Get-Content -Raw -LiteralPath $pidFile).Trim()
    $pidParts = $pidText -split '\|', 2
    $serverPid = 0
    $startTicks = 0L
    if (
        $pidParts.Count -ne 2 `
        -or -not [int]::TryParse($pidParts[0], [ref]$serverPid) `
        -or -not [long]::TryParse($pidParts[1], [ref]$startTicks)
    ) {
        Remove-StalePidFile
        return $null
    }

    $processInfo = Get-Process -Id $serverPid -ErrorAction SilentlyContinue
    $listeningPids = Get-ListeningPids
    $actualStartTicks = if ($processInfo) {
        $processInfo.StartTime.ToUniversalTime().Ticks
    }
    else {
        0L
    }
    $isTrackedServer = $processInfo `
        -and $listeningPids -contains $serverPid `
        -and $actualStartTicks -eq $startTicks

    if (-not $isTrackedServer) {
        Remove-StalePidFile
        return $null
    }

    return $processInfo
}

$trackedServer = Get-TrackedServer
if ($trackedServer) {
    Stop-Process -Id $trackedServer.Id -Force
    Remove-StalePidFile
    Write-Host "幻想郷通信服务器已关闭（端口 $sitePort）。" -ForegroundColor Yellow
    Write-Host '已打开的浏览器标签页可直接手动关闭。'
    exit 0
}

$portOwners = Get-ListeningPids
if ($portOwners.Count -gt 0) {
    throw "端口 $sitePort 已被其他程序占用。脚本不会关闭未由它启动的进程。"
}

$python = Get-Command python -ErrorAction SilentlyContinue
$pythonArgs = @('-m', 'http.server', $sitePort, '--bind', '127.0.0.1')

if (-not $python) {
    $python = Get-Command py -ErrorAction SilentlyContinue
    $pythonArgs = @('-3', '-m', 'http.server', $sitePort, '--bind', '127.0.0.1')
}

if (-not $python) {
    throw '未找到 Python。请先安装 Python 3，并确保 python 或 py 命令可用。'
}

$serverProcess = Start-Process `
    -FilePath $python.Source `
    -ArgumentList $pythonArgs `
    -WorkingDirectory $siteRoot `
    -WindowStyle Hidden `
    -PassThru

$ready = $false
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 100

    try {
        $response = Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 1
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    }
    catch {
        # 服务器仍在启动，继续短暂等待。
    }
}

if (-not $ready) {
    if (-not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Remove-StalePidFile
    throw '本地服务器未能正常启动。'
}

$listenerPids = Get-ListeningPids
if ($listenerPids.Count -ne 1) {
    throw '服务器已响应，但未能确认监听进程。'
}

$listenerProcess = Get-Process -Id $listenerPids[0] -ErrorAction Stop
$listenerStartTicks = $listenerProcess.StartTime.ToUniversalTime().Ticks
Set-Content -LiteralPath $pidFile -Value "$($listenerProcess.Id)|$listenerStartTicks" -Encoding ascii

if (-not $NoBrowser) {
    Start-Process $siteUrl
}

Write-Host "幻想郷通信服务器已启动：$siteUrl" -ForegroundColor Green
Write-Host '再次双击“网站开关.cmd”即可关闭服务器。'
