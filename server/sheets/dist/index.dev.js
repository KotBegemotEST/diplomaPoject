"use strict";

var fs = require('fs').promises;

var path = require('path');

var process = require('process');

var _require = require('@google-cloud/local-auth'),
    authenticate = _require.authenticate;

var _require2 = require('googleapis'),
    google = _require2.google;

var functions = require('../functions'); // If modifying these scopes, delete token.json.


var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']; // The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

var TOKEN_PATH = path.join(process.cwd(), 'token.json');
var CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */

function loadSavedCredentialsIfExist() {
  var content, credentials;
  return regeneratorRuntime.async(function loadSavedCredentialsIfExist$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fs.readFile(TOKEN_PATH));

        case 3:
          content = _context.sent;
          credentials = JSON.parse(content);
          return _context.abrupt("return", google.auth.fromJSON(credentials));

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", null);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */


function saveCredentials(client) {
  var content, keys, key, payload;
  return regeneratorRuntime.async(function saveCredentials$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fs.readFile(CREDENTIALS_PATH));

        case 2:
          content = _context2.sent;
          keys = JSON.parse(content);
          key = keys.installed || keys.web;
          payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token
          });
          _context2.next = 8;
          return regeneratorRuntime.awrap(fs.writeFile(TOKEN_PATH, payload));

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function authorize() {
  var client;
  return regeneratorRuntime.async(function authorize$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(loadSavedCredentialsIfExist());

        case 2:
          client = _context3.sent;

          if (!client) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", client);

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH
          }));

        case 7:
          client = _context3.sent;

          if (!client.credentials) {
            _context3.next = 11;
            break;
          }

          _context3.next = 11;
          return regeneratorRuntime.awrap(saveCredentials(client));

        case 11:
          return _context3.abrupt("return", client);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
}
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */


function listMajors(auth) {
  var sheets, res, rows;
  return regeneratorRuntime.async(function listMajors$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sheets = google.sheets({
            version: 'v4',
            auth: auth
          });
          _context4.next = 3;
          return regeneratorRuntime.awrap(sheets.spreadsheets.values.get({
            spreadsheetId: '1NfXkiIO2G7M5drpHU-OQVMJY3AVUXsJ_2opfalFdvZo',
            range: 'A1:X'
          }));

        case 3:
          res = _context4.sent;
          rows = res.data.values;

          if (!(!rows || rows.length === 0)) {
            _context4.next = 8;
            break;
          }

          console.log('No data found.');
          return _context4.abrupt("return");

        case 8:
          return _context4.abrupt("return", rows);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}

var cities = ["Tartu", "Narva", "Kohtla-Järve", "Tallinn"];
var jobsType = ["Automatisation", "Bookkeeping", "Communication", "Community", "Curriculum", "Design", "Engineering", "Events", "Homework sending", "Individual Lesson", "Individual lesson with special needs", "Invoices", "Onboarding", "Schedule", "Social media", "Trial Lesson", "General"];
var mentorsData = [];
authorize().then(function _callee(auth) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(listMajors(auth));

        case 2:
          data = _context5.sent;
          data.splice(0, 1);
          data.forEach(function (el) {
            var mentorData = {};

            for (var i = 0; i < el.length; i++) {
              if (functions.isDate(el[i]) && i == 0) {
                mentorData.date = el[i].split(' ')[0];
              }

              if (cities.includes(el[i]) && i == 1) {
                mentorData.city = el[i];
              }

              if (i == 2 && el[i] != "") {
                mentorData.name = el[i].split(' ');
              } else if (i == 3 && el[i] != "") {
                mentorData.name = el[i].split(' ');
              } else if (i == 4 && el[i] != "") {
                mentorData.name = el[i].split(' ');
              } else if (i == 5 && el[i] != "") {
                mentorData.name = el[i].split(' ');
              }

              if (el.some(function (item) {
                return !isNaN(parseInt(item));
              })) {
                mentorData.hours = el[i];
              }

              if (i == 6) {
                var splitedCategory = el[i].split(","); // console.log("i: " + i + " mentor name: " + mentorData.name + " "  + splitedCategory)

                if (splitedCategory.length > 1) {
                  for (var j = 0; j <= splitedCategory.length; j++) {
                    mentorData.categoryID = {};

                    for (var _j = 0; _j < splitedCategory.length; _j++) {
                      var category = splitedCategory[_j].trim();

                      var shift = 6;
                      var col = parseInt(jobsType.indexOf(category)) + 1;

                      if (category === "Curriculum" && jobsType.includes(category)) {
                        mentorData.categoryID[1] = el[col + shift];
                      } else if (category === "Communication") {
                        mentorData.categoryID[2] = el[col + shift];
                      } else if (category === "Trial lesson") {
                        mentorData.categoryID[3] = el[col + shift];
                      } else if (category === "Social media") {
                        mentorData.categoryID[4] = el[col + shift];
                      } else if (category === "Invoices") {
                        mentorData.categoryID[5] = el[col + shift];
                      } else if (category === "Community") {
                        mentorData.categoryID[6] = el[col + shift];
                      } else if (category === "Onboarding") {
                        mentorData.categoryID[7] = el[col + shift];
                      } else if (category === "Individual Lesson") {
                        mentorData.categoryID[8] = el[col + shift];
                      } else if (category === "Engineering") {
                        mentorData.categoryID[9] = el[col + shift];
                      } else if (category === "Automation" || category === "Automatisation") {
                        mentorData.categoryID[10] = el[col + shift];
                      } else if (category === "Homework sending") {
                        mentorData.categoryID[11] = el[col + shift];
                      } else if (category === "Schedule") {
                        mentorData.categoryID[12] = el[col + shift];
                      } else if (category === "Individual lesson with special needs") {
                        mentorData.categoryID[13] = el[col + shift];
                      } else if (category === "Events") {
                        mentorData.categoryID[14] = el[col + shift];
                      } else if (category === "Bookkeeping") {
                        mentorData.categoryID[15] = el[col + shift];
                      } else if (category === "Design") {
                        mentorData.categoryID[16] = el[col + shift];
                      } else if (category === "General") {
                        mentorData.categoryID[17] = el[col + shift];
                      } else if (category === "Other") {
                        mentorData.categoryID[18] = el[col + shift];
                      }
                    }
                  }
                }
              }

              if (jobsType.includes(el[i])) {
                if (el[i] === "Curriculum") {
                  mentorData.categoryID = "1";
                } else if (el[i] === "Communication") {
                  mentorData.categoryID = "2";
                } else if (el[i] === "Trial lesson") {
                  mentorData.categoryID = "3";
                } else if (el[i] === "Social media") {
                  mentorData.categoryID = "4";
                } else if (el[i] === "Invoices") {
                  mentorData.categoryID = "5";
                } else if (el[i] === "Community") {
                  mentorData.categoryID = "6";
                } else if (el[i] === "Onboarding") {
                  mentorData.categoryID = "7";
                } else if (el[i] === "Individual Lesson") {
                  mentorData.categoryID = "8";
                } else if (el[i] === "Engineering") {
                  mentorData.categoryID = "9";
                } else if (el[i] === "Automation" || el[i] === "Automatisation") {
                  mentorData.categoryID = "10";
                } else if (el[i] === "Homework sending") {
                  mentorData.categoryID = "11";
                } else if (el[i] === "Schedule") {
                  mentorData.categoryID = "12";
                } else if (el[i] === "Individual lesson with special needs") {
                  mentorData.categoryID = "13";
                } else if (el[i] === "Events") {
                  mentorData.categoryID = "14";
                } else if (el[i] === "Bookkeeping") {
                  mentorData.categoryID = "15";
                } else if (el[i] === "Design") {
                  mentorData.categoryID = "16";
                } else if (el[i] === "General") {
                  mentorData.categoryID = "17";
                } else if (el[i] === "Other") {
                  mentorData.categoryID = "18";
                }
              }
            }

            mentorsData.push(mentorData);
          });
          console.log("mentorsData");
          console.log(mentorsData);
          return _context5.abrupt("return", mentorsData);

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
})["catch"](console.error);
module.exports = {
  authorize: authorize,
  listMajors: listMajors,
  cities: cities,
  jobsType: jobsType,
  mentorsData: mentorsData
};