import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
const GPX_EXTS = ['gpx']
const DOC_EXTS = ['pdf', 'doc', 'docx', 'xls', 'xlsx']

const DATA_DIR = resolve('src/data')
const ROOT_EVENTS_FILE = resolve('src/data/events.md')
const EVENTS_DIR = resolve('src/data/events')

const META_FIELD_NAMES = {
  lieu: 'location',
  horaire: 'schedule',
  catégorie: 'category',
  categorie: 'category',
  'date fin': 'endDate',
  documents: 'attachments',
}

function fail(source, line, message) {
  throw new Error(`${source}:${line} ${message}`)
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function isValidTime(value) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
}

function slugifyTitle(title) {
  return title.toLowerCase().replace(/[^a-zà-ÿ0-9]+/g, '-').replace(/-+$/, '')
}

function detectType(url) {
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0] || ''
  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (GPX_EXTS.includes(ext)) return 'gpx'
  if (DOC_EXTS.includes(ext)) return 'document'
  return 'link'
}

function parseAttachments(value, source, line) {
  const attachments = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match

  while ((match = linkRegex.exec(value)) !== null) {
    attachments.push({
      label: match[1].trim(),
      url: match[2].trim(),
      type: detectType(match[2].trim()),
    })
  }

  if (attachments.length === 0) {
    fail(source, line, 'Documents doit contenir au moins un lien Markdown du type [Label](URL).')
  }

  const leftover = value.replace(linkRegex, '').replace(/,/g, '').trim()
  if (leftover) {
    fail(source, line, 'Documents ne peut contenir que des liens Markdown séparés par des virgules.')
  }

  return attachments
}

function trimEmptyLines(lines) {
  while (lines[0] === '') lines.shift()
  while (lines.at(-1) === '') lines.pop()
  return lines
}

function parseEventBlock(block, source, startLine) {
  const lines = block.split('\n')
  const headerMatch = lines[0].match(/^##\s+(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*$/)

  if (!headerMatch) {
    fail(source, startLine, 'Titre invalide. Format attendu : ## AAAA-MM-JJ | Titre')
  }

  const [, startDate, rawTitle] = headerMatch
  const title = rawTitle.trim()

  if (!isValidDate(startDate)) {
    fail(source, startLine, `Date invalide "${startDate}". Format attendu : AAAA-MM-JJ.`)
  }

  if (!title) {
    fail(source, startLine, 'Le titre de l’événement ne peut pas être vide.')
  }

  const event = {
    id: `${startDate}-${slugifyTitle(title)}`,
    startDate,
    title,
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    endDate: startDate,
    category: '',
    attachments: [],
  }

  const seenFields = new Set()
  const descriptionLines = []
  let descriptionStarted = false

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmedLine = rawLine.trim()
    const lineNumber = startLine + i

    if (trimmedLine === '') {
      if (descriptionStarted) descriptionLines.push('')
      continue
    }

    const metaMatch = trimmedLine.match(/^-\s+\*\*([^*]+):\*\*\s+(.+)\s*$/)
    if (metaMatch) {
      if (descriptionStarted) {
        fail(source, lineNumber, 'Les métadonnées doivent apparaître avant la description.')
      }

      const rawKey = metaMatch[1].trim().toLowerCase()
      const value = metaMatch[2].trim()
      const fieldName = META_FIELD_NAMES[rawKey]

      if (!fieldName) {
        fail(source, lineNumber, `Champ non supporté "${metaMatch[1].trim()}".`)
      }

      if (seenFields.has(fieldName)) {
        fail(source, lineNumber, `Champ dupliqué "${metaMatch[1].trim()}".`)
      }

      seenFields.add(fieldName)

      if (fieldName === 'location') {
        event.location = value
      } else if (fieldName === 'schedule') {
        const timeMatch = value.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/)
        if (!timeMatch || !isValidTime(timeMatch[1]) || !isValidTime(timeMatch[2])) {
          fail(source, lineNumber, 'Horaire invalide. Format attendu : HH:MM - HH:MM.')
        }

        if (timeMatch[2] <= timeMatch[1]) {
          fail(source, lineNumber, 'L’heure de fin doit être après l’heure de début.')
        }

        event.startTime = timeMatch[1]
        event.endTime = timeMatch[2]
      } else if (fieldName === 'category') {
        event.category = value
      } else if (fieldName === 'endDate') {
        if (!isValidDate(value)) {
          fail(source, lineNumber, `Date fin invalide "${value}". Format attendu : AAAA-MM-JJ.`)
        }

        if (value < event.startDate) {
          fail(source, lineNumber, 'La date de fin ne peut pas être avant la date de début.')
        }

        event.endDate = value
      } else if (fieldName === 'attachments') {
        event.attachments = parseAttachments(value, source, lineNumber)
      }

      continue
    }

    if (trimmedLine.startsWith('- **')) {
      fail(source, lineNumber, 'Métadonnée invalide. Format attendu : - **Clé:** valeur')
    }

    descriptionStarted = true
    descriptionLines.push(rawLine.trimEnd())
  }

  event.description = trimEmptyLines(descriptionLines).join('\n')

  return event
}

function collectMarkdownFiles(dirPath) {
  if (!existsSync(dirPath)) return []

  return readdirSync(dirPath, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    .flatMap((entry) => {
      const fullPath = resolve(dirPath, entry.name)
      if (entry.isDirectory()) return collectMarkdownFiles(fullPath)
      return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : []
    })
}

export function getEventSourcePaths(rootDir = process.cwd()) {
  const dataDir = resolve(rootDir, 'src/data')
  const sourcePaths = collectMarkdownFiles(dataDir)

  if (sourcePaths.length === 0) {
    throw new Error('Aucune source d’événements trouvée. Ajoutez des fichiers .md dans src/data/.')
  }

  return sourcePaths
}

export function getEventWatchPaths(rootDir = process.cwd()) {
  return [resolve(rootDir, 'src/data')]
}

export function isEventSourceFile(filePath, rootDir = process.cwd()) {
  const resolvedFile = resolve(filePath)
  const dataDir = resolve(rootDir, 'src/data')

  return resolvedFile.startsWith(dataDir + sep) && resolvedFile.endsWith('.md')
}

export function parseEventsMd(content, source = 'src/data/events.md') {
  const normalizedContent = content.replace(/\r\n/g, '\n')
  if (!normalizedContent.trim()) return []

  const headingMatches = [...normalizedContent.matchAll(/^##\s+.*$/gm)]
  if (headingMatches.length === 0) {
    fail(source, 1, 'Aucun événement trouvé. Chaque événement doit commencer par "## AAAA-MM-JJ | Titre".')
  }

  return headingMatches.map((match, index) => {
    const startIndex = match.index
    const endIndex = headingMatches[index + 1]?.index ?? normalizedContent.length
    const block = normalizedContent.slice(startIndex, endIndex).trimEnd()
    const startLine = normalizedContent.slice(0, startIndex).split('\n').length
    return parseEventBlock(block, source, startLine)
  })
}

export function loadEvents(rootDir = process.cwd()) {
  const sourcePaths = getEventSourcePaths(rootDir)
  const events = []
  const knownIds = new Map()

  for (const sourcePath of sourcePaths) {
    const source = relative(rootDir, sourcePath) || sourcePath
    const content = readFileSync(sourcePath, 'utf-8')
    const parsedEvents = parseEventsMd(content, source)

    for (const event of parsedEvents) {
      const existingSource = knownIds.get(event.id)
      if (existingSource) {
        throw new Error(`${source} ID d’événement dupliqué "${event.id}", déjà utilisé dans ${existingSource}.`)
      }

      knownIds.set(event.id, source)
      events.push(event)
    }
  }

  return events.sort((a, b) => {
    if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate)
    return a.title.localeCompare(b.title, 'fr')
  })
}

export { DATA_DIR, EVENTS_DIR, ROOT_EVENTS_FILE }
