const fs = require('fs');
const path = require('path');

function walk(dir, exts) {
  let size = 0;
  let lines = 0;
  if (!fs.existsSync(dir)) return { size, lines };
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === 'dist' || f === '.git' || f === 'public' || f.includes('.log')) continue;
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const res = walk(p, exts);
      size += res.size;
      lines += res.lines;
    } else {
      const ext = path.extname(f);
      if (exts.includes(ext)) {
        size += stat.size;
        lines += fs.readFileSync(p, 'utf8').split('\n').length;
      }
    }
  }
  return { size, lines };
}

const cpp = walk('.', ['.cpp', '.hpp', '.c', '.h']);
const ts = walk('.', ['.ts', '.tsx', '.js', '.jsx']);
const config = walk('.', ['.json', '.md', '.css', '.html']);

const totalLines = cpp.lines + ts.lines + config.lines;
console.log('Total Lines (Code + Config):', totalLines);
console.log('C++ Lines:', cpp.lines, '(', ((cpp.lines / totalLines) * 100).toFixed(2), '% )');
console.log('TS/React Lines:', ts.lines, '(', ((ts.lines / totalLines) * 100).toFixed(2), '% )');
console.log('Config/CSS Lines:', config.lines, '(', ((config.lines / totalLines) * 100).toFixed(2), '% )');
