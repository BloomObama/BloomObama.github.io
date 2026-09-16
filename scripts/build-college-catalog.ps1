param(
  [string]$InputCsv = (Join-Path (Split-Path -Parent $PSScriptRoot) "Most-Recent-Cohorts-Institution_05192025.csv"),
  [string]$OutputJs = (Join-Path (Split-Path -Parent $PSScriptRoot) "college-catalog.js")
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$schools = Import-Csv -LiteralPath $InputCsv |
  Where-Object {
    $_.CURROPER -eq "1" -and
    $_.MAIN -eq "1" -and
    $_.PREDDEG -eq "3" -and
    -not [string]::IsNullOrWhiteSpace($_.INSTNM)
  } |
  Sort-Object INSTNM |
  ForEach-Object {
    $unitId = [int]$_.UNITID
    $name = $_.INSTNM.Trim()
    $city = $_.CITY.Trim()
    $state = $_.STABBR.Trim()
    $website = $_.INSTURL.Trim()

    if ([string]::IsNullOrWhiteSpace($website) -or $website -eq "NULL") {
      $scorecardName = ($name -replace "[^A-Za-z0-9]+", "-").Trim("-")
      $website = "https://collegescorecard.ed.gov/school/?$unitId-$scorecardName"
    } elseif ($website -notmatch "^https?://") {
      $website = "https://$website"
    }

    ,([object[]]@($unitId, $name, $city, $state, $website))
  }

$json = ConvertTo-Json -InputObject @($schools) -Compress -Depth 3
$header = @"
/*
 * Basic U.S. college directory generated from the U.S. Department of Education
 * College Scorecard institution-level release dated May 19, 2025.
 * Source: https://catalog.data.gov/dataset/college-scorecard
 * Scope: operating main campuses whose predominant award is a bachelor's degree.
 * Detailed admissions and aid fields intentionally remain unverified.
 */
globalThis.FullRideBasicColleges =
"@

$content = "$header$json;`n"
[System.IO.File]::WriteAllText($OutputJs, $content, [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated $($schools.Count) basic college records in $OutputJs"
