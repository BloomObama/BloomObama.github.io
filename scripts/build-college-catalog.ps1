param(
  [string]$InputCsv = (Join-Path (Split-Path -Parent $PSScriptRoot) "Most-Recent-Cohorts-Institution_05192025.csv"),
  [string]$OutputJs = (Join-Path (Split-Path -Parent $PSScriptRoot) "college-catalog.js")
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$stateNames = @{
  AL="Alabama"; AK="Alaska"; AZ="Arizona"; AR="Arkansas"; CA="California"; CO="Colorado"; CT="Connecticut"; DE="Delaware"; DC="District of Columbia"; FL="Florida"; GA="Georgia"; HI="Hawaii"; ID="Idaho"; IL="Illinois"; IN="Indiana"; IA="Iowa"; KS="Kansas"; KY="Kentucky"; LA="Louisiana"; ME="Maine"; MD="Maryland"; MA="Massachusetts"; MI="Michigan"; MN="Minnesota"; MS="Mississippi"; MO="Missouri"; MT="Montana"; NE="Nebraska"; NV="Nevada"; NH="New Hampshire"; NJ="New Jersey"; NM="New Mexico"; NY="New York"; NC="North Carolina"; ND="North Dakota"; OH="Ohio"; OK="Oklahoma"; OR="Oregon"; PA="Pennsylvania"; RI="Rhode Island"; SC="South Carolina"; SD="South Dakota"; TN="Tennessee"; TX="Texas"; UT="Utah"; VT="Vermont"; VA="Virginia"; WA="Washington"; WV="West Virginia"; WI="Wisconsin"; WY="Wyoming";
  AS="American Samoa"; FM="Federated States of Micronesia"; GU="Guam"; MH="Marshall Islands"; MP="Northern Mariana Islands"; PR="Puerto Rico"; PW="Palau"; VI="U.S. Virgin Islands"
}

$fieldLabels = [ordered]@{
  PCIP01="agriculture and related sciences"; PCIP03="natural resources and conservation"; PCIP04="architecture and planning"; PCIP05="area and cultural studies"; PCIP09="communication and journalism"; PCIP10="communications technologies"; PCIP11="computer and information sciences"; PCIP12="personal and culinary services"; PCIP13="education"; PCIP14="engineering"; PCIP15="engineering technologies"; PCIP16="foreign languages and linguistics"; PCIP19="family and consumer sciences"; PCIP22="legal professions"; PCIP23="English language and literature"; PCIP24="liberal arts and general studies"; PCIP25="library science"; PCIP26="biological sciences"; PCIP27="mathematics and statistics"; PCIP29="military technologies"; PCIP30="interdisciplinary studies"; PCIP31="parks, recreation and fitness studies"; PCIP38="philosophy and religious studies"; PCIP39="theology and religious vocations"; PCIP40="physical sciences"; PCIP41="science technologies"; PCIP42="psychology"; PCIP43="homeland security and protective services"; PCIP44="public administration and social services"; PCIP45="social sciences"; PCIP46="construction trades"; PCIP47="mechanic and repair technologies"; PCIP48="precision production"; PCIP49="transportation and materials moving"; PCIP50="visual and performing arts"; PCIP51="health professions"; PCIP52="business and management"; PCIP54="history"
}

$localeLabels = @{
  "11"="a large-city setting"; "12"="a midsize-city setting"; "13"="a small-city setting";
  "21"="a large-suburb setting"; "22"="a midsize-suburb setting"; "23"="a small-suburb setting";
  "31"="a town near an urban area"; "32"="a distant-town setting"; "33"="a remote-town setting";
  "41"="a rural area near a town"; "42"="a distant rural area"; "43"="a remote rural area"
}

function Format-ApproximateEnrollment([string]$rawValue) {
  [double]$value = 0
  if (-not [double]::TryParse($rawValue, [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$value) -or $value -le 0) { return $null }
  $step = if ($value -ge 10000) { 500 } elseif ($value -ge 2000) { 100 } else { 50 }
  $rounded = [Math]::Round($value / $step, [MidpointRounding]::AwayFromZero) * $step
  return $rounded.ToString("N0", [System.Globalization.CultureInfo]::GetCultureInfo("en-US"))
}

function Convert-NullableNumber([string]$rawValue, [string]$kind = "double") {
  if ([string]::IsNullOrWhiteSpace($rawValue) -or $rawValue -eq "NULL" -or $rawValue -eq "PrivacySuppressed") { return $null }
  [double]$value = 0
  if (-not [double]::TryParse($rawValue, [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$value)) { return $null }
  if ($kind -eq "integer") { return [int][Math]::Round($value) }
  return [Math]::Round($value, 6)
}

function Get-TopFields($row) {
  $fields = foreach ($entry in $fieldLabels.GetEnumerator()) {
    [double]$share = 0
    $raw = $row.($entry.Key)
    if ([double]::TryParse($raw, [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$share) -and $share -gt 0) {
      [pscustomobject]@{ Label=$entry.Value; Share=$share }
    }
  }
  return @($fields | Sort-Object Share -Descending | Select-Object -First 2 | ForEach-Object Label)
}

function New-CollegeDescription($row) {
  $ownership = switch ($row.CONTROL) { "1" { "public" } "2" { "private nonprofit" } "3" { "private for-profit" } default { "postsecondary" } }
  $state = if ($stateNames.ContainsKey($row.STABBR)) { $stateNames[$row.STABBR] } else { $row.STABBR }
  $enrollment = Format-ApproximateEnrollment $row.UGDS
  $firstSentence = if ($enrollment) {
    "A $ownership institution in $($row.CITY), $state, with an undergraduate enrollment of about $enrollment students."
  } else {
    "A $ownership institution based in $($row.CITY), $state."
  }

  $awardLevel = switch ($row.HIGHDEG) { "4" { "graduate level" } "3" { "bachelor's level" } "2" { "associate level" } "1" { "certificate level" } default { $null } }
  $setting = if ($row.DISTANCEONLY -eq "1") { "operates entirely through distance education" } elseif ($localeLabels.ContainsKey($row.LOCALE)) { "has its main campus in $($localeLabels[$row.LOCALE])" } else { "serves students through its main campus" }
  $secondSentence = if ($awardLevel) { "Its reported awards extend through the $awardLevel, and it $setting." } else { "It $setting." }

  $topFields = @(Get-TopFields $row)
  $fieldSentence = if ($topFields.Count -ge 2) {
    "The largest reported field by share of awarded degrees is $($topFields[0]), followed by $($topFields[1])."
  } elseif ($topFields.Count -eq 1) {
    "Its largest reported field by share of awarded degrees is $($topFields[0])."
  } else { $null }

  $designations = @()
  if ($row.HBCU -eq "1") { $designations += "Historically Black College or University (HBCU)" }
  if ($row.TRIBAL -eq "1") { $designations += "Tribal College or University" }
  if ($row.HSI -eq "1") { $designations += "Hispanic-Serving Institution" }
  if ($row.AANAPII -eq "1") { $designations += "Asian American and Native American Pacific Islander-Serving Institution" }
  if ($row.ANNHI -eq "1") { $designations += "Alaska Native- or Native Hawaiian-Serving Institution" }
  if ($row.PBI -eq "1") { $designations += "Predominantly Black Institution" }
  if ($row.NANTI -eq "1") { $designations += "Native American Non-Tribal Institution" }
  $designationSentence = if ($designations.Count) { "Federal designations reported for the institution include $($designations -join '; ')." } else { $null }
  $audienceSentence = if ($row.WOMENONLY -eq "1") { "It is designated as a women's institution." } elseif ($row.MENONLY -eq "1") { "It is designated as a men's institution." } else { $null }

  return @($firstSentence, $secondSentence, $fieldSentence, $designationSentence, $audienceSentence) | Where-Object { $_ } | Join-String -Separator " "
}

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
    $description = New-CollegeDescription $_

    if ([string]::IsNullOrWhiteSpace($website) -or $website -eq "NULL") {
      $scorecardName = ($name -replace "[^A-Za-z0-9]+", "-").Trim("-")
      $website = "https://collegescorecard.ed.gov/school/?$unitId-$scorecardName"
    } elseif ($website -notmatch "^https?://") {
      $website = "https://$website"
    }

    $facts = [ordered]@{
      control = Convert-NullableNumber $_.CONTROL "integer"
      locale = Convert-NullableNumber $_.LOCALE "integer"
      enrollment = Convert-NullableNumber $_.UGDS "integer"
      nonresidentShare = Convert-NullableNumber $_.UGDS_NRA
      admissionRate = Convert-NullableNumber $_.ADM_RATE
      satAverage = Convert-NullableNumber $_.SAT_AVG "integer"
      tuitionIn = Convert-NullableNumber $_.TUITIONFEE_IN "integer"
      tuitionOut = Convert-NullableNumber $_.TUITIONFEE_OUT "integer"
      annualCost = Convert-NullableNumber $_.COSTT4_A "integer"
      retentionRate = Convert-NullableNumber $_.RET_FT4
      completionRate = Convert-NullableNumber $(if ($_.C150_4_POOLED -and $_.C150_4_POOLED -ne "NULL") { $_.C150_4_POOLED } else { $_.C150_4 })
    }

    ,([object[]]@($unitId, $name, $city, $state, $website, $description, $facts))
  }

$json = ConvertTo-Json -InputObject @($schools) -Compress -Depth 3
$header = @"
/*
 * Basic U.S. college directory generated from the U.S. Department of Education
 * College Scorecard institution-level release dated May 19, 2025.
 * Source: https://catalog.data.gov/dataset/college-scorecard
 * Scope: operating main campuses whose predominant award is a bachelor's degree.
 * Descriptions and factual fields summarize institutional characteristics reported in the dataset.
 * Values can refer to different reporting years; the profile UI labels them as the latest
 * available federal data and never treats them as current admissions-cycle policy.
 * Detailed admissions and aid fields intentionally remain unverified.
 */
globalThis.FullRideBasicColleges =
"@

$content = "$header$json;`n"
[System.IO.File]::WriteAllText($OutputJs, $content, [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated $($schools.Count) basic college records in $OutputJs"
