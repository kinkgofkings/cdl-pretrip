import fs from 'fs';
import zlib from 'zlib';

function createTruckAppIconPng(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);
    const crc = crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, body, crcBuf]);
  }

  // Table for CRC calculation
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // filter None
    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      const nx = x / width;

      // Base: Dark carbon / titanium gradient
      let r = 8 + Math.floor(ny * 10);
      let g = 14 + Math.floor(ny * 12);
      let b = 28 + Math.floor(ny * 15);

      // Outer border (bezel)
      const distFromBorder = Math.min(nx, 1 - nx, ny, 1 - ny);
      if (distFromBorder < 0.04 && distFromBorder > 0.02) {
        // Metallic silver border ring
        r = 180; g = 195; b = 210;
      } else if (distFromBorder <= 0.02) {
        // Outer dark edge
        r = 5; g = 10; b = 18;
      }

      // Exhaust Stacks (Left: x ~ 0.20 to 0.25, Right: x ~ 0.75 to 0.80, y: 0.12 to 0.45)
      const isLeftStack = nx >= 0.20 && nx <= 0.24 && ny >= 0.12 && ny <= 0.45;
      const isRightStack = nx >= 0.76 && nx <= 0.80 && ny >= 0.12 && ny <= 0.45;
      if (isLeftStack || isRightStack) {
        // Chrome vertical highlight
        const stackX = isLeftStack ? (nx - 0.20) / 0.04 : (nx - 0.76) / 0.04;
        const chrome = Math.floor(140 + 115 * Math.sin(stackX * Math.PI));
        r = chrome; g = chrome; b = Math.min(255, chrome + 20);
      }

      // Cab Sunvisor & Roof (y: 0.24 to 0.32, x: 0.26 to 0.74)
      if (ny >= 0.24 && ny <= 0.32 && nx >= 0.26 && nx <= 0.74) {
        r = 30; g = 40; b = 58;
      }

      // 5 Amber Clearance Lights on roof (ny ~ 0.26, spaced horizontally)
      const isAmberLight =
        Math.abs(ny - 0.26) < 0.02 &&
        (Math.abs(nx - 0.36) < 0.015 ||
         Math.abs(nx - 0.43) < 0.015 ||
         Math.abs(nx - 0.50) < 0.018 ||
         Math.abs(nx - 0.57) < 0.015 ||
         Math.abs(nx - 0.64) < 0.015);
      if (isAmberLight) {
        r = 245; g = 158; b = 11; // Amber light
      }

      // Windshield (y: 0.33 to 0.44, left split: 0.30 to 0.48, right split: 0.52 to 0.70)
      const isLeftWindshield = ny >= 0.33 && ny <= 0.44 && nx >= 0.30 && nx <= 0.48;
      const isRightWindshield = ny >= 0.33 && ny <= 0.44 && nx >= 0.52 && nx <= 0.70;
      if (isLeftWindshield || isRightWindshield) {
        r = 20; g = 35; b = 60;
        // Glass cyan specular reflection diagonal
        if (Math.abs(nx - (ny * 0.7 + 0.15)) < 0.03 || Math.abs(nx - (ny * 0.7 + 0.35)) < 0.03) {
          r = 100; g = 190; b = 255;
        }
      }

      // Peterbilt Chrome Grille (y: 0.46 to 0.72, x: 0.34 to 0.66)
      if (ny >= 0.46 && ny <= 0.72 && nx >= 0.34 && nx <= 0.66) {
        const isGrilleBorder = nx <= 0.36 || nx >= 0.64 || ny <= 0.48 || ny >= 0.70;
        if (isGrilleBorder) {
          // Polished Chrome Bezel
          r = 220; g = 225; b = 235;
        } else {
          // Vertical Louver bars
          const barIndex = Math.floor((nx - 0.36) * 50);
          if (barIndex % 2 === 0) {
            r = 190; g = 200; b = 215; // Chrome bar
          } else {
            r = 10; g = 15; b = 25; // Dark gap
          }
          // Center oval emblem
          const dx = (nx - 0.50) / 0.07;
          const dy = (ny - 0.59) / 0.04;
          if (dx * dx + dy * dy <= 1) {
            r = 230; g = 235; b = 245;
          }
        }
      }

      // Xenon Blue Headlights (Left: nx ~ 0.22 to 0.31, Right: nx ~ 0.69 to 0.78, ny: 0.52 to 0.62)
      const isLeftHeadlight = ny >= 0.52 && ny <= 0.62 && nx >= 0.22 && nx <= 0.31;
      const isRightHeadlight = ny >= 0.52 && ny <= 0.62 && nx >= 0.69 && nx <= 0.78;
      if (isLeftHeadlight || isRightHeadlight) {
        const hlX = isLeftHeadlight ? (nx - 0.265) / 0.04 : (nx - 0.735) / 0.04;
        const hlY = (ny - 0.57) / 0.045;
        const dist = hlX * hlX + hlY * hlY;
        if (dist <= 0.4) {
          r = 255; g = 255; b = 255; // Piercing bulb center
        } else if (dist <= 1.0) {
          r = 56; g = 189; b = 248; // Xenon cyan glow
        } else {
          r = 40; g = 50; b = 65; // Housing
        }
      }

      // Massive Chrome Bumper (y: 0.73 to 0.81, x: 0.16 to 0.84)
      if (ny >= 0.73 && ny <= 0.81 && nx >= 0.16 && nx <= 0.84) {
        // High polish chrome gradient
        const bumperLight = Math.floor(180 + 70 * Math.sin(nx * 10));
        r = bumperLight; g = bumperLight; b = Math.min(255, bumperLight + 15);
      }

      // Emerald Checkmark Badge (nx: 0.74 to 0.90, ny: 0.70 to 0.86)
      const badgeDx = (nx - 0.80) / 0.09;
      const badgeDy = (ny - 0.78) / 0.09;
      if (badgeDx * badgeDx + badgeDy * badgeDy <= 1.0) {
        if (badgeDx * badgeDx + badgeDy * badgeDy >= 0.8) {
          r = 251; g = 191; b = 36; // Gold rim
        } else {
          r = 16; g = 185; b = 129; // Emerald green pass
        }
      }

      // Lower text area highlight (ny > 0.85)
      if (ny >= 0.85 && ny <= 0.94 && nx >= 0.20 && nx <= 0.80) {
        // Accent blue bar
        if (ny >= 0.91 && ny <= 0.93) {
          r = 56; g = 189; b = 248;
        }
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, chunk('IHDR', ihdr), idat, iend]);
}

const p192 = createTruckAppIconPng(192, 192);
const p512 = createTruckAppIconPng(512, 512);

fs.writeFileSync('public/pwa-192x192.png', p192);
fs.writeFileSync('public/pwa-512x512.png', p512);
fs.writeFileSync('public/apple-touch-icon.png', p192);
console.log('Badass truck PNG icons successfully generated in /public');
