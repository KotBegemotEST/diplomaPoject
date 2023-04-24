"use strict";

var _require = require('googleapis'),
    google = _require.google; // Авторизация с помощью OAuth 2.0


var auth = new google.auth.GoogleAuth({
  keyFile: 'key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
var sheets = google.sheets({
  version: 'v4',
  auth: auth
}); // Загрузка шаблонного файла

var templateId = '1uL2-sPp5Lvgn0h17_qxzw6kMcUafUcKN629WRBrU3w0';
sheets.spreadsheets.get({
  spreadsheetId: templateId
}).then(function (response) {
  var templateSheet = response.data.sheets[0].properties.title; // Создание копии шаблонного листа

  var newSheetName = 'New Sheet';
  return sheets.spreadsheets.sheets.copyTo({
    spreadsheetId: templateId,
    sheetId: 0,
    requestBody: {
      destinationSpreadsheetId: null,
      destinationSheetName: newSheetName
    }
  });
}).then(function (response) {
  var newSheetId = response.data.sheetId;
  var newSheetRange = 'A1:B2'; // Вставка данных в новый лист

  return sheets.spreadsheets.values.update({
    spreadsheetId: templateId,
    range: "".concat(newSheetName, "!").concat(newSheetRange),
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [['Новые данные', 'Другие данные'], ['Еще новые данные', 'Еще другие данные']]
    }
  });
}).then(function (response) {
  console.log('Новый файл создан');
})["catch"](function (error) {
  console.log(error.message);
});