import fs from 'fs';

const EMPTY_EXPORT = 'export {};';
const PATH = './dist/content/content.js';

fs.readFile(PATH, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split('\n');
  const filteredLines = lines.filter((line) => line.trim() !== EMPTY_EXPORT);
  const newContent = filteredLines.join('\n');

  fs.writeFile(PATH, newContent, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Empty exports removed from ${PATH}`);
  });
});
