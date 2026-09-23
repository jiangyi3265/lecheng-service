import { writeFileSync } from 'node:fs'
import { hospitals } from '../data/medical.js'
import { approvedProjects, doctors, news, resources } from '../data/catalog.js'

const output = process.argv[2]
if (!output) throw new Error('Usage: node scripts/export-content-seed.mjs <output.sql>')
const groups = [
  ['hospital', hospitals], ['project', approvedProjects], ['resource', resources],
  ['news', news], ['doctor', doctors],
]
const hex = value => `CONVERT(0x${Buffer.from(String(value), 'utf8').toString('hex')} USING utf8mb4)`
const rows = groups.flatMap(([kind, entries]) => entries.map((entry, order) => {
  const payload = { ...entry, kindCode: kind, status: '1', sortOrder: order }
  return `INSERT IGNORE INTO lc_content(id,kind,title,payload,status,sort_order) VALUES (${hex(entry.id)},${hex(kind)},${hex(entry.title || entry.name)},${hex(JSON.stringify(payload))},'1',${order});`
}))
writeFileSync(output, ['-- Initial demonstration content; existing operator edits are never overwritten.', ...rows, ''].join('\n'))
