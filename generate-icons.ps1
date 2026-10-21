Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [string]$Name,
        [scriptblock]$DrawAction
    )
    $bmp = New-Object System.Drawing.Bitmap 128, 128
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # Ambient circular cosmic disc
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 20, 32, 79))
    $g.FillEllipse($bgBrush, 4, 4, 120, 120)
    $borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(120, 158, 130, 222)), 2
    $g.DrawEllipse($borderPen, 4, 4, 120, 120)

    # Custom icon drawing
    & $DrawAction $g

    $bmp.Save("c:/projects/callisto/public/icons/$Name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

# 1. Starfield (General)
Create-Icon "dept-general" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 212, 206, 248)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 248, 246, 255))
    # Center star
    $g.DrawLine($pen, 64, 28, 64, 100)
    $g.DrawLine($pen, 28, 64, 100, 64)
    $g.FillPolygon($brush, @([System.Drawing.Point]::new(64,36), [System.Drawing.Point]::new(72,56), [System.Drawing.Point]::new(92,64), [System.Drawing.Point]::new(72,72), [System.Drawing.Point]::new(64,92), [System.Drawing.Point]::new(56,72), [System.Drawing.Point]::new(36,64), [System.Drawing.Point]::new(56,56)))
    # Accent small star
    $g.FillEllipse($brush, 88, 38, 8, 8)
    $g.FillEllipse($brush, 34, 84, 6, 6)
}

# 2. Polaris Circle (Presidential)
Create-Icon "dept-presidential" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 179, 102))
    $g.DrawEllipse($pen, 26, 26, 76, 76)
    $g.FillPolygon($accentBrush, @([System.Drawing.Point]::new(64,30), [System.Drawing.Point]::new(70,64), [System.Drawing.Point]::new(64,58), [System.Drawing.Point]::new(58,64)))
    $g.FillPolygon($brush, @([System.Drawing.Point]::new(64,98), [System.Drawing.Point]::new(70,64), [System.Drawing.Point]::new(64,70), [System.Drawing.Point]::new(58,64)))
    $g.FillEllipse($brush, 60, 60, 8, 8)
}

# 3. Constellation Wing (International)
Create-Icon "dept-international" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    $starBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    # Constellation lines
    $g.DrawLine($pen, 34, 40, 64, 30)
    $g.DrawLine($pen, 64, 30, 94, 52)
    $g.DrawLine($pen, 94, 52, 78, 88)
    $g.DrawLine($pen, 78, 88, 44, 82)
    $g.DrawLine($pen, 44, 82, 34, 40)
    $g.DrawLine($pen, 64, 30, 78, 88)
    # Star nodes
    $g.FillEllipse($starBrush, 29, 35, 10, 10)
    $g.FillEllipse($starBrush, 59, 25, 10, 10)
    $g.FillEllipse($starBrush, 89, 47, 10, 10)
    $g.FillEllipse($starBrush, 73, 83, 10, 10)
    $g.FillEllipse($starBrush, 39, 77, 10, 10)
}

# 4. Orbit Wing (Social Media)
Create-Icon "dept-social" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 248, 246, 255))
    $goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 179, 102))
    # Satellite body
    $g.FillRectangle($brush, 52, 52, 24, 24)
    # Solar panels
    $g.FillRectangle($goldBrush, 24, 56, 24, 16)
    $g.FillRectangle($goldBrush, 80, 56, 24, 16)
    $g.DrawEllipse($pen, 18, 38, 92, 52)
}

# 5. Quasar (Content)
Create-Icon "dept-content" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 210, 135, 93)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 248, 246, 255))
    # Scroll / Codex
    $g.DrawRectangle($pen, 36, 32, 56, 64)
    $g.DrawLine($pen, 44, 46, 76, 46)
    $g.DrawLine($pen, 44, 58, 84, 58)
    $g.DrawLine($pen, 44, 70, 72, 70)
    $g.DrawLine($pen, 44, 82, 80, 82)
}

# 6. Event Horizon (Events)
Create-Icon "dept-event" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 179, 102)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $flameBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 110, 60))
    # Rocket body
    $g.FillPolygon($brush, @([System.Drawing.Point]::new(64,24), [System.Drawing.Point]::new(78,56), [System.Drawing.Point]::new(78,82), [System.Drawing.Point]::new(50,82), [System.Drawing.Point]::new(50,56)))
    # Fins
    $g.FillPolygon($brush, @([System.Drawing.Point]::new(50,68), [System.Drawing.Point]::new(34,86), [System.Drawing.Point]::new(50,84)))
    $g.FillPolygon($brush, @([System.Drawing.Point]::new(78,68), [System.Drawing.Point]::new(94,86), [System.Drawing.Point]::new(78,84)))
    # Thruster flame
    $g.FillPolygon($flameBrush, @([System.Drawing.Point]::new(54,84), [System.Drawing.Point]::new(64,104), [System.Drawing.Point]::new(74,84)))
}

# 7. Nebula Wing (Design)
Create-Icon "dept-design" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    $purple = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 158, 130, 222))
    $gold = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 179, 102))
    $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    # Palette / Nebula prism
    $g.FillPolygon($purple, @([System.Drawing.Point]::new(64,28), [System.Drawing.Point]::new(96,86), [System.Drawing.Point]::new(32,86)))
    $g.FillEllipse($white, 48, 70, 8, 8)
    $g.FillEllipse($gold, 62, 60, 8, 8)
    $g.FillEllipse($white, 74, 72, 8, 8)
}

# 8. Tesseract (Tech)
Create-Icon "dept-tech" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    $innerPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)), 2
    # Outer cube
    $g.DrawRectangle($pen, 32, 32, 64, 64)
    # Inner cube
    $g.DrawRectangle($innerPen, 48, 48, 32, 32)
    # Connecting diagonals
    $g.DrawLine($innerPen, 32, 32, 48, 48)
    $g.DrawLine($innerPen, 96, 32, 80, 48)
    $g.DrawLine($innerPen, 96, 96, 80, 80)
    $g.DrawLine($innerPen, 32, 96, 48, 80)
}

# 9. LUNAR Society (Astronomy)
Create-Icon "dept-astronomy" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)), 3
    $accentPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    # Telescope tube
    $g.DrawLine($pen, 36, 80, 88, 36)
    # Tripod
    $g.DrawLine($accentPen, 64, 60, 40, 102)
    $g.DrawLine($accentPen, 64, 60, 64, 104)
    $g.DrawLine($accentPen, 64, 60, 88, 102)
    # Lens flare
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 179, 102))
    $g.FillEllipse($brush, 86, 32, 10, 10)
}

# 10. Stellar Path (People)
Create-Icon "dept-people" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    # Astronaut / crew silhouette
    $g.FillEllipse($brush, 52, 32, 24, 24) # Helmet
    $g.FillPolygon($brush, @([System.Drawing.Point]::new(40,94), [System.Drawing.Point]::new(46,62), [System.Drawing.Point]::new(82,62), [System.Drawing.Point]::new(88,94)))
    # Guiding starlight above
    $goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 179, 102))
    $g.FillEllipse($goldBrush, 61, 16, 6, 6)
}

# 11. Aether Wing (Research)
Create-Icon "dept-research" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 179, 102)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 158, 130, 222))
    $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    # Laboratory flask
    $g.DrawLine($pen, 56, 30, 72, 30)
    $g.DrawLine($pen, 58, 30, 58, 52)
    $g.DrawLine($pen, 70, 30, 70, 52)
    $g.DrawLine($pen, 58, 52, 38, 92)
    $g.DrawLine($pen, 70, 52, 90, 92)
    $g.DrawLine($pen, 38, 92, 90, 92)
    # Liquid level & bubbles
    $g.FillPolygon($brush, @([System.Drawing.Point]::new(44,88), [System.Drawing.Point]::new(84,88), [System.Drawing.Point]::new(78,68), [System.Drawing.Point]::new(50,68)))
    $g.FillEllipse($white, 60, 74, 5, 5)
    $g.FillEllipse($white, 68, 62, 4, 4)
}

# Feature icons
Create-Icon "icon-explore" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 4
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.DrawEllipse($pen, 34, 34, 44, 44)
    $g.DrawLine($pen, 68, 68, 96, 96)
    $g.FillEllipse($brush, 48, 48, 16, 16)
}

Create-Icon "icon-learn" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 179, 102)), 3
    $g.DrawRectangle($pen, 34, 32, 60, 64)
    $g.DrawLine($pen, 42, 48, 86, 48)
    $g.DrawLine($pen, 42, 62, 86, 62)
    $g.DrawLine($pen, 42, 76, 74, 76)
}

Create-Icon "icon-connect" {
    param($g)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 158, 130, 222)), 3
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.DrawLine($pen, 42, 46, 86, 46)
    $g.DrawLine($pen, 42, 46, 64, 88)
    $g.DrawLine($pen, 86, 46, 64, 88)
    $g.FillEllipse($brush, 34, 38, 16, 16)
    $g.FillEllipse($brush, 78, 38, 16, 16)
    $g.FillEllipse($brush, 56, 80, 16, 16)
}

Write-Output "All 14 PNG icons generated in public/icons/"
