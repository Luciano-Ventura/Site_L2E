# scripts/validar-dados.ps1
# Script de auditoria e validacao da consistencia dos dados institucionais da L2E

param (
    [string]$WorkspacePath = (Resolve-Path "$PSScriptRoot\..").Path
)

$ErrorActionPreference = "Stop"
$TotalChecks = 0
$PassedChecks = 0
$FailedChecks = 0

function Assert-Condition {
    param (
        [string]$Description,
        [bool]$Condition,
        [string]$Details = ""
    )
    $script:TotalChecks++
    if ($Condition) {
        $script:PassedChecks++
        Write-Host "  [OK] $Description" -ForegroundColor Green
    } else {
        $script:FailedChecks++
        Write-Host "  [FALHA] $Description" -ForegroundColor Red
        if ($Details) {
            Write-Host "         $Details" -ForegroundColor Yellow
        }
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Auditoria de Consistencia Institucional - L2E Tecnologia" -ForegroundColor Cyan
Write-Host " Workspace: $WorkspacePath" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

$IndexHtmlPath = Join-Path $WorkspacePath "index.html"
$ApresentacaoHtmlPath = Join-Path $WorkspacePath "apresentacao\index.html"
$ConfigJsPath = Join-Path $WorkspacePath "assets\js\l2e-config.js"
$ScriptJsPath = Join-Path $WorkspacePath "script.js"

# 1. Existencia dos arquivos principais
Assert-Condition "Arquivo index.html existe" (Test-Path $IndexHtmlPath)
Assert-Condition "Arquivo apresentacao/index.html existe" (Test-Path $ApresentacaoHtmlPath)
Assert-Condition "Arquivo assets/js/l2e-config.js existe" (Test-Path $ConfigJsPath)
Assert-Condition "Arquivo script.js existe" (Test-Path $ScriptJsPath)

$IndexContent = if (Test-Path $IndexHtmlPath) { [System.IO.File]::ReadAllText($IndexHtmlPath, [System.Text.Encoding]::UTF8) } else { "" }
$ApresContent = if (Test-Path $ApresentacaoHtmlPath) { [System.IO.File]::ReadAllText($ApresentacaoHtmlPath, [System.Text.Encoding]::UTF8) } else { "" }
$ConfigContent = if (Test-Path $ConfigJsPath) { [System.IO.File]::ReadAllText($ConfigJsPath, [System.Text.Encoding]::UTF8) } else { "" }

Write-Host "`n-- Verificacao de Localizacao (Sao Jose / SC) --" -ForegroundColor Yellow

# Verificar se Florianopolis ainda aparece como sede
$FlorianopolisHomeMatches = [regex]::Matches($IndexContent, "Florian[o\u00f3]polis", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$FlorianopolisApresMatches = [regex]::Matches($ApresContent, "Florian[o\u00f3]polis", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

Assert-Condition "index.html nao contem Florianopolis como sede" ($FlorianopolisHomeMatches.Count -eq 0) "Ocorrencias encontradas na Home: $($FlorianopolisHomeMatches.Count)"
Assert-Condition "apresentacao/index.html nao contem Florianopolis como sede" ($FlorianopolisApresMatches.Count -eq 0) "Ocorrencias encontradas na Apresentacao: $($FlorianopolisApresMatches.Count)"

# Verificar presenca de Sao Jose
Assert-Condition "index.html identifica Sao Jose no contato" ($IndexContent -match "S[a\u00e3]o Jos[e\u00e9],\s*SC")
Assert-Condition "index.html identifica Sao Jose no rodape" ($IndexContent -match "S[a\u00e3]o Jos[e\u00e9]")
Assert-Condition "apresentacao/index.html identifica Sao Jose no alcance" ($ApresContent -match "S[a\u00e3]o Jos[e\u00e9]")
Assert-Condition "apresentacao/index.html identifica Sao Jose no rodape" ($ApresContent -match "S[a\u00e3]o Jos[e\u00e9]")
Assert-Condition "l2e-config.js possui cidade Sao Jose e UF SC" ($ConfigContent -match 'cidade:\s*"S[a\u00e3]o Jos[e\u00e9]"' -and $ConfigContent -match 'uf:\s*"SC"')

Write-Host "`n-- Verificacao de CNPJ (69.585.506/0001-06) --" -ForegroundColor Yellow
$CnpjExpected = "69.585.506/0001-06"
Assert-Condition "CNPJ presente no rodape de index.html" ($IndexContent.Contains($CnpjExpected))
Assert-Condition "CNPJ presente no rodape de apresentacao/index.html" ($ApresContent.Contains($CnpjExpected))
Assert-Condition "CNPJ presente na configuracao central l2e-config.js" ($ConfigContent.Contains($CnpjExpected))

Write-Host "`n-- Verificacao de Schema.org / Dados Estruturados --" -ForegroundColor Yellow
Assert-Condition "Schema.org em index.html contem addressLocality Sao Jose" ($IndexContent -match '"addressLocality":\s*"S[a\u00e3]o Jos[e\u00e9]"')
Assert-Condition "Schema.org em index.html contem addressRegion SC" ($IndexContent -match '"addressRegion":\s*"SC"')
Assert-Condition "Schema.org em index.html contem taxID com CNPJ oficial" ($IndexContent -match '"taxID":\s*"69\.585\.506/0001-06"')

Write-Host "`n-- Verificacao de Contatos e Links Funcionais --" -ForegroundColor Yellow
$EmailExpected = "contato.l2etec@gmail.com"
$PhoneExpected = "99932-4253"
$WaNumExpected = "5548999324253"

Assert-Condition "Link mailto: funcional em index.html" ($IndexContent -match "mailto:$EmailExpected")
Assert-Condition "Link tel: funcional em index.html" ($IndexContent -match "tel:\+?$WaNumExpected")
Assert-Condition "Link mailto: funcional em apresentacao/index.html" ($ApresContent -match "mailto:$EmailExpected")
Assert-Condition "Link tel: funcional em apresentacao/index.html" ($ApresContent -match "tel:\+?$WaNumExpected")

Write-Host "`n-- Verificacao de Inclusao do l2e-config.js --" -ForegroundColor Yellow
Assert-Condition "index.html inclui assets/js/l2e-config.js" ($IndexContent -match 'assets/js/l2e-config\.js')
Assert-Condition "apresentacao/index.html inclui ../assets/js/l2e-config.js" ($ApresContent -match '\.\./assets/js/l2e-config\.js')

Write-Host "`n==========================================================" -ForegroundColor Cyan
$ResultColor = if ($FailedChecks -eq 0) { "Green" } else { "Red" }
Write-Host " Resultado da Auditoria: $PassedChecks/$TotalChecks verificacoes aprovadas" -ForegroundColor $ResultColor
if ($FailedChecks -gt 0) {
    Write-Host " Falhas detectadas: $FailedChecks" -ForegroundColor Red
    exit 1
} else {
    Write-Host " Todos os criterios institucionais validados com sucesso!" -ForegroundColor Green
    exit 0
}
