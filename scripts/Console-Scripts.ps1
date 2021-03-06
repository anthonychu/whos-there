# Register helper functions
Set-Item function:global:Invoke-Npm {
  . $PSScriptRoot\Invoke-Npm.ps1 @args
} -Force

Set-Item function:global:Invoke-Ng {
  param([switch]$Async, $NgArgs)
  . $PSScriptRoot\Invoke-Ng.ps1 -Async:$Async $NgArgs
} -Force

Set-Item function:global:Start-Server {
  param(
      [switch]$Async,
      [switch]$OpenBrowser
  )

  $project_root = Split-Path $PSScriptRoot
  $api_root = Join-Path $project_root "api"
  Push-Location $api_root
  Start-Process npm.cmd start
  Start-Process npm.cmd run, watch
  Pop-Location

  $ngArgs = @("serve")
  if ($OpenBrowser) {
      $ngArgs += "--open"
  }
  Invoke-Ng -Async:$Async $ngArgs
} -Force

Set-Item function:global:Start-Tests {
  param(
      [switch]$Async
  )
  Invoke-Ng -Async:$Async test
} -Force

Set-Item function:global:Invoke-Build {
  Invoke-Npm run-script build
}

Set-Item function:global:Update-DevEnvironment {
  param([switch]$Verbose)
  . $PSScriptRoot\Update.ps1 -Verbose:$Verbose
} -Force
