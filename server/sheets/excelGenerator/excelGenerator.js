const ExcelJS = require('exceljs');
const path = require('path');
const functions = require('../../functions');

const generateExcel = async (worker) => {
  console.log("worker")
  console.log(worker)
  try {
    const newTable = new ExcelJS.Workbook();
    await newTable.xlsx.readFile(path.resolve(__dirname, './template_sheet.xlsx'));
    const worksheet = newTable.getWorksheet('Sheet1');
    worksheet.getCell("F4").value = worker.firstName +  " " + worker.lastName;
    worksheet.getCell("E7").value = functions.formatDateYYMMDD(worker.endDate);
    if (worker.teachingHours>0){
      worksheet.getCell("A12").value = "Programmeerimise õpetamine";
      worksheet.getCell("C12").value = parseFloat(worker.hourlyRates);
      worksheet.getCell("D12").value = parseFloat(worker.teachingHours);
    }
    let row = 0
    for(let i = 0; i<worker.extraActions.length;i++){
      row = 13+i
      worksheet.getCell("A"+ (row)).value = worker.extraActions[i].extraName;
      worksheet.getCell("C"+ (row)).value = worker.extraActions[i].extraRate;
      worksheet.getCell("D"+ (row)).value = worker.extraActions[i].extrahours;

    }
    if (worker.fixedFee > 0){
      worksheet.getCell("A"+row).value = "Fixed fee";
      worksheet.getCell("B"+row).value = " ";
      worksheet.getCell("C" + row).value = " ";
      worksheet.getCell("D"+ row).value = " ";
      worksheet.getCell("E"+ row).value = parseInt(worker.fixedFee);
    }else{
      worksheet.getCell('C17').value = {
        formula: `CONCATENATE(LEFT(A17,FIND("[[",A17)+1),"pay",RIGHT(A17,LEN(A17)-(FIND("]]",A17)-2)))`
      };
    }


    await newTable.xlsx.writeFile(path.resolve(__dirname, worker.firstName + "_" + worker.lastName + "_" + functions.getMonthNumber(worker.endDate) +'.xlsx'));

    console.log('Excel file created successfully from file');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { generateExcel };