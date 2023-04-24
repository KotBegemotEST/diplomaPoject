"use strict";

var ExcelJS = require('exceljs');

var path = require('path');

var functions = require('../../functions');

var generateExcel = function generateExcel(worker) {
  var newTable, worksheet, i;
  return regeneratorRuntime.async(function generateExcel$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(worker);
          _context.prev = 1;
          newTable = new ExcelJS.Workbook();
          _context.next = 5;
          return regeneratorRuntime.awrap(newTable.xlsx.readFile(path.resolve(__dirname, './template_sheet.xlsx')));

        case 5:
          worksheet = newTable.getWorksheet('Sheet1');
          worksheet.getCell("F4").value = worker.firstName + " " + worker.lastName;
          worksheet.getCell("E7").value = functions.formatDateYYMMDD(worker.endDate);

          if (worker.teachingHours > 0) {
            worksheet.getCell("A12").value = "Programmeerimise õpetamine";
            worksheet.getCell("C12").value = parseFloat(worker.hourlyRates);
            worksheet.getCell("D12").value = parseFloat(worker.teachingHours);
          }

          for (i = 0; i < worker.extraActions.length; i++) {
            worksheet.getCell("A" + (13 + i)).value = worker.extraActions[i].extraName;
            worksheet.getCell("C" + (13 + i)).value = worker.extraActions[i].extraRate;
            worksheet.getCell("D" + (13 + i)).value = worker.extraActions[i].extrahours;
          }

          worksheet.getCell('C17').value = {
            formula: "CONCATENATE(LEFT(A17,FIND(\"[[\",A17)+1),\"pay\",RIGHT(A17,LEN(A17)-(FIND(\"]]\",A17)-2)))"
          };
          _context.next = 13;
          return regeneratorRuntime.awrap(newTable.xlsx.writeFile(path.resolve(__dirname, worker.firstName + "_" + worker.lastName + "_" + functions.getMonthNumber(worker.endDate) + '.xlsx')));

        case 13:
          console.log('Excel file created successfully');
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

module.exports = {
  generateExcel: generateExcel
};