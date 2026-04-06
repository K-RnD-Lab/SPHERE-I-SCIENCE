param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectId,

  [Parameter(Mandatory = $true)]
  [string]$KeyFile,

  [string]$Dataset = "sortsmart_raw",
  [string]$Location = "EU"
)

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

function Resolve-GitPath {
  $command = Get-Command git -ErrorAction SilentlyContinue
  if ($command) {
    return Split-Path -Parent $command.Source
  }

  $candidates = @(
    "C:\Users\kolisnyk.o\AppData\Local\Programs\Git\cmd",
    "C:\Program Files\Git\cmd",
    "C:\Program Files\Git\bin"
  )

  foreach ($candidate in $candidates) {
    $gitExe = Join-Path $candidate "git.exe"
    if (Test-Path -LiteralPath $gitExe) {
      return $candidate
    }
  }

  return $null
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

$env:PYTHONPATH = "src"
$env:GOOGLE_CLOUD_PROJECT = $ProjectId
$env:GOOGLE_APPLICATION_CREDENTIALS = $KeyFile
$env:BQ_DATASET = $Dataset
$env:BQ_LOCATION = $Location

$gitDir = Resolve-GitPath
if ($gitDir) {
  $env:PATH = "$gitDir;$env:PATH"
}

if (-not (Test-Path -LiteralPath $KeyFile)) {
  throw "Key file not found: $KeyFile"
}

$dbtDir = Join-Path $HOME ".dbt"
New-Item -ItemType Directory -Force -Path $dbtDir | Out-Null

$templatePath = Join-Path $projectRoot "dbt\profiles.example.yml"
$template = Get-Content -Raw -LiteralPath $templatePath
$profile = $template.Replace("your-project-id", $ProjectId)
$profile = $profile.Replace("dataset: sortsmart_raw", "dataset: $Dataset")
$profile = $profile.Replace("location: EU", "location: $Location")
$profile = $profile.Replace("C:\\Users\\kolisnyk.o\\.secrets\\sortsmart-bq.json", $KeyFile)
Set-Content -LiteralPath (Join-Path $dbtDir "profiles.yml") -Value $profile

& $venvPython -m sortsmart_ukraine.warehouse.bootstrap_bigquery
& $venvPython -m sortsmart_ukraine.warehouse.load_bigquery
& $venvPython -c "from dbt.cli.main import dbtRunner; import sys; res=dbtRunner().invoke(sys.argv[1:]); sys.exit(0 if res.success else 1)" debug --project-dir dbt
& $venvPython -c "from dbt.cli.main import dbtRunner; import sys; res=dbtRunner().invoke(sys.argv[1:]); sys.exit(0 if res.success else 1)" seed --project-dir dbt
& $venvPython -c "from dbt.cli.main import dbtRunner; import sys; res=dbtRunner().invoke(sys.argv[1:]); sys.exit(0 if res.success else 1)" run --project-dir dbt
