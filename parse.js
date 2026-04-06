const fs=require('fs');
const data = JSON.parse(fs.readFileSync('report/jscpd-report.json', 'utf8'));
const duplicates = data.duplicates || [];
console.log(`Found ${duplicates.length} clones.`);
duplicates.slice(0, 20).forEach((c, i) => console.log(`${i+1}. ${c.firstFile.name}:${c.firstFile.start} <-> ${c.secondFile.name}:${c.secondFile.start} (Lines: ${c.lines})`));
