param(
  [string]$InputCsv = (Join-Path (Split-Path -Parent $PSScriptRoot) "Most-Recent-Cohorts-Institution_05192025.csv"),
  [string]$OutputJs = (Join-Path (Split-Path -Parent $PSScriptRoot) "college-directory.js")
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$schools = Import-Csv -LiteralPath $InputCsv |
  Where-Object {
    $_.CURROPER -eq "1" -and
    $_.MAIN -eq "1" -and
    $_.PREDDEG -ne "3" -and
    -not [string]::IsNullOrWhiteSpace($_.INSTNM)
  } |
  Sort-Object INSTNM, UNITID |
  ForEach-Object {
    $unitId = [int]$_.UNITID
    $name = $_.INSTNM.Trim()
    $city = $_.CITY.Trim()
    $state = $_.STABBR.Trim()
    $website = $_.INSTURL.Trim()
    $predominantDegree = if ($_.PREDDEG -match "^\d+$") { [int]$_.PREDDEG } else { $null }
    $highestDegree = if ($_.HIGHDEG -match "^\d+$") { [int]$_.HIGHDEG } else { $null }

    if ([string]::IsNullOrWhiteSpace($website) -or $website -eq "NULL") {
      $scorecardName = ($name -replace "[^A-Za-z0-9]+", "-").Trim("-")
      $website = "https://collegescorecard.ed.gov/school/?$unitId-$scorecardName"
    } elseif ($website -notmatch "^https?://") {
      $website = "https://$website"
    }

    ,([object[]]@($unitId, $name, $city, $state, $website, $predominantDegree, $highestDegree))
  }

$json = ConvertTo-Json -InputObject @($schools) -Compress -Depth 2
$header = @"
/*
 * Basic-only directory records generated from the U.S. Department of Education
 * College Scorecard institution-level release dated May 19, 2025.
 * Scope: operating main campuses not already present in the bachelor's directory.
 * Only identity, location, official website and award-level codes are stored.
 */
globalThis.FullRideExtraColleges =
"@

[System.IO.File]::WriteAllText($OutputJs, "$header$json;`n", [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated $($schools.Count) additional basic college records in $OutputJs"
