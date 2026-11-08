/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

const sharp = require('sharp');
const fs = require('fs');

async function generateCleanStarfield() {
  const inputPath = 'C:/Users/vraj1/.gemini/antigravity/brain/e4077449-846d-41cf-99ff-1e149f79a922/.user_uploaded/media_1794135174712_6745e3d0.jpg';

  // The original image has width 861 and height 571.
  // Center of the logo is at cx = 439, cy = 268.
  // The 'S' starts at x=125, 'D' ends at x=770 (span = 645px).
  // The circle has radius 219px (from y=49 to y=487).
  // To contain the entire emblem and text with clean breathing room inside a circle:
  // We use radius R = 360 (diameter 720).
  // Extract 720px width centered at 439: left = 439 - 360 = 79.
  // Height is 571, so vertical offset onto a 720x720 canvas is (720 - 571) / 2 = 75px.
  // Top/bottom background in the image is solid #213250.

  const extracted = await sharp(inputPath)
    .extract({ left: 79, top: 0, width: 720, height: 571 })
    .toBuffer();

  const circleMask = Buffer.from(
    '<svg width="720" height="720"><circle cx="360" cy="360" r="358" fill="white"/></svg>'
  );

  const cleanEmblem720 = await sharp({
    create: {
      width: 720,
      height: 720,
      channels: 4,
      background: { r: 33, g: 50, b: 80, alpha: 1 } // #213250
    }
  })
    .composite([
      { input: extracted, left: 0, top: 75 },
      { input: circleMask, left: 0, top: 0, blend: 'dest-in' }
    ])
    .png()
    .toBuffer();

  // Generate 256x256 high-resolution badge
  const finalBadge = await sharp(cleanEmblem720)
    .resize(256, 256, { fit: 'contain' })
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  // Write to both badge locations
  fs.writeFileSync('public/icons/starfield-rocket-badge.png', finalBadge);
  fs.writeFileSync('public/icons/starfield-badge.png', finalBadge);

  console.log('SUCCESS: starfield-rocket-badge.png and starfield-badge.png generated cleanly! Buffer size:', finalBadge.length);
}

generateCleanStarfield().catch((err) => {
  console.error('Error generating clean starfield:', err);
  process.exit(1);
});
