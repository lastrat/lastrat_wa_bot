const fs = require('fs');
const XLSX = require('xlsx');
const vCard = require('vcf');

// Sample data array
const dataArray = [
  ['Admin Otaku Gang 22', '+237697139738'],
  ['Admin Otaku Gang 23', '+237697223698'],
  ['Admin Otaku Gang 24', '+237697543773']
];

// Step 1: Write data to XLSX file
const ws = XLSX.utils.aoa_to_sheet(dataArray);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
XLSX.writeFile(wb, 'output.xlsx');

console.log('Data written to output.xlsx');

// Step 2: Convert to vCard format
const vCards = dataArray.map(entry => {
  const card = new vCard();
  card.add('fn', entry[0]);
  card.add('tel', entry[1]);
  return card.toString();
});

// Step 3: Save the vCards to a VCF file
fs.writeFileSync('output.vcf', vCards.join('\n'));

console.log('Conversion completed successfully. Output saved to output.vcf');