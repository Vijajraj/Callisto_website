/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface SuitTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  trimColor: string;
}

interface VisorTint {
  id: string;
  name: string;
  gradStart: string;
  gradEnd: string;
  glowColor: string;
}

const SUIT_THEMES: SuitTheme[] = [
  { id: 'void', name: 'Void Obsidian', primaryColor: '#0a0f26', secondaryColor: '#14204f', trimColor: 'var(--orbit)' },
  { id: 'jovian', name: 'Jovian Arctic', primaryColor: '#fff5f5', secondaryColor: '#ffb399', trimColor: 'var(--astrophage)' },
  { id: 'mars', name: 'Martian Regolith', primaryColor: '#e05a2b', secondaryColor: '#7f1d1d', trimColor: 'var(--astrophage)' },
  { id: 'stellar', name: 'Stellar Gold', primaryColor: '#ffb86b', secondaryColor: '#2b121c', trimColor: 'var(--moon)' },
  { id: 'tesseract', name: 'Cyber Deep Space', primaryColor: '#2b121c', secondaryColor: '#0b0507', trimColor: '#f43f5e' },
];

const VISOR_TINTS: VisorTint[] = [
  { id: 'gold', name: 'Solar Gold', gradStart: '#ffb86b', gradEnd: '#e05a2b', glowColor: 'var(--astrophage)' },
  { id: 'obsidian', name: 'Deep Polarized', gradStart: '#2b121c', gradEnd: '#0b0507', glowColor: 'var(--orbit)' },
  { id: 'crimson', name: 'Crimson Ember', gradStart: '#f43f5e', gradEnd: '#991b1b', glowColor: 'var(--orbit)' },
  { id: 'cyan', name: 'Nebula Cyan', gradStart: '#38bdf8', gradEnd: '#0284c7', glowColor: '#38bdf8' },
];

const HELMET_STYLES = [
  { id: 'classic', name: 'Apollo Classic Dome', desc: 'Spherical polycarbonate bubble with maximum peripheral view.' },
  { id: 'tactical', name: 'Explorer HUD Visor', desc: 'Angular ballistic visor with integrated holographic reticle.' },
  { id: 'heavy', name: 'Heavy Deep-Space Rig', desc: 'Reinforced dual-shell visor with ionizing radiation shield.' },
];

const PATCHES = [
  { id: 'astronomy', label: 'LUNAR Society', icon: '/icons/dept-astronomy.png' },
  { id: 'tech', label: 'Tesseract Core', icon: '/icons/dept-tech.png' },
  { id: 'event', label: 'Event Horizon', icon: '/icons/dept-event.png' },
  { id: 'design', label: 'Nebula Studio', icon: '/icons/dept-design.png' },
  { id: 'research', label: 'Aether Wing', icon: '/icons/dept-research.png' },
  { id: 'content', label: 'StarCast Scribe', icon: '/icons/dept-content.png' },
];

export default function AvatarBuilder(): React.ReactElement {
  const [selectedTheme, setSelectedTheme] = useState<SuitTheme>(SUIT_THEMES[0]);
  const [selectedVisor, setSelectedVisor] = useState<VisorTint>(VISOR_TINTS[0]);
  const [selectedHelmet, setSelectedHelmet] = useState<string>('classic');
  const [selectedPatch, setSelectedPatch] = useState(PATCHES[0]);
  const [explorerName, setExplorerName] = useState<string>('Elena Rostova');
  const [callsign, setCallsign] = useState<string>('VANGUARD-01');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userPhotoImg, setUserPhotoImg] = useState<HTMLImageElement | null>(null);
  const [visorTintEnabled, setVisorTintEnabled] = useState<boolean>(true);
  const [showIdCard, setShowIdCard] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stop camera tracks on unmount or when stream changes
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Attach live stream to video element once opened
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive, cameraStream]);

  /**
   * Memory-optimized client-side downscaler.
   * Compresses large photos (e.g. 12-48MP from phones or cameras) down to 800px max.
   * Completely eliminates Android Chrome "Unable to complete previous operation due to low memory".
   */
  const downscaleAndProcessImage = (srcUrl: string, isObjectUrl: boolean = false) => {
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.onload = () => {
      try {
        const maxDim = 800;
        let w = tempImg.naturalWidth || tempImg.width || 800;
        let h = tempImg.naturalHeight || tempImg.height || 800;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(tempImg, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          if (isObjectUrl) {
            URL.revokeObjectURL(srcUrl);
          }
          setUserPhoto(compressedDataUrl);
          const finalImg = new Image();
          finalImg.crossOrigin = 'anonymous';
          finalImg.onload = () => {
            setUserPhotoImg(finalImg);
            setExportNotice('Cadet face biometric loaded into spacesuit HUD & Flight Pass!');
            setTimeout(() => setExportNotice(null), 3500);
          };
          finalImg.src = compressedDataUrl;
          return;
        }
      } catch (err) {
        console.warn('Canvas optimization fallback:', err);
      }
      // Direct fallback
      setUserPhoto(srcUrl);
      setUserPhotoImg(tempImg);
      setExportNotice('Cadet face biometric loaded into spacesuit HUD & Flight Pass!');
      setTimeout(() => setExportNotice(null), 3500);
    };
    tempImg.onerror = () => {
      if (isObjectUrl) {
        URL.revokeObjectURL(srcUrl);
      }
      setExportNotice('Failed to process image file. Please try another format (JPG/PNG).');
      setTimeout(() => setExportNotice(null), 3500);
    };
    tempImg.src = srcUrl;
  };

  const handlePhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setExportNotice('Selected file must be an image format (JPG, PNG, WEBP).');
      setTimeout(() => setExportNotice(null), 3500);
      return;
    }
    playTelemetryBeep(1050, 0.08);

    // Use URL.createObjectURL instead of massive FileReader.readAsDataURL
    // This prevents Android Chrome "Unable to complete previous operation due to low memory"
    const blobUrl = URL.createObjectURL(file);
    downscaleAndProcessImage(blobUrl, true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoFile(file);
    e.target.value = '';
  };

  /**
   * Direct WebRTC live camera capture.
   * Works on laptop webcams (Windows/Mac/Linux) and mobile browsers without crashing.
   */
  const startCamera = async (facing: 'user' | 'environment' = 'user') => {
    setCameraError(null);
    setCameraLoading(true);
    setIsCameraActive(true);
    setCameraFacing(facing);

    // Stop previous stream if switching facing mode
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Direct camera access is not supported by your browser or connection (requires HTTPS or localhost).');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Could not access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera permissions in your browser address bar or choose an existing photo from gallery.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device detected on this device. Please upload an image from your files.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is currently locked or in use by another program. Please close other camera apps and retry.';
      } else if (err.message) {
        msg = err.message;
      }
      setCameraError(msg);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
    setCameraLoading(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;

    // Center crop square optimal for astronaut helmet visor
    const minDim = Math.min(vw, vh);
    const sx = (vw - minDim) / 2;
    const sy = (vh - minDim) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally for front camera (natural mirror feel)
    if (cameraFacing === 'user') {
      ctx.translate(600, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 600, 600);

    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Stop camera immediately to free hardware & system memory
    stopCamera();
    playTelemetryBeep(1200, 0.1);

    setUserPhoto(compressedDataUrl);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUserPhotoImg(img);
      setExportNotice('Cadet biometric captured & sealed into spacesuit HUD!');
      setTimeout(() => setExportNotice(null), 3500);
    };
    img.src = compressedDataUrl;
  };

  const handleRemovePhoto = () => {
    playTelemetryBeep(700, 0.06);
    setUserPhoto(null);
    setUserPhotoImg(null);
    setExportNotice('Cadet photo removed. Reverted to polarized visor.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const generateCardCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1050;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Deep Space Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1050);
    bgGrad.addColorStop(0, '#060913');
    bgGrad.addColorStop(0.5, '#0c1224');
    bgGrad.addColorStop(1, '#030509');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1050);

    // Starlight field
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 60; i++) {
      const sx = (i * 137.5) % 800;
      const sy = (i * 229.3) % 1050;
      const sr = (i % 3 === 0) ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer Holographic Frame
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 740, 990);

    // Corner Ticks
    const drawCorner = (x: number, y: number) => {
      ctx.strokeStyle = '#ffb86b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.lineTo(x + 12, y);
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    };
    drawCorner(30, 30);
    drawCorner(770, 30);
    drawCorner(30, 1020);
    drawCorner(770, 1020);

    // Header Telemetry
    ctx.fillStyle = '#ffb86b';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CALLISTO EXPEDITION // CREW FLIGHT PASS', 55, 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('MANIFEST #8492-CIT', 745, 70);
    ctx.textAlign = 'left';

    // Header divider
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(55, 85);
    ctx.lineTo(745, 85);
    ctx.stroke();

    // Center Spacesuit Rig Rendering
    ctx.save();
    ctx.translate(400 - 160 * 1.35, 110);
    ctx.scale(1.35, 1.35);

    // Outer guidance circle
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(160, 190, 140, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Torso Harness
    ctx.beginPath();
    ctx.moveTo(100, 240);
    ctx.quadraticCurveTo(80, 250, 65, 290);
    ctx.lineTo(65, 370);
    ctx.lineTo(255, 370);
    ctx.lineTo(255, 290);
    ctx.quadraticCurveTo(240, 250, 220, 240);
    ctx.quadraticCurveTo(160, 260, 100, 240);
    ctx.closePath();
    ctx.fillStyle = selectedTheme.primaryColor;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Chest Plate
    ctx.fillStyle = selectedTheme.secondaryColor;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(120, 275, 80, 60, 6);
    ctx.fill();
    ctx.stroke();

    // Chest label
    ctx.fillStyle = '#ffb86b';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(selectedPatch.label.toUpperCase().slice(0, 12), 160, 312);

    // Collar
    ctx.beginPath();
    ctx.ellipse(160, 235, 46, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = selectedTheme.secondaryColor;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Helmet Outer Shell
    ctx.beginPath();
    if (selectedHelmet === 'heavy') {
      ctx.roundRect(85, 85, 150, 150, 35);
    } else {
      ctx.arc(160, 155, 74, 0, Math.PI * 2);
    }
    ctx.fillStyle = selectedTheme.primaryColor;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Visor with Radial Reflection
    const visorGrad = ctx.createRadialGradient(160, 140, 10, 160, 155, 60);
    visorGrad.addColorStop(0, selectedVisor.gradStart);
    visorGrad.addColorStop(0.7, selectedVisor.gradEnd);
    visorGrad.addColorStop(1, selectedTheme.secondaryColor);

    if (userPhotoImg) {
      ctx.save();
      ctx.beginPath();
      if (selectedHelmet === 'tactical') {
        ctx.moveTo(120, 120);
        ctx.lineTo(200, 120);
        ctx.lineTo(215, 160);
        ctx.lineTo(195, 190);
        ctx.lineTo(125, 190);
        ctx.lineTo(105, 160);
        ctx.closePath();
      } else {
        ctx.ellipse(160, 155, 54, 44, 0, 0, Math.PI * 2);
      }
      ctx.clip();

      // Dark interior backing behind face
      ctx.fillStyle = '#060913';
      ctx.fill();

      // Draw photo centered in visor bounds
      const vx = 106;
      const vy = 111;
      const vw = 108;
      const vh = 88;
      const imgAspect = userPhotoImg.width / userPhotoImg.height;
      const targetAspect = vw / vh;
      let sx = 0, sy = 0, sw = userPhotoImg.width, sh = userPhotoImg.height;
      if (imgAspect > targetAspect) {
        sw = userPhotoImg.height * targetAspect;
        sx = (userPhotoImg.width - sw) / 2;
      } else {
        sh = userPhotoImg.width / targetAspect;
        sy = (userPhotoImg.height - sh) / 2;
      }
      ctx.drawImage(userPhotoImg, sx, sy, sw, sh, vx, vy, vw, vh);

      if (visorTintEnabled) {
        ctx.fillStyle = visorGrad;
        ctx.globalAlpha = 0.32;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      ctx.restore();
    } else {
      ctx.beginPath();
      if (selectedHelmet === 'tactical') {
        ctx.moveTo(120, 120);
        ctx.lineTo(200, 120);
        ctx.lineTo(215, 160);
        ctx.lineTo(195, 190);
        ctx.lineTo(125, 190);
        ctx.lineTo(105, 160);
        ctx.closePath();
      } else {
        ctx.ellipse(160, 155, 54, 44, 0, 0, Math.PI * 2);
      }
      ctx.fillStyle = visorGrad;
      ctx.fill();
    }

    // Outer Visor Rim / Glow
    ctx.beginPath();
    if (selectedHelmet === 'tactical') {
      ctx.moveTo(120, 120);
      ctx.lineTo(200, 120);
      ctx.lineTo(215, 160);
      ctx.lineTo(195, 190);
      ctx.lineTo(125, 190);
      ctx.lineTo(105, 160);
      ctx.closePath();
    } else {
      ctx.ellipse(160, 155, 54, 44, 0, 0, Math.PI * 2);
    }
    ctx.strokeStyle = selectedVisor.glowColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Glint Arc
    ctx.beginPath();
    ctx.ellipse(155, 135, 30, 8, -0.2, 0, Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    // Crew Identity Card Box
    const cardY = 640;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(55, cardY, 690, 275, 10);
    ctx.fill();
    ctx.stroke();

    // Cadet Name & Callsign
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 28px sans-serif';
    ctx.fillText((explorerName || 'CADET EXPLORER').slice(0, 28), 80, cardY + 45);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText(`CALLSIGN: ${(callsign || 'ORBIT-01').slice(0, 20)}`, 80, cardY + 75);

    // Specification Grid
    const specs = [
      { label: 'MISSION WING', val: selectedPatch.label },
      { label: 'SUIT REGIME', val: selectedTheme.name },
      { label: 'HELMET CLASS', val: selectedHelmet.toUpperCase() },
      { label: 'VISOR COATING', val: selectedVisor.name },
      { label: 'BIOMETRIC ID', val: userPhotoImg ? 'VERIFIED CADET FACE' : 'POLARIZED HELMET' },
      { label: 'FACILITY NODE', val: 'CHENNAI INST. OF TECH (CIT)' },
    ];

    specs.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 80 + col * 250;
      const y = cardY + 118 + row * 46;

      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(item.label, x, y);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillText(item.val, x, y + 18);
    });

    // Right-hand Biometric ID Photo Box
    const bioX = 590;
    const bioY = cardY + 25;
    const bioW = 135;
    const bioH = 160;

    ctx.save();
    ctx.fillStyle = '#060913';
    ctx.strokeStyle = userPhotoImg ? '#22c55e' : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bioX, bioY, bioW, bioH, 8);
    ctx.fill();
    ctx.stroke();

    if (userPhotoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bioX + 3, bioY + 3, bioW - 6, bioH - 6, 6);
      ctx.clip();
      
      const imgAspect = userPhotoImg.width / userPhotoImg.height;
      const targetAspect = (bioW - 6) / (bioH - 6);
      let sx = 0, sy = 0, sw = userPhotoImg.width, sh = userPhotoImg.height;
      if (imgAspect > targetAspect) {
        sw = userPhotoImg.height * targetAspect;
        sx = (userPhotoImg.width - sw) / 2;
      } else {
        sh = userPhotoImg.width / targetAspect;
        sy = (userPhotoImg.height - sh) / 2;
      }
      ctx.drawImage(userPhotoImg, sx, sy, sw, sh, bioX + 3, bioY + 3, bioW - 6, bioH - 6);
      ctx.restore();
    } else {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BIOMETRIC ID', bioX + bioW / 2, bioY + 70);
      ctx.fillText('[POLARIZED]', bioX + bioW / 2, bioY + 90);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bioX + 20, bioY + 35, bioW - 40, bioH - 65);
    }

    // Biometric label below photo
    ctx.fillStyle = userPhotoImg ? '#22c55e' : '#94a3b8';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(userPhotoImg ? 'VERIFIED FACE ID' : 'EVA CLASS HELMET', bioX + bioW / 2, bioY + bioH + 20);
    ctx.restore();

    // Verification Footer
    ctx.fillStyle = '#22c55e';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillText('[✓] FLIGHT READY // PASS VERIFIED & SEALED', 55, 960);

    // Barcode Telemetry
    ctx.fillStyle = '#94a3b8';
    let bx = 500;
    for (let i = 0; i < 38; i++) {
      const barW = (i % 4 === 0) ? 4 : (i % 2 === 0 ? 2 : 1);
      ctx.fillRect(bx, 945, barW, 25);
      bx += barW + 3;
    }

    return canvas;
  };

  const handleDownloadImage = () => {
    playTelemetryBeep(1200, 0.1);
    const canvas = generateCardCanvas();
    const link = document.createElement('a');
    const safeCallsign = (callsign || 'EXPLORER').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `Callisto_EVA_Suit_${safeCallsign}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setExportNotice('Holographic Pass exported as high-res PNG image!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleDownloadPdf = () => {
    playTelemetryBeep(1320, 0.12);
    const canvas = generateCardCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const safeCallsign = (callsign || 'EXPLORER').replace(/[^a-zA-Z0-9_-]/g, '_');

    const printWin = window.open('', '_blank', 'width=900,height=1150');
    if (!printWin) {
      alert('Pop-up was blocked. Please allow pop-ups for localhost to download/print the PDF pass.');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Callisto_Expedition_Flight_Pass_${safeCallsign}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            body {
              margin: 0;
              padding: 24px;
              background-color: #050811;
              color: #f8fafc;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
            }
            .pass-card {
              max-width: 750px;
              width: 100%;
              border-radius: 12px;
              box-shadow: 0 0 40px rgba(56, 189, 248, 0.35);
              overflow: hidden;
            }
            .pass-card img {
              width: 100%;
              display: block;
            }
            .notice-bar {
              margin-top: 16px;
              font-size: 13px;
              color: #94a3b8;
              font-family: monospace;
              text-align: center;
            }
            @media print {
              body {
                background: #ffffff !important;
                padding: 0 !important;
              }
              .pass-card {
                box-shadow: none !important;
                max-width: 96% !important;
              }
              .notice-bar {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="pass-card">
            <img src="${dataUrl}" alt="Callisto EVA Spacesuit Flight Pass" />
          </div>
          <div class="notice-bar">
            Use your browser's Print dialog destination: <strong>"Save as PDF"</strong> to save this flight certificate.
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
    setExportNotice('PDF Flight Pass generated! Select "Save as PDF" in your print dialog.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleThemeChange = (theme: SuitTheme) => {
    playTelemetryBeep(880, 0.05);
    setSelectedTheme(theme);
  };

  const handleVisorChange = (visor: VisorTint) => {
    playTelemetryBeep(1020, 0.05);
    setSelectedVisor(visor);
  };

  const handleHelmetChange = (helmetId: string) => {
    playTelemetryBeep(940, 0.05);
    setSelectedHelmet(helmetId);
  };

  const handlePatchChange = (patch: typeof PATCHES[0]) => {
    playTelemetryBeep(1100, 0.05);
    setSelectedPatch(patch);
  };

  return (
    <div
      className="avatar-builder-card"
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        boxShadow: '0 12px 40px color-mix(in srgb, var(--void) 85%, transparent)',
      }}
    >
      <style>{`
        .customizer-btn:hover {
          transform: translateY(-2px);
          border-color: var(--orbit) !important;
        }
        .color-swatch:hover {
          transform: scale(1.1);
        }

        /* Flight Pass Action Button */
        .flight-pass-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          color: #000000;
          border: 1px solid #ffffff;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          font-weight: 700;
          padding: 0.55rem 1.15rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.35);
        }

        .flight-pass-btn:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 0 24px rgba(255, 255, 255, 0.6);
        }

        .flight-pass-btn.editing {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: none;
        }

        .flight-pass-btn.editing:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-color: #ffffff;
        }

        /* Light Mode (Solar Flare) Contrast Overrides */
        html[data-theme="solar-flare"] .avatar-builder-card,
        html.theme-solar-flare .avatar-builder-card,
        html.light-mode .avatar-builder-card {
          background-color: rgba(255, 255, 255, 0.94) !important;
          border: 1px solid rgba(0, 0, 0, 0.16) !important;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08) !important;
        }

        html[data-theme="solar-flare"] .flight-pass-btn,
        html.theme-solar-flare .flight-pass-btn,
        html.light-mode .flight-pass-btn {
          background: #000000 !important;
          color: #ffffff !important;
          border: 1px solid #000000 !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
        }

        html[data-theme="solar-flare"] .flight-pass-btn:hover,
        html.theme-solar-flare .flight-pass-btn:hover,
        html.light-mode .flight-pass-btn:hover {
          background: #1e293b !important;
          border-color: #1e293b !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3) !important;
        }

        html[data-theme="solar-flare"] .flight-pass-btn.editing,
        html.theme-solar-flare .flight-pass-btn.editing,
        html.light-mode .flight-pass-btn.editing {
          background: #ffffff !important;
          color: #000000 !important;
          border: 1px solid rgba(0, 0, 0, 0.35) !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
        }

        html[data-theme="solar-flare"] .flight-pass-btn.editing:hover,
        html.theme-solar-flare .flight-pass-btn.editing:hover,
        html.light-mode .flight-pass-btn.editing:hover {
          background: #000000 !important;
          color: #ffffff !important;
          border-color: #000000 !important;
        }

        html[data-theme="solar-flare"] .flight-badge-card,
        html.theme-solar-flare .flight-badge-card,
        html.light-mode .flight-badge-card {
          background-color: #ffffff !important;
          border-color: #000000 !important;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.12) !important;
        }

        html[data-theme="solar-flare"] .avatar-download-primary,
        html.theme-solar-flare .avatar-download-primary,
        html.light-mode .avatar-download-primary {
          background-color: #000000 !important;
          color: #ffffff !important;
          border: 1px solid #000000 !important;
        }

        html[data-theme="solar-flare"] .avatar-download-primary:hover,
        html.theme-solar-flare .avatar-download-primary:hover,
        html.light-mode .avatar-download-primary:hover {
          background-color: #1e293b !important;
        }

        html[data-theme="solar-flare"] .avatar-download-secondary,
        html.theme-solar-flare .avatar-download-secondary,
        html.light-mode .avatar-download-secondary {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 1px solid rgba(0, 0, 0, 0.35) !important;
        }

        html[data-theme="solar-flare"] .avatar-download-secondary:hover,
        html.theme-solar-flare .avatar-download-secondary:hover,
        html.light-mode .avatar-download-secondary:hover {
          background-color: #000000 !important;
          color: #ffffff !important;
          border-color: #000000 !important;
        }

        html[data-theme="solar-flare"] .avatar-input,
        html.theme-solar-flare .avatar-input,
        html.light-mode .avatar-input {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 1px solid rgba(0, 0, 0, 0.25) !important;
        }

        html[data-theme="solar-flare"] .avatar-input:focus,
        html.theme-solar-flare .avatar-input:focus,
        html.light-mode .avatar-input:focus {
          border-color: #000000 !important;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.12) !important;
        }

        /* Biometric Upload Controls */
        .biometric-upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: color-mix(in srgb, var(--orbit) 20%, var(--navy));
          color: var(--moon);
          border: 1px solid var(--orbit);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .biometric-upload-btn:hover {
          background: var(--orbit);
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
        }

        .biometric-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: color-mix(in srgb, var(--astrophage) 20%, transparent);
          color: var(--astrophage);
          border: 1px solid var(--astrophage);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.45rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .biometric-toggle-btn:hover {
          background: var(--astrophage);
          color: #000000;
        }

        .biometric-remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          color: #f43f5e;
          border: 1px solid rgba(244, 63, 94, 0.5);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.45rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .biometric-remove-btn:hover {
          background: rgba(244, 63, 94, 0.15);
          border-color: #f43f5e;
        }

        html[data-theme="solar-flare"] .biometric-upload-btn,
        html.theme-solar-flare .biometric-upload-btn,
        html.light-mode .biometric-upload-btn {
          background: #000000 !important;
          color: #ffffff !important;
          border: 1px solid #000000 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }

        html[data-theme="solar-flare"] .biometric-upload-btn:hover,
        html.theme-solar-flare .biometric-upload-btn:hover,
        html.light-mode .biometric-upload-btn:hover {
          background: #1e293b !important;
          border-color: #1e293b !important;
          color: #ffffff !important;
        }

        html[data-theme="solar-flare"] .biometric-toggle-btn,
        html.theme-solar-flare .biometric-toggle-btn,
        html.light-mode .biometric-toggle-btn {
          background: #f1f5f9 !important;
          color: #0f172a !important;
          border: 1px solid #94a3b8 !important;
        }

        html[data-theme="solar-flare"] .biometric-remove-btn,
        html.theme-solar-flare .biometric-remove-btn,
        html.light-mode .biometric-remove-btn {
          background: #fff1f2 !important;
          color: #e11d48 !important;
          border: 1px solid #fda4af !important;
        }

        /* Camera Scanner Modal Styles */
        .biometric-camera-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-sizing: border-box;
        }

        .biometric-scanner-modal {
          background: var(--deep, #0b1120);
          border: 1px solid var(--orbit, #38bdf8);
          border-radius: var(--radius-lg, 14px);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8), 0 0 32px rgba(56, 189, 248, 0.25);
          display: flex;
          flex-direction: column;
        }

        .scanner-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.15rem;
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid color-mix(in srgb, var(--steel, #475569) 30%, transparent);
        }

        .scanner-live-badge {
          background: #ef4444;
          color: #ffffff;
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
          animation: pulseRed 2s infinite ease-in-out;
        }

        @keyframes pulseRed {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .scanner-modal-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--moon, #ffffff);
        }

        .scanner-close-btn {
          background: transparent;
          border: none;
          color: var(--steel, #94a3b8);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scanner-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .scanner-viewport-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-height: 380px;
          background: #000000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scanner-video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .scanner-video-feed.mirror {
          transform: scaleX(-1);
        }

        .scanner-reticle-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          box-sizing: border-box;
        }

        .scanner-reticle-svg {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }

        .scanner-reticle-label {
          position: relative;
          margin-top: auto;
          background: rgba(2, 6, 23, 0.85);
          color: var(--orbit, #38bdf8);
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .scanner-status-scrim {
          position: absolute;
          inset: 0;
          background: rgba(6, 9, 19, 0.94);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          padding: 1.5rem;
          text-align: center;
          z-index: 10;
        }

        .scanner-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(56, 189, 248, 0.2);
          border-top-color: var(--orbit, #38bdf8);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .scanner-status-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          color: var(--orbit, #38bdf8);
          letter-spacing: 0.08em;
        }

        .scanner-error-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid #ef4444;
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono, monospace);
          font-weight: 800;
          font-size: 1.1rem;
        }

        .scanner-error-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          font-weight: 700;
          color: #ef4444;
          letter-spacing: 0.08em;
        }

        .scanner-error-desc {
          font-family: var(--font-body, sans-serif);
          font-size: 0.78rem;
          color: var(--star, #cbd5e1);
          line-height: 1.45;
          margin: 0;
          max-width: 320px;
        }

        .scanner-retry-btn,
        .scanner-alt-btn {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm, 6px);
          cursor: pointer;
          transition: all 0.2s;
        }

        .scanner-retry-btn {
          background: var(--orbit, #38bdf8);
          color: #000000;
          border: 1px solid var(--orbit, #38bdf8);
        }

        .scanner-alt-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .scanner-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.15rem;
          background: rgba(15, 23, 42, 0.95);
          border-top: 1px solid color-mix(in srgb, var(--steel, #475569) 30%, transparent);
          gap: 0.75rem;
        }

        .scanner-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          color: var(--steel, #94a3b8);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: var(--radius-sm, 6px);
          padding: 0.45rem 0.75rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scanner-action-btn:hover:not(:disabled) {
          color: #ffffff;
          border-color: #ffffff;
        }

        .scanner-action-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .scanner-snap-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--orbit, #38bdf8);
          color: #020617;
          border: 1px solid var(--orbit, #38bdf8);
          border-radius: var(--radius-sm, 6px);
          padding: 0.55rem 1.25rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
          transition: all 0.2s;
        }

        .scanner-snap-btn:hover:not(:disabled) {
          background: #7dd3fc;
          transform: translateY(-1px);
          box-shadow: 0 0 24px rgba(56, 189, 248, 0.6);
        }

        .scanner-snap-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Light Mode (Solar Flare) Overrides for Scanner */
        html[data-theme="solar-flare"] .biometric-scanner-modal,
        html.theme-solar-flare .biometric-scanner-modal,
        html.light-mode .biometric-scanner-modal {
          background: #ffffff !important;
          border-color: #0284c7 !important;
        }

        html[data-theme="solar-flare"] .scanner-modal-header,
        html.theme-solar-flare .scanner-modal-header,
        html.light-mode .scanner-modal-header,
        html[data-theme="solar-flare"] .scanner-controls-bar,
        html.theme-solar-flare .scanner-controls-bar,
        html.light-mode .scanner-controls-bar {
          background: #f8fafc !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
        }

        html[data-theme="solar-flare"] .scanner-modal-title,
        html.theme-solar-flare .scanner-modal-title,
        html.light-mode .scanner-modal-title {
          color: #0f172a !important;
        }

        html[data-theme="solar-flare"] .scanner-snap-btn,
        html.theme-solar-flare .scanner-snap-btn,
        html.light-mode .scanner-snap-btn {
          background: #0284c7 !important;
          color: #ffffff !important;
          border-color: #0284c7 !important;
        }
      `}</style>

      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-md)',
          borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
          paddingBottom: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--astrophage)', letterSpacing: '0.14em' }}>
            EVA SPACESUIT FABRICATION BAY // PHASE 2 ACTIVE
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: '0.2rem 0 0 0', color: 'var(--moon)' }}>
            Custom Suit Fabricator
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            playTelemetryBeep(1200, 0.08);
            setShowIdCard(!showIdCard);
          }}
          className={`flight-pass-btn ${showIdCard ? 'editing' : ''}`}
        >
          <span>{showIdCard ? 'Edit Customization' : 'Generate Flight Pass'}</span>
        </button>
      </div>

      {showIdCard ? (
        /* Holographic Flight Badge View */
        <div
          className="flight-badge-card"
          style={{
            maxWidth: '460px',
            margin: '0 auto',
            backgroundColor: 'color-mix(in srgb, var(--navy) 75%, var(--void))',
            border: '2px solid var(--orbit)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            boxShadow: '0 0 32px color-mix(in srgb, var(--orbit) 40%, transparent)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Hologram sheen gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--orbit), var(--astrophage), var(--star))',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--astrophage)', letterSpacing: '0.15em' }}>
              CALLISTO EXPEDITION // CREW ID
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)' }}>
              PASS #8492-CIT
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            {/* Cadet Avatar / Biometric Portrait */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--void)',
                border: `2px solid ${userPhoto ? '#22c55e' : selectedTheme.trimColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: userPhoto ? '0 0 16px rgba(34, 197, 94, 0.4)' : 'none',
              }}
            >
              {userPhoto ? (
                <>
                  <img
                    src={userPhoto}
                    alt="Cadet Portrait"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#22c55e',
                      fontSize: '8px',
                      fontFamily: 'var(--font-mono)',
                      textAlign: 'center',
                      padding: '1px 0',
                      fontWeight: 700,
                    }}
                  >
                    BIO VERIFIED
                  </div>
                </>
              ) : (
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${selectedVisor.gradStart}, ${selectedVisor.gradEnd})`,
                    boxShadow: `0 0 12px ${selectedVisor.glowColor}`,
                  }}
                />
              )}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--moon)' }}>
                {explorerName || 'Cadet Explorer'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--orbit)' }}>
                CALLSIGN: {callsign || 'ORBIT-01'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>ASSIGNED: {selectedPatch.label}</span>
                <img src={selectedPatch.icon} alt="" width="16" height="16" style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-xs)',
              backgroundColor: 'color-mix(in srgb, var(--void) 60%, transparent)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--steel)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <div>SUIT CLASS: <span style={{ color: 'var(--moon)' }}>{selectedTheme.name}</span></div>
            <div>HELMET: <span style={{ color: 'var(--moon)' }}>{selectedHelmet.toUpperCase()}</span></div>
            <div>VISOR TINT: <span style={{ color: selectedVisor.glowColor }}>{selectedVisor.name}</span></div>
            <div>BIOMETRICS: <span style={{ color: userPhoto ? '#4ade80' : 'var(--moon)' }}>{userPhoto ? 'VERIFIED (FACE INTEGRATED)' : 'POLARIZED HELMET'}</span></div>
          </div>

          {exportNotice && (
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--orbit) 15%, transparent)',
                border: '1px solid var(--orbit)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--moon)',
                textAlign: 'center',
                marginBottom: 'var(--space-md)',
              }}
            >
              {exportNotice}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <button
              type="button"
              onClick={handleDownloadImage}
              className="avatar-download-primary"
            >
              <span>Download Image (.PNG)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="avatar-download-secondary"
            >
              <span>Download PDF Pass</span>
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Suit Customizer Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 'var(--space-2xl)',
            alignItems: 'center',
          }}
        >
          {/* Left: Dynamic Live Spacesuit SVG Canvas */}
          <div
            style={{
              backgroundColor: 'var(--void)',
              border: `1px solid ${selectedTheme.trimColor}`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: `0 0 30px color-mix(in srgb, ${selectedVisor.glowColor} 20%, transparent)`,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 'var(--space-sm)',
                left: 'var(--space-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--steel)',
              }}
            >
              LIVE RIG // {selectedTheme.name.toUpperCase()}
            </div>

            <div style={{ width: '240px', height: '300px', margin: 'var(--space-md) 0' }}>
              <svg viewBox="0 0 320 380" width="100%" height="100%">
                <defs>
                  <radialGradient id="interactiveVisor" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor={selectedVisor.gradStart} stopOpacity="0.95" />
                    <stop offset="70%" stopColor={selectedVisor.gradEnd} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={selectedTheme.secondaryColor} stopOpacity="0.5" />
                  </radialGradient>
                  <clipPath id="interactiveVisorClip">
                    {selectedHelmet === 'tactical' ? (
                      <polygon points="120,120 200,120 215,160 195,190 125,190 105,160" />
                    ) : (
                      <ellipse cx="160" cy="155" rx="54" ry="44" />
                    )}
                  </clipPath>
                </defs>

                {/* Outer Holographic Guidance Rings */}
                <circle cx="160" cy="190" r="140" fill="none" stroke={selectedTheme.trimColor} strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />

                {/* Torso & Shoulder Harness */}
                <path
                  d="M 100 240 Q 80 250 65 290 L 65 370 L 255 370 L 255 290 Q 240 250 220 240 Q 160 260 100 240 Z"
                  fill={selectedTheme.primaryColor}
                  stroke={selectedTheme.trimColor}
                  strokeWidth="2"
                />

                {/* Chest Telemetry Plate with Department Patch */}
                <rect x="120" y="275" width="80" height="60" rx="6" fill={selectedTheme.secondaryColor} stroke="var(--steel)" strokeWidth="1" />
                <image href={selectedPatch.icon} x="145" y="282" width="30" height="30" />
                <text x="160" y="324" textAnchor="middle" fill={selectedTheme.trimColor} fontFamily="monospace" fontSize="8" fontWeight="bold">
                  {selectedPatch.label.substring(0, 10).toUpperCase()}
                </text>

                {/* Neck Collar */}
                <ellipse cx="160" cy="235" rx="46" ry="14" fill={selectedTheme.secondaryColor} stroke={selectedTheme.trimColor} strokeWidth="2" />

                {/* Helmet Outer Shell based on style */}
                {selectedHelmet === 'heavy' ? (
                  <rect x="85" y="85" width="150" height="150" rx="35" fill={selectedTheme.primaryColor} stroke={selectedTheme.trimColor} strokeWidth="2.5" />
                ) : (
                  <circle cx="160" cy="155" r="74" fill={selectedTheme.primaryColor} stroke={selectedTheme.trimColor} strokeWidth="2" />
                )}

                {/* Visor Area: Face Photo or Pure Visor Coating */}
                {userPhoto ? (
                  <g>
                    {/* Interior backing behind face */}
                    <rect x="85" y="85" width="150" height="150" fill="#060913" clipPath="url(#interactiveVisorClip)" />
                    {/* Cadet uploaded face */}
                    <image
                      href={userPhoto}
                      x="106"
                      y="111"
                      width="108"
                      height="88"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#interactiveVisorClip)"
                    />
                    {/* Translucent visor sheen coating */}
                    {visorTintEnabled && (
                      selectedHelmet === 'tactical' ? (
                        <polygon
                          points="120,120 200,120 215,160 195,190 125,190 105,160"
                          fill="url(#interactiveVisor)"
                          opacity="0.32"
                        />
                      ) : (
                        <ellipse
                          cx="160"
                          cy="155"
                          rx="54"
                          ry="44"
                          fill="url(#interactiveVisor)"
                          opacity="0.32"
                        />
                      )
                    )}
                  </g>
                ) : (
                  selectedHelmet === 'tactical' ? (
                    <polygon
                      points="120,120 200,120 215,160 195,190 125,190 105,160"
                      fill="url(#interactiveVisor)"
                    />
                  ) : (
                    <ellipse
                      cx="160"
                      cy="155"
                      rx="54"
                      ry="44"
                      fill="url(#interactiveVisor)"
                    />
                  )
                )}

                {/* Visor Glow Border */}
                {selectedHelmet === 'tactical' ? (
                  <polygon
                    points="120,120 200,120 215,160 195,190 125,190 105,160"
                    fill="none"
                    stroke={selectedVisor.glowColor}
                    strokeWidth="2"
                  />
                ) : (
                  <ellipse
                    cx="160"
                    cy="155"
                    rx="54"
                    ry="44"
                    fill="none"
                    stroke={selectedVisor.glowColor}
                    strokeWidth="2"
                  />
                )}

                {/* Glint Arc */}
                <path d="M 130 135 Q 160 125 185 135" fill="none" stroke="var(--moon)" strokeWidth="2.5" opacity="0.85" />
              </svg>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--star)', textAlign: 'center' }}>
              <div>{explorerName} // [{callsign}]</div>
              <div style={{ color: 'var(--steel)', fontSize: '0.6875rem' }}>WING: {selectedPatch.label}</div>
              {userPhoto && (
                <div style={{ color: '#4ade80', fontSize: '0.6875rem', marginTop: '0.2rem', fontWeight: 600 }}>
                  [✓] Biometric Face Synced to Helmet
                </div>
              )}
            </div>

            {exportNotice && (
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--orbit) 15%, transparent)',
                  border: '1px solid var(--orbit)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--moon)',
                  textAlign: 'center',
                  marginTop: 'var(--space-sm)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {exportNotice}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)', marginTop: 'var(--space-md)', width: '100%' }}>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="avatar-download-primary"
              >
                Download Image
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="avatar-download-secondary"
              >
                Save as PDF
              </button>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div>
            {/* Identity Inputs */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>1. EXPLORER CALLSIGN & NAME</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <input
                  type="text"
                  value={explorerName}
                  onChange={(e) => setExplorerName(e.target.value)}
                  placeholder="Explorer Name"
                  className="avatar-input"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="Callsign"
                  className="avatar-input"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Biometric Face Photo Upload */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={sectionLabelStyle}>2. ASTRONAUT BIOMETRIC FACE (CAMERA / GALLERY)</span>
                {userPhoto && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#22c55e', fontWeight: 700 }}>
                    [✓] FACE INTEGRATED
                  </span>
                )}
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)', margin: '0 0 0.6rem 0' }}>
                Capture directly with your laptop/phone camera or upload from gallery. In-memory compression protects device memory while seamlessly sealing your face into the EVA suit visor & Flight Pass.
              </p>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <input
                ref={nativeCameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />

              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => startCamera('user')}
                  className="biometric-upload-btn"
                  title="Open live camera or laptop webcam"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Use Camera / WebCam</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="biometric-upload-btn"
                  title="Choose existing photo from device gallery or disk"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Choose from Gallery</span>
                </button>

                {userPhoto && (
                  <>
                    <button
                      type="button"
                      onClick={() => setVisorTintEnabled(!visorTintEnabled)}
                      className="biometric-toggle-btn"
                      title="Toggle translucent visor tint coating over face"
                    >
                      <span>Visor Tint: {visorTintEnabled ? 'Tinted Glass' : 'Clear View'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="biometric-remove-btn"
                    >
                      <span>Remove Photo</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Suit Color Scheme */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>3. SUIT COLOR REGIME</span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {SUIT_THEMES.map((theme) => {
                  const isSel = selectedTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeChange(theme)}
                      className="color-swatch"
                      title={theme.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: theme.primaryColor,
                        border: `2px solid ${isSel ? 'var(--moon)' : 'var(--steel)'}`,
                        boxShadow: isSel ? `0 0 12px ${theme.trimColor}` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Visor Coating */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>4. VISOR COATING & TINT</span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {VISOR_TINTS.map((visor) => {
                  const isSel = selectedVisor.id === visor.id;
                  return (
                    <button
                      key={visor.id}
                      type="button"
                      onClick={() => handleVisorChange(visor)}
                      className="color-swatch"
                      title={visor.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${visor.gradStart}, ${visor.gradEnd})`,
                        border: `2px solid ${isSel ? 'var(--moon)' : 'var(--steel)'}`,
                        boxShadow: isSel ? `0 0 12px ${visor.glowColor}` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Helmet Design */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>5. HELMET PROFILE</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-xs)' }}>
                {HELMET_STYLES.map((h) => {
                  const isSel = selectedHelmet === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleHelmetChange(h.id)}
                      className="customizer-btn"
                      style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        backgroundColor: isSel ? 'color-mix(in srgb, var(--orbit) 25%, var(--navy))' : 'color-mix(in srgb, var(--void) 50%, transparent)',
                        border: `1px solid ${isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: isSel ? 'var(--moon)' : 'var(--star)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {h.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department Mission Patch */}
            <div>
              <span style={sectionLabelStyle}>6. DEPARTMENT MISSION PATCH</span>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {PATCHES.map((patch) => {
                  const isSel = selectedPatch.id === patch.id;
                  return (
                    <button
                      key={patch.id}
                      type="button"
                      onClick={() => handlePatchChange(patch)}
                      className="customizer-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.6rem',
                        backgroundColor: isSel ? 'color-mix(in srgb, var(--astrophage) 20%, var(--navy))' : 'color-mix(in srgb, var(--void) 60%, transparent)',
                        border: `1px solid ${isSel ? 'var(--astrophage)' : 'color-mix(in srgb, var(--steel) 25%, transparent)'}`,
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: isSel ? 'var(--moon)' : 'var(--star)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <img src={patch.icon} alt="" width="18" height="18" style={{ objectFit: 'contain' }} />
                      <span>{patch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Live Camera Biometric Scanner Modal */}
      {isCameraActive && (
        <div className="biometric-camera-overlay" onClick={(e) => { if (e.target === e.currentTarget) stopCamera(); }}>
          <div className="biometric-scanner-modal" role="dialog" aria-modal="true" aria-labelledby="scanner-modal-title">
            <div className="scanner-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="scanner-live-badge">LIVE WEBCAM</span>
                <span id="scanner-modal-title" className="scanner-modal-title">CADET BIOMETRIC SCANNER</span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="scanner-close-btn"
                aria-label="Close camera scanner"
              >
                ✕
              </button>
            </div>

            <div className="scanner-viewport-box">
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`scanner-video-feed ${cameraFacing === 'user' ? 'mirror' : ''}`}
              />

              {/* Astronaut Visor Guide HUD Reticle */}
              {!cameraError && (
                <div className="scanner-reticle-overlay">
                  <svg className="scanner-reticle-svg" viewBox="0 0 400 400" preserveAspectRatio="none">
                    {/* Outer Frame Corner Accents */}
                    <path d="M 20 50 L 20 20 L 50 20" stroke="#38bdf8" strokeWidth="3" fill="none" />
                    <path d="M 350 20 L 380 20 L 380 50" stroke="#38bdf8" strokeWidth="3" fill="none" />
                    <path d="M 20 350 L 20 380 L 50 380" stroke="#38bdf8" strokeWidth="3" fill="none" />
                    <path d="M 350 380 L 380 380 L 380 350" stroke="#38bdf8" strokeWidth="3" fill="none" />

                    {/* Visor Oval Target Guide */}
                    <ellipse
                      cx="200"
                      cy="195"
                      rx="110"
                      ry="135"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      opacity="0.8"
                    />

                    {/* Eye Level Guideline */}
                    <line x1="130" y1="175" x2="270" y2="175" stroke="#ffb86b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <circle cx="200" cy="195" r="3" fill="#ffb86b" />
                  </svg>
                  <div className="scanner-reticle-label">ALIGN CADET FACE INSIDE VISOR OVAL</div>
                </div>
              )}

              {/* Loading State */}
              {cameraLoading && (
                <div className="scanner-status-scrim">
                  <div className="scanner-spinner"></div>
                  <span className="scanner-status-text">INITIALIZING OPTICAL SENSOR...</span>
                </div>
              )}

              {/* Error State */}
              {cameraError && (
                <div className="scanner-status-scrim error-scrim">
                  <div className="scanner-error-icon">!</div>
                  <span className="scanner-error-title">CAMERA SENSOR UNAVAILABLE</span>
                  <p className="scanner-error-desc">{cameraError}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => startCamera(cameraFacing)}
                      className="scanner-retry-btn"
                    >
                      Retry Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        fileInputRef.current?.click();
                      }}
                      className="scanner-alt-btn"
                    >
                      Choose from Gallery
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="scanner-controls-bar">
              <button
                type="button"
                onClick={stopCamera}
                className="scanner-action-btn cancel-btn"
              >
                Abort
              </button>

              <button
                type="button"
                onClick={() => startCamera(cameraFacing === 'user' ? 'environment' : 'user')}
                className="scanner-action-btn flip-btn"
                title="Switch front/back camera"
                disabled={cameraLoading || !!cameraError}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 1.253.287 2.438.8 3.5L2 16h6v-6L5.5 6.5C6.91 5.37 8.86 4.5 11 4.5c4.14 0 7.5 3.36 7.5 7.5s-3.36 7.5-7.5 7.5c-1.85 0-3.54-.68-4.85-1.81l-1.42 1.42C6.42 20.61 8.57 21.5 11 21.5c5.523 0 10-4.477 10-10z" />
                </svg>
                <span>Flip Sensor</span>
              </button>

              <button
                type="button"
                onClick={captureFromCamera}
                className="scanner-snap-btn"
                disabled={cameraLoading || !!cameraError}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
                <span>SNAP PHOTO</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--orbit)',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'color-mix(in srgb, var(--void) 70%, transparent)',
  border: '1px solid var(--steel)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-xs) var(--space-sm)',
  color: 'var(--moon)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  outline: 'none',
  boxSizing: 'border-box',
};
