$ErrorActionPreference = 'Stop'
$auditDir = Join-Path $env:TEMP 'pam-ai-excel-audit-20260905'
$source = Join-Path $PSScriptRoot '..\..\pam-ai\bronnen\PAM-AI_v1.1_Praktijkinstrument.xlsx'
New-Item -ItemType Directory -Force -Path $auditDir | Out-Null
$copy = Join-Path $auditDir 'PAM-AI-testcopy.xlsx'
Copy-Item -LiteralPath $source -Destination $copy -Force
$excel = $null
$book = $null
$results = [Collections.Generic.List[object]]::new()
$specs = @(
  @{ id='perfect_30'; n=30; accepted=30; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging' },
  @{ id='perfect_189'; n=189; accepted=189; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging' },
  @{ id='perfect_188'; n=188; accepted=188; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging' },
  @{ id='observed_failure'; n=189; accepted=160; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging' },
  @{ id='missing_cost'; n=189; accepted=189; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging'; missingCost=$true },
  @{ id='pilot_more_evidence'; n=30; accepted=30; critical=0; route='R1'; scope='Gecontroleerde pilot'; conditions=$true },
  @{ id='gate1_fail'; n=189; accepted=189; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging'; gateFail=$true },
  @{ id='multiple_proportional_options'; n=189; accepted=189; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging'; multiple=$true },
  @{ id='no_preferred_candidate'; n=189; accepted=189; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging'; multiple=$true; noSelection=$true },
  @{ id='r1_broader_scope_source_gap'; n=189; accepted=189; critical=0; route='R1'; scope='Volledige proportionaliteitsafweging' },
  @{ id='pilot_without_conditions'; n=30; accepted=30; critical=0; route='R1'; scope='Gecontroleerde pilot' },
  @{ id='missing_gate1_evidence'; n=189; accepted=189; critical=0; route='R2'; scope='Volledige proportionaliteitsafweging'; missingGateEvidence=$true },
  @{ id='critical_error_failure'; n=189; accepted=189; critical=10; route='R2'; scope='Volledige proportionaliteitsafweging' }
)
try {
  $excel = New-Object -ComObject Excel.Application
  $excel.Visible = $false
  $excel.DisplayAlerts = $false
  $excel.EnableEvents = $false
  $excel.AutomationSecurity = 3
  $excelVersion = $excel.Version
  foreach ($spec in $specs) {
    $book = $excel.Workbooks.Open($copy, 0, $false)
    $intake = $book.Worksheets.Item('01_Intake')
    $candidates = $book.Worksheets.Item('02_Kandidaten')
    $gate = $book.Worksheets.Item('03_Poort1')
    $cases = $book.Worksheets.Item('05_Testcases')
    $analysis = $book.Worksheets.Item('06_Analyse')
    $comparison = $book.Worksheets.Item('08_Vergelijking')
    $decision = $book.Worksheets.Item('09_Besluit')
    $intake.Range('B13').Value2 = 'FICTIEF testbesluiteigenaar'
    $intake.Range('B16').Value2 = $spec.scope
    $intake.Range('B19').Value2 = $(if ($spec.route -eq 'R1') {'Laag'} else {'Middel'})
    $intake.Range('B20').Value2 = 'Ja'
    $intake.Range('B21:B22').Value2 = 'Nee'
    $intake.Range('B23').Value2 = 'Beperkt'
    $intake.Range('B24:B25').Value2 = 'Nee'
    $intake.Range('B27').Value2 = $spec.route
    $candidates.Range('B5').Value2 = 'Klassieke software'
    $candidates.Range('C5').Value2 = 'FICTIEF controlealternatief'
    $gate.Range('C5:J5').Value2 = 'PASS'
    if (!$spec.missingGateEvidence) { $gate.Range('K5').Value2 = 'FICTIEF-EVIDENCE-001' }
    if ($spec.gateFail) { $gate.Range('C5').Value2 = 'FAIL' }
    $analysis.Range('N5:O5').Value2 = 'Ja'
    $comparison.Range('Q5').Value2 = $(if ($spec.multiple) {'MULTIPLE PROPORTIONAL OPTIONS'} else {'PROPORTIONATE'})
    $comparison.Range('R5').Value2 = 'FICTIEVE afweging voor formulecontrole'
    $comparison.Range('S5').Value2 = 'Ja'
    $decision.Range('B6').Value2 = 'C01'
    foreach ($ref in @('B18','B21','B24','B27','B33')) { $decision.Range($ref).Value2 = 'FICTIEVE fixtureonderbouwing' }
    if ($spec.conditions) { $decision.Range('B30').Value2 = 'FICTIEF: alleen begrensde pilot, menselijke controle, stop bij incident, aanvullend bewijs voor brede inzet' }
    $data = New-Object 'object[,]' $spec.n,21
    for ($i=0; $i -lt $spec.n; $i++) {
      $data[$i,0] = 'FICTIEF-RUN-'+($i+1)
      $data[$i,1] = 'C01'
      $data[$i,2] = 'FICTIEF-CASE-'+($i+1)
      $data[$i,3] = 'FICTIEF-S1'
      $data[$i,4] = [double]$(if ($i -lt $spec.accepted) {1} else {0})
      $data[$i,5] = [double]$(if ($i -lt $spec.critical) {1} else {0})
      $data[$i,7] = [double]1
      $data[$i,8] = [double]0
      $data[$i,9] = [double]2
      $data[$i,10] = [double]1
      $data[$i,11] = [double]5
      if (!($spec.missingCost -and $i -eq 0)) { $data[$i,12] = [double]0.02 }
      $data[$i,19] = 'FICTIEF-EVIDENCE-001'
      $data[$i,20] = 'UITSLUITEND FICTIEVE REKENTEST'
    }
    $lastRow = $spec.n + 5
    $cases.Range('A6:A'+$lastRow).Formula = '="FICTIEF-RUN-"&ROW()'
    $cases.Range('B6:B'+$lastRow).Value2 = 'C01'
    $cases.Range('C6:C'+$lastRow).Formula = '="FICTIEF-CASE-"&ROW()'
    $cases.Range('D6:D'+$lastRow).Value2 = 'FICTIEF-S1'
    $cases.Range('E6:E'+$lastRow).Value2 = [double]0
    $cases.Range('F6:F'+$lastRow).Value2 = [double]0
    if ($spec.accepted -gt 0) { $cases.Range('E6:E'+($spec.accepted+5)).Value2 = [double]1 }
    if ($spec.critical -gt 0) { $cases.Range('F6:F'+($spec.critical+5)).Value2 = [double]1 }
    $cases.Range('H6:H'+$lastRow).Value2 = [double]1
    $cases.Range('I6:I'+$lastRow).Value2 = [double]0
    $cases.Range('J6:J'+$lastRow).Value2 = [double]2
    $cases.Range('K6:K'+$lastRow).Value2 = [double]1
    $cases.Range('L6:L'+$lastRow).Value2 = [double]5
    $cases.Range('M6:M'+$lastRow).Value2 = [double]0.02
    if ($spec.missingCost) { $cases.Range('M6').ClearContents() | Out-Null }
    $cases.Range('T6:T'+$lastRow).Value2 = 'FICTIEF-EVIDENCE-001'
    $cases.Range('U6:U'+$lastRow).Value2 = 'UITSLUITEND FICTIEVE REKENTEST'
    if ($spec.multiple) {
      $candidates.Range('B6').Value2 = 'Klassieke software'
      $candidates.Range('C6').Value2 = 'FICTIEF gelijkwaardig alternatief'
      $gate.Range('C6:J6').Value2 = 'PASS'
      $gate.Range('K6').Value2 = 'FICTIEF-EVIDENCE-002'
      $analysis.Range('N6:O6').Value2 = 'Ja'
      $comparison.Range('Q6').Value2 = 'MULTIPLE PROPORTIONAL OPTIONS'
      $comparison.Range('R6').Value2 = 'FICTIEF: beide alternatieven gelijke prestaties en lasten; geen numerieke winnaar'
      $comparison.Range('S6').Value2 = 'Ja'
      $secondStart=$lastRow+1; $secondEnd=$lastRow+$spec.n
      $cases.Range('A6:U'+$lastRow).Copy($cases.Range('A'+$secondStart))
      $cases.Range('B'+$secondStart+':B'+$secondEnd).Value2 = 'C02'
      $cases.Range('C'+$secondStart+':C'+$secondEnd).Formula = ('="FICTIEF-CASE-"&(ROW()-'+$spec.n+')')
      $cases.Range('T'+$secondStart+':T'+$secondEnd).Value2 = 'FICTIEF-EVIDENCE-002'
      if ($spec.noSelection) { $decision.Range('B6').ClearContents() | Out-Null }
    }
    $excel.CalculateFullRebuild()
    $outputs = [ordered]@{}
    foreach ($ref in @('B26','B31','B32','B33','B34','B35','B36','B37')) { $outputs['01_Intake!'+$ref] = $intake.Range($ref).Value2 }
    $outputs['03_Poort1!M5'] = $gate.Range('M5').Value2
    foreach ($ref in @('C5','D5','E5','F5','G5','H5','I5','J5','K5','L5','M5','N5','O5','P5','C18','D18','E18','F18','G18','H18','I18','J18','K18','L18','M18','N18')) { $outputs['06_Analyse!'+$ref] = $analysis.Range($ref).Value2 }
    foreach ($ref in @('B8','B9','B10','B11','B12','B13','B14','B44','B46')) { $outputs['09_Besluit!'+$ref] = $decision.Range($ref).Value2 }
    if ($spec.multiple) { foreach ($ref in @('P6','C19','D19','I6','L6')) { $outputs['06_Analyse!'+$ref]=$analysis.Range($ref).Value2 } };
    $n=[double]$spec.n; $z=[double]1.96; $p=[double]$spec.accepted/$n; $q=[double]$spec.critical/$n
    $lower=($p+$z*$z/(2*$n)-$z*[Math]::Sqrt(($p*(1-$p)+$z*$z/(4*$n))/$n))/(1+$z*$z/$n)
    $upper=($q+$z*$z/(2*$n)+$z*[Math]::Sqrt(($q*(1-$q)+$z*$z/(4*$n))/$n))/(1+$z*$z/$n)
    $results.Add([ordered]@{id=$spec.id; fixture=$spec; inputs=[ordered]@{successThreshold=0.9; criticalThreshold=0.02; z=1.96; baseMinimumN=30; costPerTask=0.02; verificationMinutesPerTask=2; correctionMinutesPerTask=1; latencySecondsPerTask=5; callsPerTask=1; retriesPerTask=0; environmentValues=$null; notes='All data and evidence identifiers fictitious. All records final accepted and critical values according to fixture counts. Gate1 statuses PASS except marked mutation. Context and comparison manually asserted for fixture. Required decision narrative fields populated.'}; excel=$outputs; independentWilson=[ordered]@{lower=$lower; upper=$upper; lowerDifference=[double]$outputs['06_Analyse!I5']-$lower; upperDifference=[double]$outputs['06_Analyse!L5']-$upper}})
    Write-Output ($spec.id+': '+$outputs['06_Analyse!P5']+' / '+$outputs['09_Besluit!B46'])
    $book.Close($false)
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($book)
    $book=$null
  }
  $report=[ordered]@{ sourceFile=$source; sourceSha256=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash; verifiedAt=(Get-Date).ToString('o'); engine='Microsoft Excel COM CalculateFullRebuild'; engineVersion=$excelVersion; sourceModified=$false; fixtureExplanation='Each fixture opens same independent temporary source copy and closes without saving. Decision narrative/evidence values are fictitious test scaffolding. Numerical outputs read directly after full Excel recalculation. Independent Wilson implementation uses same source formula in PowerShell only for cross-check.'; results=$results }
  $jsonPath=Join-Path $auditDir 'excel-fixtures.json'
  $report | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath $jsonPath -Encoding UTF8
  Write-Output ('RESULT '+$jsonPath)
} finally {
  if ($book) { $book.Close($false); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($book) }
  if ($excel) { $excel.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($excel) }
  [GC]::Collect(); [GC]::WaitForPendingFinalizers()
}
