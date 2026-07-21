import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

async function generateFavicon() {
  const inputPath = path.resolve(process.cwd(), 'public/icons/icon-192.png')
  const outPublicFavicon = path.resolve(process.cwd(), 'public/favicon.ico')
  const outAppFavicon = path.resolve(process.cwd(), 'src/app/favicon.ico')

  if (!fs.existsSync(inputPath)) {
    console.error('Input icon not found at:', inputPath)
    process.exit(1)
  }

  // Generate 32x32 png / ico buffer
  const buffer = await sharp(inputPath)
    .resize(32, 32)
    .toFormat('png')
    .toBuffer()

  fs.writeFileSync(outPublicFavicon, buffer)
  fs.writeFileSync(outAppFavicon, buffer)

  console.log('✓ Successfully generated favicon.ico from icon-192.png!')
}

generateFavicon().catch((err) => {
  console.error('Failed to generate favicon:', err)
  process.exit(1)
})
