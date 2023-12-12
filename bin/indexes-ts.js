const chokidar = require('chokidar')
const fs = require('fs')
const colors = require('colors')
const path = require('path')

let dirsToWatch = []
const packageName = 'indexes-ts'
const jsonFileName = 'indexes-ts.json'

const isThereIndex = (dir) => {
  return fs.existsSync(`${dir}/index.ts`)
}

const createIndex = (dir) => {
  fs.writeFileSync(`${dir}/index.ts`, '')
}

const fillIndex = (dir) => {
  const scanDir = fs.readdirSync(dir).filter((file) => {
    return file !== 'index.ts'
  })
  const lines = scanDir.map((file) => {
    return `export * from './${file.replace('.ts', '')}'`
  })
  fs.writeFileSync(`${dir}/index.ts`, lines.join('\n'))
}

const getDirFromPath = (path) => {
  return `./${path.split('/').slice(0, 1)}`
}

const generateIndex = (path) => {
  if (!isThereIndex(path)) {
    createIndex(path)
  }
  fillIndex(path)
}

try {
  const indexPath = path.join(process.cwd(), jsonFileName)
  if (!fs.existsSync(indexPath)) {
    throw new Error(`${jsonFileName} file not found`)
  }
  dirsToWatch = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  if (!Array.isArray(dirsToWatch)) {
    throw new Error(`${jsonFileName} file must be an array`)
  }
  if (dirsToWatch.length === 0) {
    console.log(`${colors.green(packageName)} - waiting for directories to watch`)
  }

  const watcher = chokidar.watch(dirsToWatch, {
    ignored: /[a-zA-Z].old.ts/,
  })

  watcher.on('add', (path) => {
    console.log(`${colors.green(packageName)} - Added ${path} file`)
    const dir = getDirFromPath(path)
    generateIndex(dir)
  }).on('unlink', (path) => {
    console.log(`${colors.green(packageName)} - Removed ${path} file`)
    const dir = getDirFromPath(path)
    generateIndex(dir)
  })

} catch (err) {
  console.log(`${colors.red(packageName)} - ${err.message}`)
}
