#!/usr/bin/env node

const chokidar = require('chokidar')
const fs = require('fs')
const colors = require('colors')
const path = require('path')

/**
 * Dirs to watch in which the index.ts file will be generated
 * @type {string[]}
 */
let dirsToWatch = []

/**
 * The package name
 * @type {string}
 */
const packageName = 'indexes-ts'

/**
 * The json config file name
 * @type {string}
 */
const jsonFileName = 'indexes-ts.json'

/**
 * Check if an index.ts file exists in the given dir
 * @param dir
 * @returns {*}
 */
const isThereIndex = (dir) => {
  return fs.existsSync(`${dir}/index.ts`)
}

/**
 * Create an index.ts file in the given dir
 * @param dir
 */
const createIndex = (dir) => {
  fs.writeFileSync(`${dir}/index.ts`, '')
}

/**
 * Generate a list of export statements for the given dir
 * @param dir
 */
const fillIndex = (dir) => {

  /**
   * Get the dir and the ignore list from the dirsToWatch array
   * @type {{dir: string, ignore: string[]}}
   */
  const rawDir= {
    dir: dir.dir ?? dir,
    ignore: [].concat(dirsToWatch.find((dirToWatch) => {
      const dirIsString = typeof dirToWatch === 'string'
      return dirIsString ? dirToWatch === dir : dirToWatch.dir === dir
    }).ignore ?? [])
  }

  /**
   * Scan the dir and filter the files according to the ignore list
   */
  const scanDir = fs.readdirSync(rawDir.dir).filter((file) => {
    return file !== 'index.ts' && !rawDir.ignore.some((ignore) => {
      return file.match(`^${ignore}$`)
    })
  })

  /**
   * Generate the export statements then write them in the index.ts file
   */
  const lines = scanDir.map((file) => {
    return `export * from './${file.replace('.ts', '')}'`
  })
  fs.writeFileSync(`${dir}/index.ts`, lines.join('\n'))
}

/**
 * Extract the dir from the given path
 * @param path
 * @returns {`./${string}`}
 */
const getDirFromPath = (path) => {
  return `./${path.split('/').slice(0, 1)}`
}

/**
 * Generate and/or update the index.ts file in the given path
 * @param path
 */
const generateIndex = (path) => {
  if (!isThereIndex(path)) {
    createIndex(path)
  }
  fillIndex(path)
}

/**
 * The logic
 */
try {

  /**
   * Check if the json config file exists
   */
  const indexPath = path.join(process.cwd(), jsonFileName)
  if (!fs.existsSync(indexPath)) {
    throw new Error(`${jsonFileName} file not found`)
  }

  /**
   * Read the json config file and parse it in dirsToWatch array
   */
  dirsToWatch = JSON.parse(fs.readFileSync(indexPath, 'utf8'))

  const computedDirsToWatch = dirsToWatch.map((dir) => {
    return typeof dir === 'string' ? dir : dir.dir
  })

  /**
   * Check if the dirsToWatch is an array, if not throw an error
   */
  if (!Array.isArray(dirsToWatch)) {
    throw new Error(`${jsonFileName} file must be an array`)
  }

  /**
   * Check if the dirsToWatch array is empty, if so, log a message
   */
  if (dirsToWatch.length === 0) {
    console.log(`${colors.green(packageName)} - waiting for directories to watch`)
  }

  /**
   * Initialize the watcher
   * @type {FSWatcher}
   */
  const watcher = chokidar.watch(computedDirsToWatch)

  /**
   * Logic when a file is added or removed
   */
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

  /**
   * Log the error if something went wrong
   */
  console.log(`${colors.red(packageName)} - ${err.message}`)

}
