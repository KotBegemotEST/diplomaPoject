"use strict";

var ExcelJS = require('exceljs');

var path = require('path');

var functions = require('../../functions');

var generateExcel = function generateExcel(worker) {
  var newTable, worksheet, row, i;
  return regeneratorRuntime.async(function generateExcel$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("worker");
          console.log(worker);
          _context.prev = 2;
          newTable = new ExcelJS.Workbook();
          _context.next = 6;
          return regeneratorRuntime.awrap(newTable.xlsx.readFile(path.resolve(__dirname, './template_sheet.xlsx')));

        case 6:
          worksheet = newTable.getWorksheet('Sheet1');
          worksheet.getCell("F4").value = worker.firstName + " " + worker.lastName;
          worksheet.getCell("E7").value = functions.formatDateYYMMDD(worker.endDate);

          if (worker.teachingHours > 0) {
            worksheet.getCell("A12").value = "Programmeerimise õpetamine";
            worksheet.getCell("C12").value = parseFloat(worker.hourlyRates);
            worksheet.getCell("D12").value = parseFloat(worker.teachingHours);
          }

          row = 0;

          for (i = 0; i < worker.extraActions.length; i++) {
            row = 13 + i;
            worksheet.getCell("A" + row).value = worker.extraActions[i].extraName;
            worksheet.getCell("C" + row).value = worker.extraActions[i].extraRate;
            worksheet.getCell("D" + row).value = worker.extraActions[i].extrahours;
          }

          if (worker.fixedFee > 0) {
            worksheet.getCell("A" + row).value = "Fixed fee";
            worksheet.getCell("B" + row).value = " ";
            worksheet.getCell("C" + row).value = " ";
            worksheet.getCell("D" + row).value = " ";
            worksheet.getCell("E" + row).value = parseInt(worker.fixedFee);
          } else {
            worksheet.getCell('C17').value = {
              formula: "CONCATENATE(LEFT(A17,FIND(\"[[\",A17)+1),\"pay\",RIGHT(A17,LEN(A17)-(FIND(\"]]\",A17)-2)))"
            };
          }

          _context.next = 15;
          return regeneratorRuntime.awrap(newTable.xlsx.writeFile(path.resolve(__dirname, worker.firstName + "_" + worker.lastName + "_" + functions.getMonthNumber(worker.endDate) + '.xlsx')));

        case 15:
          console.log('Excel file created successfully from file');
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](2);
          console.error(_context.t0);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 18]]);
};

module.exports = {
  generateExcel: generateExcel
};