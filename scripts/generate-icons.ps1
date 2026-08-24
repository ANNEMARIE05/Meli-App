Add-Type -AssemblyName System.Drawing

$logoPath = Join-Path $PSScriptRoot "..\assets\images\logo.png"
$outputDir = Join-Path $PSScriptRoot "..\assets\images"

$logo = [System.Drawing.Bitmap]::FromFile($logoPath)

# 1. icon.png (1024x1024) - Dark background (#14171C) matching splash screen
$icon1024 = New-Object System.Drawing.Bitmap 1024, 1024, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($icon1024)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#14171C'))

$targetW = 720
$targetH = [int]($logo.Height * ($targetW / $logo.Width))
$x = [int]((1024 - $targetW) / 2)
$y = [int]((1024 - $targetH) / 2)
$g.DrawImage($logo, $x, $y, $targetW, $targetH)
$g.Dispose()
$icon1024.Save((Join-Path $outputDir "icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon1024.Dispose()

# 2. android-icon-foreground.png (1024x1024) - Transparent background, safe zone ~540px
$fg = New-Object System.Drawing.Bitmap 1024, 1024, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($fg)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

$fgW = 540
$fgH = [int]($logo.Height * ($fgW / $logo.Width))
$fgX = [int]((1024 - $fgW) / 2)
$fgY = [int]((1024 - $fgH) / 2)
$g.DrawImage($logo, $fgX, $fgY, $fgW, $fgH)
$g.Dispose()
$fg.Save((Join-Path $outputDir "android-icon-foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$fg.Dispose()

# 3. android-icon-background.png (1024x1024) - Solid #14171C
$bg = New-Object System.Drawing.Bitmap 1024, 1024, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bg)
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#14171C'))
$g.Dispose()
$bg.Save((Join-Path $outputDir "android-icon-background.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bg.Dispose()

# 4. android-icon-monochrome.png (1024x1024)
$mono = New-Object System.Drawing.Bitmap 1024, 1024, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($mono)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)
$g.DrawImage($logo, $fgX, $fgY, $fgW, $fgH)
$g.Dispose()
$mono.Save((Join-Path $outputDir "android-icon-monochrome.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$mono.Dispose()

# 5. favicon.png (48x48)
$fav = New-Object System.Drawing.Bitmap 48, 48, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($fav)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)
$favH = [int]($logo.Height * (44 / $logo.Width))
$g.DrawImage($logo, 2, [int]((48 - $favH) / 2), 44, $favH)
$g.Dispose()
$fav.Save((Join-Path $outputDir "favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$fav.Dispose()

$logo.Dispose()
Write-Output "SUCCESS"
