const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:\\Users\\mumer\\Downloads\\Copy of Supplier Performance Measurement (1).xlsx');
console.log(workbook.SheetNames);
