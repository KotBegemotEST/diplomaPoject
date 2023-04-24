"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var mysql = require("mysql");

var cors = require("cors");

var functions = require('./functions');

var app = express();

var sheets = require('./sheets/index');

var bcrypt = require('bcrypt');

var excelGenerator = require('./sheets/excelGenerator/excelGenerator');

var ExcelJS = require('exceljs');

var config = require("./config");

app.use(express.json());
app.use(cors());
var db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "edufinance"
});
app.get("/getMentor", function (req, res) {
  var connection = mysql.createConnection(config.databaseOptions);
  connection.connect();
  connection.query("SELECT DISTINCT username, firstname, lastname, email, city FROM mdl_user JOIN mdl_role JOIN mdl_role_assignments on mdl_role_assignments.userid=mdl_user.id where roleid=3", function (error, results) {
    if (error) throw error;
    res.json(results);
  });
});
app.post("/getAllMentors", function (req, res) {
  var dateStart = functions.getCurrentMonthRange().startOfMonth;
  var dateEnd = functions.getCurrentMonthRange().endOfMonth;
  var connection = mysql.createConnection(config.databaseOptions);
  connection.connect();
  var sqlQuery = "SELECT mdl_user.firstname, mdl_user.lastname, mdl_user.city, mdl_user.email, COUNT(*) * 2.5 AS lesson_number\
    FROM mdl_attendance_log \
    INNER JOIN mdl_attendance_statuses ON mdl_attendance_statuses.id = mdl_attendance_log.statusid \
    INNER JOIN mdl_user ON mdl_user.id = mdl_attendance_log.studentid\
    INNER JOIN mdl_attendance_sessions ON mdl_attendance_sessions.id = mdl_attendance_log.sessionid \
    WHERE mdl_attendance_statuses.acronym = 'P'\
    AND mdl_attendance_sessions.sessdate < ? \
    AND mdl_attendance_sessions.sessdate > ?\
    AND mdl_user.id IN (\
        SELECT userid\
        FROM mdl_role_assignments\
        WHERE roleid = 3\
    )\
    GROUP BY mdl_user.firstname, mdl_user.lastname, mdl_user.city, mdl_user.email;";
  connection.query(sqlQuery, [dateEnd, dateStart], function (error, data) {
    if (error) {
      return res.status(500).json({
        error: error
      });
    }

    var formattedData = data.map(function (mentor) {
      return _objectSpread({}, mentor, {
        dateStart: functions.formatDate(dateStart),
        dateEnd: functions.formatDate(dateEnd)
      });
    });
    return res.status(200).json({
      data: formattedData
    });
  });
});
app.post('/saveMentor', function (req, res) {
  var connection = mysql.createConnection(config.databaseOptions);
  connection.connect();
  var dateStart = functions.getCurrentMonthRange().startOfMonth;
  var dateEnd = functions.getCurrentMonthRange().endOfMonth;
  var email = req.body.mentorEmail;
  var sqlQuery = "SELECT DISTINCT mdl_user.firstname, mdl_user.lastname, mdl_user.city, COUNT(*) * 2.5 AS lesson_number \
  FROM mdl_attendance_log \
  INNER JOIN mdl_attendance_statuses ON mdl_attendance_statuses.id = mdl_attendance_log.statusid \
  INNER JOIN mdl_user ON mdl_user.id = mdl_attendance_log.studentid \
  INNER JOIN mdl_attendance_sessions ON mdl_attendance_sessions.id = mdl_attendance_log.sessionid \
  WHERE mdl_user.email = ? AND mdl_attendance_statuses.acronym = 'P'\
  AND mdl_attendance_sessions.sessdate < ? \
  AND mdl_attendance_sessions.sessdate > ? ";
  connection.query(sqlQuery, [email, dateEnd, dateStart], function (err, data) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    data[0]["dateStart"] = functions.formatDate(dateStart);
    data[0]["dateEnd"] = functions.formatDate(dateEnd);
    return res.status(200).json({
      data: data
    });
  });
});
app.post('/saveMentorWithout', function (req, res) {
  var connection = mysql.createConnection(config.databaseOptions);
  connection.connect();
  var email = req.body.mentorEmail;
  var sqlQuery = "SELECT DISTINCT mdl_user.firstname, mdl_user.lastname, mdl_user.city FROM mdl_user WHERE mdl_user.email = ?";
  connection.query(sqlQuery, [email], function (err, data) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    return res.status(200).json({
      data: data
    });
  });
});
app.post("/encryptPass", function (req, res) {
  var query = "SELECT * FROM accounts";
  db.query(query, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    Object.keys(data).forEach(function (key) {
      var obj = data[key];
      Object.keys(obj).forEach(function (key2) {
        console.log(obj[key2]);

        if (key2 == "password") {
          if (obj[key2].startsWith("$2b$")) {
            console.log("skip - hash found...");
            return;
          }

          var updateQuery = "UPDATE accounts SET password = ? WHERE accountID = ?";
          var salt = bcrypt.genSaltSync(10);
          var hashedPass = bcrypt.hashSync(obj[key2], salt);
          db.query(updateQuery, [hashedPass, obj.accountID], function (err, result) {
            if (err) {
              console.log(err);
              return;
            }

            console.log("Password updated successfully");
          });
        }
      });
    });
  });
});
app.post("/hourlyRates/filterByCity", function (req, res) {
  var city = req.body.selectedCity;
  var connection = mysql.createConnection(config.databaseOptions);
  connection.connect();
  var sqlQuery = "SELECT DISTINCT username, firstname, lastname, email, city FROM mdl_user JOIN mdl_role JOIN mdl_role_assignments on mdl_role_assignments.userid=mdl_user.id where roleid=3 and mdl_user.city=?";
  connection.query(sqlQuery, [city], function (err, data) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    return res.status(200).json(data);
  });
});
app.post('/saveMentorPMS', function (req, res) {
  var _req$body$savedMentor = req.body.savedMentor,
      firstname = _req$body$savedMentor.firstname,
      lastname = _req$body$savedMentor.lastname,
      email = _req$body$savedMentor.email,
      city = _req$body$savedMentor.city,
      lesson_number = _req$body$savedMentor.lesson_number,
      dateStart = _req$body$savedMentor.dateStart,
      dateEnd = _req$body$savedMentor.dateEnd;
  var checkQuery = "SELECT COUNT(*) as count FROM workers WHERE workerEmail = ? AND (startDate >= ? AND endDate >= ?)";
  db.query(checkQuery, [email, dateStart, dateEnd], function (err, result) {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }

    var count = result[0].count;

    if (count > 0) {
      return res.status(200).json({
        exists: true
      });
    } else {
      var insertQuery = "INSERT INTO workers (firstName, lastName, workerEmail, city, teachingHours,fixedFee,hourlyRates,startDate,endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(insertQuery, [firstname, lastname, email, city, lesson_number, "0", "6", dateStart, dateEnd], function (err, data) {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }

        return res.status(200).json({
          data: data
        });
      });
    }
  });
});
app.post("/getExtra", function (req, res) {
  var query = "SELECT w.*, e.extraName, e.extraRate FROM workersextraactions w INNER JOIN extraactions e ON w.idextraActions = e.idextraActions WHERE w.firstname = ? AND w.lastname = ? AND MONTH(w.date) = ?";
  var _req$body = req.body,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName,
      date = _req$body.date;
  console.log(functions.formatDateYYMMDD(date));
  db.query(query, [firstName, lastName, date], function (err, data) {
    if (err) {
      return res.json(err);
    }

    return res.status(200).json({
      data: data
    });
  });
});
app.post("/getSheets", function (req, res) {
  var querySelect = "SELECT COUNT(*) AS count FROM workersextraactions WHERE firstname = ? AND lastname = ? AND MONTH(date) = MONTH(?)";
  var query = "INSERT INTO workersextraactions (idextraActions, date, extrahours, firstname, lastname) VALUES (?, ?, ?, ?, ?)";
  sheets.mentorsData.forEach(function (_ref) {
    var categoryID = _ref.categoryID,
        name = _ref.name,
        date = _ref.date,
        hours = _ref.hours;
    console.log(date);
    date = functions.formatDateYYMMDD(date);

    if (typeof categoryID === 'string') {
      db.query(querySelect, [name[0], name[1], date], function (err, results) {
        console.log("query: " + querySelect, name[0], name[1], date);

        if (err) {
          console.log(err);
          return;
        }

        var count = results[0].count;

        if (count > 0) {
          console.log("was found dublicate, skipping..");
        } else {
          db.query(query, [categoryID, date, hours, name[0], name[1]]);
        }
      });
    } else {
      var _loop = function _loop(key) {
        db.query(querySelect, [name[0], name[1], date], function (err, results) {
          if (err) {
            console.log(err);
            return;
          }

          var count = results[0].count;

          if (count > 0) {
            console.log("Duplicate record found, skipping...");
          } else {
            db.query(query, [key, date, categoryID[key], name[0], name[1]]);
          }
        });
      };

      for (var key in categoryID) {
        _loop(key);
      }
    }
  });
});
app.post("/hourlyRates/mentorFilter", function (req, res) {
  var _req$body2 = req.body,
      city = _req$body2.city,
      startDate = _req$body2.startDate,
      endDate = _req$body2.endDate,
      mentorName = _req$body2.mentorName;
  var query = "SELECT * FROM workers WHERE 1=1";
  var queryParams = [];

  if (req.body.params['city']) {
    query += " AND (city = ? OR city IS NULL)";
    ;
    queryParams.push(req.body.params['city']);
  }

  if (req.body.params['startDate'] && req.body.params['endDate']) {
    query += " AND startDate <= ? AND endDate <= ?";
    queryParams.push(req.body.params['startDate'], req.body.params['endDate']);
  } else if (req.body.params['startDate'] && !req.body.params['endDate']) {
    query += " AND startDate <= ?";
    queryParams.push(req.body.params['startDate']);
  } else if (!req.body.params['startDate'] && req.body.params['endDate']) {
    query += " AND endDate >= ?";
    queryParams.push(req.body.params['endDate']);
  }

  if (req.body.params['mentorName']) {
    var _req$body$params$ment = req.body.params['mentorName'].split(" "),
        _req$body$params$ment2 = _slicedToArray(_req$body$params$ment, 2),
        firstName = _req$body$params$ment2[0],
        lastName = _req$body$params$ment2[1];

    if (lastName) {
      query += " AND firstName REGEXP ? AND lastName REGEXP ?;";
      queryParams.push("^".concat(firstName, "|\\s").concat(firstName), "^".concat(lastName, "|\\s").concat(lastName));
    } else {
      query += " AND firstName REGEXP ?;";
      queryParams.push("^".concat(firstName, "|\\s").concat(firstName));
    }
  }

  db.query(query, queryParams, function (err, data) {
    if (err) return res.json(err);
    return res.status(200).json({
      data: data
    });
  });
});
app.get("", function (req, res) {
  res.json("helo this is the db");
});
app.get("/users", function (req, res) {
  var q = "SELECT * from accounts";
  db.query(q, function (err, data) {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/usersCreate", function (req, res) {
  var readyQuery = "INSERT INTO Accounts (`accountID`,`lastName`,`firstName`,`email`,`login`,`password`) VALUES (?)";
  var values = [req.body.accountID, req.body.lastName, req.body.firstName, req.body.email, req.body.login, req.body.password];
  db.query(readyQuery, [values], function (err, data) {
    if (err) return res.json(err);
    return res.json("account was added succesfuly");
  });
});
app.post("/deleteWorker", function (req, res) {
  var workerid = req.body.workerid;
  db.query("DELETE FROM workers WHERE workers.workerid = ?", [workerid], function (err, data) {
    if (err) return res.json(err);
    res.send("Account was deleted succesfuly");

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({
        message: "Wrong email"
      });
    }
  });
});
app.post("/saveWorkerInfo", function (req, res) {
  var _req$body3 = req.body,
      workerid = _req$body3.workerid,
      firstName = _req$body3.firstName,
      lastName = _req$body3.lastName,
      city = _req$body3.city,
      hours = _req$body3.hours,
      job_name = _req$body3.job_name,
      hourly_rates = _req$body3.hourly_rates,
      fixed_fee = _req$body3.fixed_fee;
  db.query("UPDATE workers SET firstName = ?, lastName = ?, city = ?, teachingHours = ?, hourlyRates = ?, fixedFee = ? WHERE workerid = ?", [firstName, lastName, city, hours, hourly_rates, fixed_fee, workerid], function (err, data) {
    if (err) return res.json(err);
    res.send("Saved succesfuly"); // return res.json("account was deleted succesfuly" + workerid)

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({
        message: "Wrong email"
      });
    }
  });
});
app.post("/extraRates", function (req, res) {
  db.query("SELECT * FROM extraactions", function (err, data) {
    if (err) return res.json(err);

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({
        message: "no data"
      });
    }
  });
});
app["delete"]("/deleteaction", function (req, res) {
  var idextraActions = req.body.idextraActions;
  db.query("DELETE FROM extraactions WHERE extraactions.idextraActions = ?", [idextraActions], function (err, data) {
    if (err) return res.json(err);

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({
        message: "no data"
      });
    }
  });
});
app.post("/updateaction", function (req, res) {
  var _req$body4 = req.body,
      id = _req$body4.id,
      name = _req$body4.name,
      rate = _req$body4.rate;
  db.query("UPDATE extraactions SET extraName = ?, extraRate = ? WHERE idextraActions = ?", [name, rate, id], function (err, data) {
    if (err) return res.json(err);

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({
        message: "no data"
      });
    }
  });
});
app.post("/getInfo", function (req, res) {
  var _req$body5 = req.body,
      id = _req$body5.id,
      name = _req$body5.name,
      rate = _req$body5.rate;
  var startDate = functions.getCurrentMonthRange().startOfMonth;
  var endDate = functions.getCurrentMonthRange().endOfMonth;
  startDate = functions.formatDate(startDate);
  endDate = functions.formatDate(endDate);
  db.query("SELECT * FROM edufinance.workers WHERE startDate >= ? AND endDate <= ?;", [startDate, endDate], function (err, data) {
    if (err) return res.json(err);

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send({
        message: "no data"
      });
    }
  });
});
app.post("/hourlyRates", function (req, res) {
  var startDate = functions.formatDate(functions.getCurrentMonthRange().startOfMonth);
  var readyQuery = "SELECT workers.*, workers.lastName, \
    IFNULL(SUM(workersextraactions.extrahours), 0) AS totalExtraHours\
    FROM workers\
    LEFT JOIN workersextraactions ON workers.firstName = workersextraactions.firstname \
    AND workers.lastName = workersextraactions.lastname AND MONTH(workers.startDate) = MONTH(workersextraactions.date)\
    GROUP BY workers.workerid";
  db.query(readyQuery, [startDate], function (err, data) {
    if (err) {
      res.send({
        err: err
      });
    }

    if (data.length > 0) {
      res.send({
        data: data
      });
    } else {
      res.send({
        message: "no workers"
      });
    }
  });
});
app.post("/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.query("SELECT * FROM Accounts WHERE login = ?", [username], function (err, result) {
    if (err) {
      console.log(err);
      res.send({
        err: err
      });
    }

    if (result.length > 0) {
      var user = result[0];
      var hashedPass = user.password;
      var match = bcrypt.compareSync(password, hashedPass);

      if (match) {
        res.send(user);
      } else {
        res.send({
          message: "Wrong password"
        });
      }
    } else {
      res.send({
        message: "User not found"
      });
    }
  });
});
app.post("/sendSalary", function (req, res) {
  var mentor = req.body.mentor;
  var firstName = mentor.firstName,
      lastName = mentor.lastName,
      startDate = mentor.startDate;
  var monthNumber = functions.getMonthNumber(functions.formatDateYYMMDD(startDate));
  db.query("SELECT w.*, e.extraName, e.extraRate \
      FROM workersextraactions w \
      INNER JOIN extraactions e ON w.idextraActions = e.idextraActions WHERE w.firstname = ? AND w.lastname = ? AND MONTH(w.date) = ?", [firstName, lastName, monthNumber], function (err, extraData) {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving extra data");
    }

    mentor.extraActions = extraData.map(function (_ref2) {
      var extraName = _ref2.extraName,
          extraRate = _ref2.extraRate,
          extrahours = _ref2.extrahours;
      return {
        extraName: extraName,
        extraRate: extraRate,
        extrahours: extrahours
      };
    });
    excelGenerator.generateExcel(mentor).then(function () {
      console.log("Excel file created successfully");
      res.status(200).send("Salary file generated successfully");
    })["catch"](function (error) {
      console.error(error);
      res.status(500).send("Error generating salary");
    });
  });
});
app.listen(8080, function () {
  console.log("was connected");
}); // const spawn = require('child_process').spawn;
// function startApp() {
//   const app = spawn('node', ['index.js']);
//   app.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
//   app.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });
//   app.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//     if (code !== 0) {
//       console.log('Restarting application...');
//       startApp();
//     }
//   });
// }
// startApp();