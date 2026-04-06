Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectRoot

function Resolve-PythonLauncher {
  $command = Get-Command py -ErrorAction SilentlyContinue
  if ($command) {
    return "py"
  }

  $command = Get-Command python -ErrorAction SilentlyContinue
  if ($command) {
    return "python"
  }

  $candidates = @(
    "C:\Users\kolisnyk.o\AppData\Local\Microsoft\WindowsApps\python.exe",
    "C:\Users\kolisnyk.o\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\python.exe",
    "C:\Users\kolisnyk.o\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.10_qbz5n2kfra8p0\python.exe",
    "C:\Users\kolisnyk.o\AppData\Local\Programs\Python\Python311\python.exe",
    "C:\Users\kolisnyk.o\AppData\Local\Programs\Python\Python310\python.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return $candidate
    }
  }

  throw "No Python launcher was found. Install Python 3.11+ or add it to PATH."
}

function Stop-ListeningPythonProcess {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port
  )

  $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($connectionPid in $connections) {
    try {
      $process = Get-Process -Id $connectionPid -ErrorAction Stop
      if ($process.ProcessName -like "python*") {
        Stop-Process -Id $connectionPid -Force
      }
    } catch {
      continue
    }
  }
}

$launcher = Resolve-PythonLauncher

$venvPath = if ($env:SORTSMART_VENV_PATH) {
  $env:SORTSMART_VENV_PATH
} else {
  Join-Path $HOME ".venvs\sortsmart-ukraine"
}

if (-not (Test-Path -LiteralPath $venvPath)) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $venvPath) | Out-Null
  & $launcher -m venv $venvPath
}

$venvPython = Join-Path $venvPath "Scripts\python.exe"
$requirementsFile = Join-Path $projectRoot "requirements.txt"
$requirementsStamp = Join-Path $venvPath ".requirements.stamp"
$requirementsVersion = (Get-Item -LiteralPath $requirementsFile).LastWriteTimeUtc.Ticks.ToString()

if ((-not (Test-Path -LiteralPath $requirementsStamp)) -or ((Get-Content -LiteralPath $requirementsStamp -ErrorAction SilentlyContinue) -ne $requirementsVersion)) {
  & $venvPython -m pip install -r $requirementsFile
  Set-Content -LiteralPath $requirementsStamp -Value $requirementsVersion
}

$streamlitPort = if ($env:SORTSMART_STREAMLIT_PORT) {
  [int]$env:SORTSMART_STREAMLIT_PORT
} else {
  8501
}

$dashboardCache = Join-Path $projectRoot "dashboard\__pycache__"
if (Test-Path -LiteralPath $dashboardCache) {
  Remove-Item -LiteralPath $dashboardCache -Recurse -Force
}

Stop-ListeningPythonProcess -Port $streamlitPort

$env:PYTHONPATH = "src"
& $venvPython -m sortsmart_ukraine.pipeline.run_local
Write-Host "Opening Streamlit on http://localhost:$streamlitPort"
& $venvPython -m streamlit run dashboard/app.py --server.port $streamlitPort
