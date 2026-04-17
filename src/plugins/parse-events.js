const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
const GPX_EXTS = ['gpx']
const DOC_EXTS = ['pdf', 'doc', 'docx', 'xls', 'xlsx']

function detectType(url) {
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0] || ''
  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (GPX_EXTS.includes(ext)) return 'gpx'
  if (DOC_EXTS.includes(ext)) return 'document'
  return 'link'
}

function parseAttachments(value) {
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
  return attachments
}

export function parseEventsMd(content) {
  const events = []
  const blocks = content.split(/^## /m).filter(Boolean)

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    const headerMatch = lines[0].match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)$/)
    if (!headerMatch) continue

    const event = {
      id: headerMatch[1] + '-' + headerMatch[2].toLowerCase().replace(/[^a-zà-ÿ0-9]+/g, '-').replace(/-+$/, ''),
      startDate: headerMatch[1],
      title: headerMatch[2].trim(),
      description: '',
      location: '',
      startTime: '',
      endTime: '',
      endDate: headerMatch[1],
      category: '',
      attachments: [],
    }

    const descriptionLines = []
    for (let i = 1; i < lines.length; i++) {
      const rawLine = lines[i]
      const line = rawLine.trim()
      const metaMatch = line.match(/^-\s*\*\*(.+?):\*\*\s*(.+)$/)
      if (metaMatch) {
        const key = metaMatch[1].toLowerCase()
        const value = metaMatch[2].trim()
        if (key === 'lieu') event.location = value
        else if (key === 'horaire') {
          const timeMatch = value.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/)
          if (timeMatch) {
            event.startTime = timeMatch[1]
            event.endTime = timeMatch[2]
          }
        }
        else if (key === 'catégorie' || key === 'categorie') event.category = value
        else if (key === 'date fin') event.endDate = value
        else if (key === 'documents') event.attachments = parseAttachments(value)
      } else {
        descriptionLines.push(rawLine.trim())
      }
    }
    while (descriptionLines[0] === '') descriptionLines.shift()
    while (descriptionLines.at(-1) === '') descriptionLines.pop()
    event.description = descriptionLines.join('\n')
    events.push(event)
  }

  return events
}
