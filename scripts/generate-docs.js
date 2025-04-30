const fs = require('fs');
const path = require('path');

const swaggerPath = path.resolve(__dirname, '../swagger-spec.json');
const outputPath = path.resolve(__dirname, '../docs/api-summary.md');

if (!fs.existsSync(swaggerPath)) {
  console.error('❌ swagger-spec.json 파일이 존재하지 않습니다.');
  process.exit(1);
}

const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const output = [
  '# 📚 API 요약 목록\n',
  '[← README로 돌아가기](../README.md)\n',
];

const pathMap = new Map();

for (const [route, methods] of Object.entries(swagger.paths)) {
  for (const [method, config] of Object.entries(methods)) {
    const summary = config.summary || config.description || '(설명 없음)';
    const tag = config.tags?.[0] || '기타';
    const key = `${tag}:::${route}:::${summary}`;

    if (!pathMap.has(key)) pathMap.set(key, []);
    pathMap.get(key).push(method.toUpperCase());
  }
}

// 태그 기반 정렬
const grouped = {};
for (const [fullKey, methods] of pathMap.entries()) {
  const [tag, route, summary] = fullKey.split(':::');
  if (!grouped[tag]) grouped[tag] = [];
  grouped[tag].push({ route, methods, summary });
}

for (const [tag, routes] of Object.entries(grouped)) {
  output.push(`\n## 🔹 ${tag}\n`);
  routes.forEach(({ route, methods, summary }) => {
    output.push(`- \`${route}\` — [${methods.join(', ')}] — ${summary}`);
  });
}


fs.writeFileSync(outputPath, output.join('\n'), 'utf8');

console.log('✅ API 요약 목록이 api-summary.md 에 생성되었습니다.');
