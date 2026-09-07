# ================================================================
# TWINS VANTAGE — REGISTRO DE SERVICIO DE WINDOWS 24/7 PERMANENTE
# ================================================================

$taskName = "TwinsVantageTelemetryEngine"
$nodeExe = (Get-Command node.exe).Source
$scriptPath = "C:\Users\tajho\Desktop\TwinsVantage\twins_collector_core.js"
$workingDir = "C:\Users\tajho\Desktop\TwinsVantage"

Write-Host "Configurando Servicio de Windows para Twins Vantage..."
Write-Host "Node Path: $nodeExe"
Write-Host "Script:    $scriptPath"

# Remove old task if exists
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Create Action
$action = New-ScheduledTaskAction -Execute $nodeExe -Argument "`"$scriptPath`"" -WorkingDirectory $workingDir

# Create Triggers: At Startup and At Logon
$triggerLogon = New-ScheduledTaskTrigger -AtLogOn
$triggerStartup = New-ScheduledTaskTrigger -AtStartup

# Create Settings: Continuous Execution, Restart on Failure
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0 -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -MultipleInstances IgnoreNew -Hidden

# Register Scheduled Task under current user with Highest privileges
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger @($triggerLogon, $triggerStartup) -Settings $settings -RunLevel Highest -Force | Out-Null
    Write-Host "Servicio '$taskName' registrado exitosamente." -ForegroundColor Green
    
    # Start task now
    Start-ScheduledTask -TaskName $taskName
    Write-Host "Servicio '$taskName' iniciado en segundo plano." -ForegroundColor Green
} catch {
    Write-Host "Error registrando tarea: $_" -ForegroundColor Red
}
