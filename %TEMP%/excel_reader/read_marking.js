const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:\\Users\\mumer\\Downloads\\Copy of Supplier Performance Measurement (1).xlsx');
const data = xlsx.utils.sheet_to_json(workbook.Sheets['Marking Scheme'], { header: 1 });
data.forEach(row => {
    if (row.length > 0) {
        console.log(row.join(' | '));
    }
});
