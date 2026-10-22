# Build the Android debug APK from any current working directory.
# Java 21 is selected only inside this PowerShell process.
$ErrorActionPreference = 'Stop'
$project = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$jdkRoot = 'C:\Program Files\Eclipse Adoptium'
$jdk = Get-ChildItem -Path $jdkRoot -Directory -Filter 'jdk-21*' -ErrorAction SilentlyContinue |
       Sort-Object Name -Descending | Select-Object -First 1
if (-not $jdk) {
  throw "JDK 21 introuvable dans $jdkRoot. Installer Eclipse Temurin 21 avant de compiler."
}
$env:JAVA_HOME = $jdk.FullName
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Write-Host "Java : $env:JAVA_HOME"
Push-Location $project
try {
  & npm.cmd run android:sync
  if ($LASTEXITCODE -ne 0) { throw "Echec de npm run android:sync (code $LASTEXITCODE)." }
  Push-Location (Join-Path $project 'android')
  try {
    & .\gradlew.bat assembleDebug
    if ($LASTEXITCODE -ne 0) { throw "Echec de Gradle assembleDebug (code $LASTEXITCODE)." }
  } finally {
    Pop-Location
  }
  Write-Host "APK prete : $(Join-Path $project 'android\app\build\outputs\apk\debug\app-debug.apk')"
} finally {
  Pop-Location
}
