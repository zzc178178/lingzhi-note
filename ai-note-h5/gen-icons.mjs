import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgPath = join(__dirname, 'public', 'logo.svg')
const svgBuffer = readFileSync(svgPath)

async function generate() {
  await sharp(svgBuffer).resize(192, 192).png().toFile(join(__dirname, 'public', 'icon-192.png'))
  console.log('✓ icon-192.png')
  await sharp(svgBuffer).resize(512, 512).png().toFile(join(__dirname, 'public', 'icon-512.png'))
  console.log('✓ icon-512.png')
  await sharp(svgBuffer).resize(32, 32).png().toFile(join(__dirname, 'public', 'favicon-32.png'))
  console.log('✓ favicon-32.png')
  await sharp(svgBuffer).resize(16, 16).png().toFile(join(__dirname, 'public', 'favicon-16.png'))
  console.log('✓ favicon-16.png')
  const icoPng = await sharp(svgBuffer).resize(32, 32).png().toBuffer()
  const icoDir = Buffer.alloc(22)
  icoDir.writeUInt16LE(0, 0)
  icoDir.writeUInt16LE(1, 2)
  icoDir.writeUInt16LE(1, 4)
  icoDir.writeUInt8(32, 6)
  icoDir.writeUInt8(32, 7)
  icoDir.writeUInt8(0, 8)
  icoDir.writeUInt8(0, 9)
  icoDir.writeUInt16LE(1, 10)
  icoDir.writeUInt16LE(32, 12)
  icoDir.writeUInt32LE(icoPng.length, 14)
  icoDir.writeUInt32LE(22, 18)
  const { writeFileSync } = await import('fs')
  writeFileSync(join(__dirname, 'public', 'favicon.ico'), Buffer.concat([icoDir, icoPng]))
  console.log('✓ favicon.ico')
}

generate().catch(console.error)
