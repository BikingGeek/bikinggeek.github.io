const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DOWNLOAD_DIR = path.join(__dirname, 'assets', 'images', 'motors');

// Focus on bikes that use these motors — promotional/product images look much better
const motors = [
  {
    name: 'tq-hpr50',
    urls: [
      'https://www.trekbikes.com/us/en_US/bikes/mountain-bikes/electric-mountain-bikes/fuel-exe/fuel-exe-9-9-xx-axs/p/41563/',
      'https://www.trekbikes.com/us/en_US/bikes/mountain-bikes/electric-mountain-bikes/fuel-exe/',
      'https://www.pivotcycles.com/en/shuttle-sl',
    ],
    selectors: ['img[src*="fuel-exe"], img[src*="Fuel"], img[src*="shuttle"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Trek Fuel EXe TQ HPR50 ebike',
  },
  {
    name: 'fazua-ride-60',
    urls: [
      'https://www.forestal.com/en/siryon',
      'https://www.focus-bikes.com/gb_en/jam2-sl',
      'https://www.canyon.com/en-us/electric-bikes/electric-mountain-bikes/neuron-onfly/',
    ],
    selectors: ['img[src*="siryon"], img[src*="jam"], img[src*="neuron"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Forestal Siryon Fazua Ride 60 ebike',
  },
  {
    name: 'bosch-sx',
    urls: [
      'https://www.scott-sports.com/global/en/bikes/electric/lumen-eride',
      'https://www.cube.eu/en/cube-bikes/e-bikes/e-mountainbikes/stereo-hybrid/',
      'https://www.cannondale.com/en-us/bikes/electric/e-mountain',
    ],
    selectors: ['img[src*="lumen"], img[src*="stereo"], img[src*="moterra"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Scott Lumen eRIDE Bosch SX ebike',
  },
  {
    name: 'mahle-x35',
    urls: [
      'https://www.orbea.com/us-en/ebikes/road/gain/',
      'https://www.orbea.com/gb-en/ebikes/road/gain/',
    ],
    selectors: ['img[src*="gain"], img[src*="Gain"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Orbea Gain Mahle X35 ebike',
  },
  {
    name: 'specialized-sl-1-2',
    urls: [
      'https://www.specialized.com/us/en/turbo-levo-sl',
      'https://www.specialized.com/us/en/shop/bikes/mountain-bikes/turbo-levo-sl',
    ],
    selectors: ['img[src*="levo-sl"], img[src*="Levo"], img[src*="turbo"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Specialized Turbo Levo SL ebike',
  },
  {
    name: 'mahle-x20',
    urls: [
      'https://www.orbea.com/us-en/ebikes/road/gain/',
      'https://www.scottaddict.com/en/bikes/road/addict-eride/',
    ],
    selectors: ['img[src*="gain"], img[src*="addict"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Mahle X20 lightweight ebike road',
  },
  // Full-power motors
  {
    name: 'dji-avinox',
    urls: [
      'https://www.canyon.com/en-us/electric-bikes/electric-mountain-bikes/neuron-onfly/',
      'https://www.canyon.com/en-de/electric-bikes/electric-mountain-bikes/neuron-onfly/',
      'https://www.amflow.com/pl/',
    ],
    selectors: ['img[src*="neuron"], img[src*="onfly"], img[src*="amflow"], img[src*="Neuron"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Canyon Neuron ONfly DJI Avinox ebike promotional',
  },
  {
    name: 'shimano-ep801',
    urls: [
      'https://www.trekbikes.com/us/en_US/bikes/mountain-bikes/electric-mountain-bikes/rail/',
      'https://www.santacruzbicycles.com/en-US/bikes/heckler',
      'https://www.orbea.com/us-en/ebikes/mountain/wild/',
    ],
    selectors: ['img[src*="rail"], img[src*="Rail"], img[src*="heckler"], img[src*="Heckler"], img[src*="wild"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Trek Rail Shimano EP801 emtb promotional',
  },
  {
    name: 'shimano-ep6',
    urls: [
      'https://www.merida-bikes.com/en/bikes/e-mountain/eone-sixty/',
      'https://www.scott-sports.com/global/en/bikes/electric/strike-eride',
      'https://www.orbea.com/us-en/ebikes/mountain/wild/',
    ],
    selectors: ['img[src*="eone"], img[src*="strike"], img[src*="Strike"], img[src*="wild"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Merida eONE-SIXTY Shimano EP6 ebike promotional',
  },
  {
    name: 'panasonic-gx-ultimate',
    urls: [
      'https://www.flyer-bikes.com/ch-en/e-bikes/',
      'https://www.kalkhoff-bikes.com/en/e-bikes/',
    ],
    selectors: ['img[src*="flyer"], img[src*="uproc"], img[src*="kalkhoff"], .product-image img, .hero img, main img'],
    fallbackSearch: 'Panasonic GX Ultimate ebike full suspension promotional',
  },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('image')) {
        reject(new Error(`Not an image: ${contentType}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(filepath); });
      file.on('error', reject);
    });
    request.on('error', reject);
    request.setTimeout(15000, () => { request.destroy(); reject(new Error('Timeout')); });
  });
}

async function findBikeImage(page, motor) {
  for (const url of motor.urls) {
    try {
      console.log(`  Trying ${url}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(3000);

      // Try each selector group
      for (const selectorGroup of motor.selectors) {
        const selectors = selectorGroup.split(', ');
        for (const sel of selectors) {
          try {
            const imgs = await page.$$(sel.trim());
            for (const img of imgs) {
              let src = await img.getAttribute('src');
              if (!src) {
                const srcset = await img.getAttribute('srcset');
                if (srcset) {
                  // Pick the largest image from srcset
                  const parts = srcset.split(',').map(s => s.trim());
                  let best = parts[0].split(' ')[0];
                  let bestW = 0;
                  for (const part of parts) {
                    const [u, w] = part.split(' ');
                    const width = parseInt(w) || 0;
                    if (width > bestW) { bestW = width; best = u; }
                  }
                  src = best;
                }
              }
              if (src && !src.includes('data:') && !src.includes('svg') && !src.includes('logo') && !src.includes('icon') && !src.includes('placeholder')) {
                if (src.startsWith('//')) src = 'https:' + src;
                else if (src.startsWith('/')) {
                  const urlObj = new URL(url);
                  src = urlObj.origin + src;
                }
                const box = await img.boundingBox();
                if (box && box.width > 200 && box.height > 150) {
                  return src;
                }
              }
            }
          } catch (e) { /* selector not found */ }
        }
      }

      // Fallback: find largest image on the page
      const largestImg = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        let best = null;
        let bestArea = 0;
        for (const img of imgs) {
          const area = img.naturalWidth * img.naturalHeight;
          const src = img.src || '';
          if (area > bestArea && area > 40000 && !src.includes('logo') && !src.includes('icon') && !src.includes('svg') && !src.includes('data:') && !src.includes('placeholder')) {
            best = src;
            bestArea = area;
          }
        }
        return best;
      });
      if (largestImg) return largestImg;
    } catch (e) {
      console.log(`  Error on ${url}: ${e.message}`);
    }
  }

  // Google Images fallback — search for bike with this motor
  try {
    console.log(`  Trying Google Images for "${motor.fallbackSearch}"...`);
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(motor.fallbackSearch)}&tbm=isch&tbs=isz:l`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    await page.waitForTimeout(2000);

    try {
      const acceptBtn = await page.$('button:has-text("Accept"), button:has-text("Aceptar"), button:has-text("I agree")');
      if (acceptBtn) await acceptBtn.click();
      await page.waitForTimeout(1000);
    } catch (e) { /* no cookie banner */ }

    const imgSrc = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      for (const img of imgs) {
        const src = img.src || '';
        if (src.startsWith('http') && !src.includes('google') && !src.includes('gstatic') && img.naturalWidth > 150) {
          return src;
        }
      }
      return null;
    });
    if (imgSrc) return imgSrc;
  } catch (e) {
    console.log(`  Google fallback failed: ${e.message}`);
  }

  return null;
}

async function screenshotBikeImage(page, motor) {
  for (const url of motor.urls) {
    try {
      console.log(`  Screenshotting from ${url}...`);
      await page.goto(url, { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(3000);

      for (const selectorGroup of motor.selectors) {
        const selectors = selectorGroup.split(', ');
        for (const sel of selectors) {
          try {
            const imgs = await page.$$(sel.trim());
            for (const img of imgs) {
              const box = await img.boundingBox();
              if (box && box.width > 250 && box.height > 150) {
                const filepath = path.join(DOWNLOAD_DIR, `${motor.name}.png`);
                await img.screenshot({ path: filepath });
                console.log(`  ✓ Screenshot saved: ${filepath}`);
                return filepath;
              }
            }
          } catch (e) { /* skip */ }
        }
      }
    } catch (e) {
      console.log(`  Screenshot error: ${e.message}`);
    }
  }
  return null;
}

(async () => {
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  });

  const results = {};

  for (const motor of motors) {
    console.log(`\nProcessing: ${motor.name}`);

    // Skip if image already exists
    const existingFiles = fs.readdirSync(DOWNLOAD_DIR).filter(f => f.startsWith(motor.name + '.'));
    if (existingFiles.length > 0) {
      console.log(`  ⏭ Already exists: ${existingFiles[0]} — skipping`);
      results[motor.name] = { status: 'skipped', path: path.join(DOWNLOAD_DIR, existingFiles[0]) };
      continue;
    }

    const page = await context.newPage();

    try {
      const imgUrl = await findBikeImage(page, motor);
      if (imgUrl) {
        console.log(`  Found image URL: ${imgUrl}`);
        const ext = imgUrl.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || 'jpg';
        const filepath = path.join(DOWNLOAD_DIR, `${motor.name}.${ext}`);
        try {
          await downloadImage(imgUrl, filepath);
          console.log(`  ✓ Downloaded: ${filepath}`);
          results[motor.name] = { status: 'downloaded', path: filepath, url: imgUrl };
          await page.close();
          continue;
        } catch (e) {
          console.log(`  Download failed: ${e.message}`);
        }
      }

      const screenshotPath = await screenshotBikeImage(page, motor);
      if (screenshotPath) {
        results[motor.name] = { status: 'screenshot', path: screenshotPath };
      } else {
        console.log(`  ✗ No image found for ${motor.name}`);
        results[motor.name] = { status: 'failed' };
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
      results[motor.name] = { status: 'error', error: e.message };
    }

    await page.close();
  }

  await browser.close();

  console.log('\n=== RESULTS ===');
  for (const [name, result] of Object.entries(results)) {
    console.log(`${name}: ${result.status}${result.path ? ` -> ${result.path}` : ''}${result.url ? ` (${result.url})` : ''}`);
  }
})();
