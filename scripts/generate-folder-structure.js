const fs = require('fs');
const path = require('path');

const IGNORED = ['node_modules', '.git', '.next', 'dist'];

function getSortedItems(dirPath) {
  const items = fs.readdirSync(dirPath).filter(item => !IGNORED.includes(item));
  const dirs = [];
  const files = [];

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) dirs.push(item);
    else files.push(item);
  });

  return [...dirs.sort(), ...files.sort()];
}

function printTree(dir, prefix = '', depth = 0, maxDepth = 10) {
  if (depth > maxDepth) return '';

  const items = getSortedItems(dir);
  let tree = '';

  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const isLast = index === items.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const isDir = stat.isDirectory();
    const emoji = isDir ? '📂 ' : '';
    const nextPrefix = prefix + (isLast ? '    ' : '│   ');

    tree += `${prefix}${connector}${emoji}${item}${isDir ? '/' : ''}\n`;

    if (isDir) {
      tree += printTree(fullPath, nextPrefix, depth + 1, maxDepth);
    }
  });

  return tree;
}

const rootDir = process.argv[2] || '.';
const result = `\`\`\`\n📂 프로젝트 루트/\n${printTree(rootDir, '│   ', 1)}\`\`\`\n`;
const outputPath = path.join(__dirname, '../docs/FOLDER_STRUCTURE.md');
fs.writeFileSync(outputPath, result);
console.log('✅ FOLDER_STRUCTURE.md 파일이 생성되었습니다!');
