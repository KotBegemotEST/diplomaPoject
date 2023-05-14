const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const functions = require('./functions');
const app = express(); 
const sheets = require('./sheets/index');
const bcrypt = require('bcrypt');
const excelGenerator = require('./sheets/excelGenerator/excelGenerator');
const ExcelJS = require('exceljs');

const config = require("./config");
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "edufinance", 
})


app.get("/getMentor", (req, res) => {
    const connection = mysql.createConnection(config.databaseOptions);
    connection.connect();
    connection.query("SELECT DISTINCT username, firstname, lastname, email, city FROM mdl_user JOIN mdl_role JOIN mdl_role_assignments on mdl_role_assignments.userid=mdl_user.id where roleid=3", (error, results) => {
        if (error) throw error;
        res.send(results);
    });
})


app.post("/getAllMentors", (req, res) => {
    let dateStart = functions.getCurrentMonthRange().startOfMonth
    let dateEnd = functions.getCurrentMonthRange().endOfMonth
    const connection = mysql.createConnection(config.databaseOptions);
    connection.connect();
    const sqlQuery =
    "SELECT mdl_user.firstname, mdl_user.lastname, mdl_user.city, mdl_user.email, COUNT(*) * 2.5 AS lesson_number\
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
    GROUP BY mdl_user.firstname, mdl_user.lastname, mdl_user.city, mdl_user.email;"
    connection.query(sqlQuery,[dateEnd, dateStart], (error, data) => {
        if (error) {
            return res.send({error });
          }
          const formattedData = data.map((mentor) => ({
            ...mentor,
            dateStart: functions.formatDate(dateStart),
            dateEnd: functions.formatDate(dateEnd),
          }));
          return res.send({data:formattedData});
    });
})




app.post('/saveMentor', (req, res) => {
    const connection = mysql.createConnection(config.databaseOptions);
    connection.connect();

    let dateStart = functions.getCurrentMonthRange().startOfMonth
    let dateEnd = functions.getCurrentMonthRange().endOfMonth
    
    const { mentorEmail: email } = req.body;
    if(email == null){
      return res.send({error: "Account wasn`t found"})
    }
    const sqlQuery =
    "SELECT mdl_user.firstname, mdl_user.lastname, mdl_user.city, COUNT(*) * 2.5 AS lesson_number\
    FROM mdl_attendance_log\
    INNER JOIN mdl_attendance_statuses ON mdl_attendance_statuses.id = mdl_attendance_log.statusid\
    INNER JOIN mdl_user ON mdl_user.id = mdl_attendance_log.studentid\
    INNER JOIN mdl_attendance_sessions ON mdl_attendance_sessions.id = mdl_attendance_log.sessionid\
    WHERE mdl_user.email = ? AND mdl_attendance_statuses.acronym = 'P'\
    AND mdl_attendance_sessions.sessdate < ?\
    AND mdl_attendance_sessions.sessdate > ?\
    GROUP BY mdl_user.firstname, mdl_user.lastname, mdl_user.city, mdl_user.email";

  connection.query(sqlQuery, [email, dateEnd, dateStart], (err, data) => {
        if (err) {
          return res.send({err });

        }
        data[0]["dateStart"] = functions.formatDate(dateStart)
        data[0]["dateEnd"] = functions.formatDate(dateEnd)
        return res.send({data});
      });
});



app.post('/saveMentorWithout', (req, res) => {
    const connection = mysql.createConnection(config.databaseOptions);
    connection.connect();

    const { mentorEmail: email } = req.body;
    const sqlQuery =
    "SELECT DISTINCT mdl_user.firstname, mdl_user.lastname, mdl_user.city FROM mdl_user WHERE mdl_user.email = ?";

  connection.query(sqlQuery, [email], (err, data) => {
        if (err) {
          return res.send({err });
        }
        return res.send({data});
      });
});

app.post("/getMonthInfo",(req,res)=>{
    const query = "SELECT DISTINCT endDate FROM workers";
db.query(query,(err,data)=>{
    if (err) {
        return res.send({ error: err });
        }
        return res.send( data);
    })
})


app.post("/encryptPass",(req,res)=>{
    const query = "SELECT * FROM accounts"
    db.query(query,(err,data)=>{
        if (err) {
            console.log(err);
            return
          }
        Object.keys(data).forEach((key) => {
            let obj = data[key]
            Object.keys(obj).forEach((key2) => {
                console.log(obj[key2])
                if (key2=="password"){
                    if(obj[key2].startsWith("$2b$")){
                        console.log("skip - hash found...")
                        return
                    }
                    const updateQuery = "UPDATE accounts SET password = ? WHERE accountID = ?";
                    let salt = bcrypt.genSaltSync(10);
                    let hashedPass = bcrypt.hashSync(obj[key2], salt)
                    db.query(updateQuery, [hashedPass, obj.accountID], (err,result)=>{
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log("Password updated successfully");

                    })
                }    

            })
        });
    })

})

app.post("/hourlyRates/filterByCity",(req,res)=>{
    const { selectedCity: city } = req.body;
    const connection = mysql.createConnection(config.databaseOptions);
    connection.connect();
    const sqlQuery =
    "SELECT DISTINCT username, firstname, lastname, email, city FROM mdl_user JOIN mdl_role JOIN mdl_role_assignments on mdl_role_assignments.userid=mdl_user.id where roleid=3 and mdl_user.city=?";
  connection.query(sqlQuery, [city], (err, data) => {
        if (err) {
          return res.send({err });
        }
        return res.send(data);
      });
})

app.post('/saveMentorPMS', (req, res) => {
    const { firstname, lastname, email, city, lesson_number, dateStart, dateEnd } = req.body.savedMentor;
    const checkQuery = "SELECT COUNT(*) as count FROM workers WHERE workerEmail = ? AND (startDate >= ? AND endDate >= ?)";
    db.query(checkQuery, [email, dateStart, dateEnd ], (err, result) => {
      if (err) {
        return res.send({ error: err });
      }
  
      const count = result[0].count;
      if (count > 0) {
        return res.send({ exists: true });
      } else {
        const insertQuery = "INSERT INTO workers (firstName, lastName, workerEmail, city, teachingHours,fixedFee,hourlyRates,startDate,endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(insertQuery, [firstname, lastname, email, city, lesson_number, "0", "6", dateStart, dateEnd], (err, data) => {
          if (err) {
            return res.send({ error: err });
          }
          return res.send({ data });
        });
      }
    });
  });

  app.post("/getExtra", (req, res) => {
    let query = "SELECT w.*, e.extraName, e.extraRate FROM workersextraactions w INNER JOIN extraactions e ON w.idextraActions = e.idextraActions WHERE w.firstname = ? AND w.lastname = ? AND MONTH(w.date) = ?";
    const { firstName, lastName, date } = req.body;
    console.log(functions.formatDateYYMMDD(date))
    db.query(query, [firstName, lastName,  date], (err, data) => {
      if (err) {
        return res.send(err);
      }
      return res.send({ data });
    });
  });

app.post("/getSheets", (req, res) => {
    let querySelect = "SELECT COUNT(*) AS count FROM workersextraactions WHERE firstname = ? AND lastname = ? AND MONTH(date) = MONTH(?)";
    let query = "INSERT INTO workersextraactions (idextraActions, date, extrahours, firstname, lastname) VALUES (?, ?, ?, ?, ?)";
    sheets.mentorsData.forEach(({ categoryID, name, date, hours }) => {
        date = functions.formatDateYYMMDD(date)
        if(typeof categoryID === 'string') {
            db.query(querySelect, [name[0], name[1], date], (err, results) => {
                console.log("query: " + querySelect,name[0], name[1], date)
                if (err) {
                    console.log(err);
                    return;
                }
                const count = results[0].count;
                if (count > 0) {
                    console.log("was found dublicate, skipping..")
                }else{
                    db.query(query, [categoryID, date, hours, name[0], name[1]]);
                }
            })
            } else {
            for(let key in categoryID) {
                db.query(querySelect, [name[0], name[1], date], (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                        }
                        const count = results[0].count;
                        if (count > 0) {
                        console.log("Duplicate record found, skipping...");
                        } else {
                        db.query(query, [key, date, categoryID[key], name[0], name[1]]);
                        }
                })
            }
            }
        });
})


app.post("/hourlyRates/mentorFilter",(req,res)=>{
    const { city: city, startDate:startDate, endDate:endDate, mentorName:mentorName } = req.body;
    let query = "SELECT * FROM workers WHERE 1=1";
    let queryParams = []
    if (req.body.params['city']) {
        query +=  " AND (city = ? OR city IS NULL)";;
        queryParams.push(req.body.params['city']);
    }

    if (req.body.params['startDate'] && req.body.params['endDate']) {
        query += " AND startDate >= ? AND endDate >= ?";
        queryParams.push(req.body.params['startDate'],req.body.params['endDate']);
    }else if(req.body.params['startDate'] && !req.body.params['endDate']){
        query += " AND startDate >= ?";
        queryParams.push(req.body.params['startDate'])
    }else if(!req.body.params['startDate'] && req.body.params['endDate']){
        query += " AND endDate <= ?";
        queryParams.push(req.body.params['endDate']);
    }
    
    if (req.body.params['mentorName']) {
        const [firstName, lastName] = req.body.params['mentorName'].split(" ");
        if (lastName) {
            query += " AND firstName REGEXP ? AND lastName REGEXP ?;";
            queryParams.push(`^${firstName}|\\s${firstName}`, `^${lastName}|\\s${lastName}`);
        } else {
            query += " AND firstName REGEXP ?;";
            queryParams.push(`^${firstName}|\\s${firstName}`);
        } 
    }

    db.query(query, queryParams, (err, data) => {
        if (err) return res.send(err);
        return res.send({ data });
    });
})

app.get("", (req, res) => {
    res.send("helo this is the db")
})

app.get("/users", (req, res) => {
    const q = "SELECT * from accounts"
    db.query(q, (err, data) => {
        if (err) return res.send(err)
        return res.send(data)
    })
})

app.post("/getInfoFor", async (req, res) => {
  const monthNum = req.body.month;
  const readyQuery =
    "SELECT workerid, firstName, lastName, workerEmail, city, teachingHours, fixedFee, hourlyRates, startDate, endDate FROM workers w WHERE MONTH(w.startDate) = ?";
  const readyQuery2 =
    "SELECT SUM(workersextraactions.extrahours * extraactions.extraRate) AS totalCost FROM workersextraactions JOIN extraactions ON workersextraactions.idextraActions = extraactions.idextraActions WHERE MONTH(date) = ?";

  console.log("monthNum " + monthNum);
  let extraSalary = 0;
  let usualSalary = 0;
  let fixedFeeSalary = 0;
  let salaryes = {};

  const [data, data2] = await Promise.all([
    new Promise((resolve, reject) => {
      db.query(readyQuery, [monthNum], (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.logdata;
          resolve(data);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(readyQuery2, [monthNum], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }),
  ]);

  for (let i = 0; i < data.length; i++) {
    let hourlyRate = parseFloat(data[i].hourlyRates);
    let teachingHours = parseFloat(data[i].teachingHours);
    let fixedFee = parseFloat(data[i].fixedFee);
    let cost = hourlyRate * teachingHours;
    usualSalary += cost;
    if (fixedFee > 0) {
      fixedFeeSalary += fixedFee;
    }
  }

  extraSalary = data2[0].totalCost;

  salaryes.usualSalary = usualSalary + fixedFeeSalary;
  salaryes.extraSalary = extraSalary;

  console.log(salaryes);
  res.send({ message: salaryes });
});

app.post("/usersCreate", (req, res) => {
    const readyQuery = "INSERT INTO Accounts (`accountID`,`lastName`,`firstName`,`email`,`login`,`password`) VALUES (?)";
    const values = [
        req.body.accountID,
        req.body.lastName,
        req.body.firstName,
        req.body.email,
        req.body.login,
        req.body.password,
    ]


    db.query(readyQuery, [values], (err, data) => {
        if (err) return res.send(err)
        return res.send("account was added succesfuly")
    })
})


app.post("/deleteWorker", (req, res) => {
  const workerid = req.body.workerid;
  db.query("DELETE workers, workersextraactions FROM workers LEFT JOIN workersextraactions ON workers.firstName = workersextraactions.firstName AND workers.lastName = workersextraactions.lastName WHERE workers.workerid = ?", [workerid], (err, data) => {
      if (err) return res.send(err);
      res.send("Account was deleted successfully");
  });
});

app.post("/saveWorkerInfo", (req, res) => {
    const { workerid, firstName, lastName,city,hours,job_name,hourly_rates,fixed_fee } = req.body;
    db.query("UPDATE workers SET firstName = ?, lastName = ?, city = ?, teachingHours = ?, hourlyRates = ?, fixedFee = ? WHERE workerid = ?", [firstName,lastName,city,hours,hourly_rates,fixed_fee,workerid], (err, data) => {
        if (err) return res.send(err)
                res.send("Saved succesfuly")
            //     // return res.json("account was deleted succesfuly" + workerid)
            // if (data.length > 0) {
            //     res.send(data)
            // } else {
            //     res.send( "Something Wrong" )
            // }
    })
})

app.post("/extraRates",(req,res)=>{
    db.query("SELECT * FROM extraactions", (err, data) => {
        if (err) return res.send(err)
        if (data.length > 0) {
            res.send(data)
        } else {
            res.send({ message: "no data" })
        }
    })
})

app.post("/deleteaction",(req,res)=>{
    const idextraActions = req.body.idextraActions
    console.log(idextraActions)
    db.query("DELETE FROM extraactions WHERE extraactions.idextraActions = ?",[idextraActions], (err, data) => {
        if (err) return res.send(err)
        if (data.length > 0) {
            res.send(data)
        } else {
            res.send({ message: "no data" })
        }
    })
})

app.post("/updateaction",(req,res)=>{
    const { id, name, rate } = req.body;
    db.query("UPDATE extraactions SET extraName = ?, extraRate = ? WHERE idextraActions = ?", [name, rate, id], (err, data) => {
        if (err) return res.send(err)
        if (data.length > 0) {  
            res.send(data)
        } else {
            res.send({ message: "no data" })
        }
    })
})

app.post("/getInfo", (req, res) => {
    const { id, name, rate} = req.body;
    let startDate = functions.getCurrentMonthRange().startOfMonth
    let endDate = functions.getCurrentMonthRange().endOfMonth
    startDate = functions.formatDate(startDate)
    endDate= functions.formatDate(endDate)
    db.query(
      "SELECT * FROM edufinance.workers WHERE startDate >= ? AND endDate <= ?;",
      [startDate, endDate],
      (err, data) => {
        if (err) return res.send(err);
        if (data.length > 0) {
          res.send(data);
        } else {
          res.send({ message: "no data" });
        }
      }
    );
  });

app.post("/hourlyRates", (req, res) => {
    let startDate =  functions.formatDate(functions.getCurrentMonthRange().startOfMonth)
    const readyQuery = "SELECT workers.*, workers.lastName, \
    IFNULL(SUM(workersextraactions.extrahours), 0) AS totalExtraHours\
    FROM workers\
    LEFT JOIN workersextraactions ON workers.firstName = workersextraactions.firstname \
    AND workers.lastName = workersextraactions.lastname AND MONTH(workers.startDate) = MONTH(workersextraactions.date)\
    GROUP BY workers.workerid";
    db.query(readyQuery, [startDate] , (err, data) => {
        if (err) {
            res.send({ err: err })
        }
        if (data.length > 0) {
            res.send({data})
        } else {
            res.send({ message: "no workers" })
        }
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query(
        "SELECT * FROM Accounts WHERE login = ?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result.length > 0) {
                let user = result[0];
                const hashedPass = user.password;
                const match = bcrypt.compareSync(password, hashedPass);
                if (match) {
                    res.send(user);
                } else {
                    res.send({ message: "Wrong password" });
                }
            } else {
                res.send({ message: "User not found" });
            }

        }
    );
})


app.post("/sendSalary", (req, res) => {
    const mentor = req.body.mentor;
    const { firstName, lastName, startDate} = mentor;
    const monthNumber = parseInt(functions.getMonthNumber(functions.formatDateYYMMDD(startDate)))+1
    db.query(
      "SELECT w.*, e.extraName, e.extraRate \
      FROM workersextraactions w \
      INNER JOIN extraactions e ON w.idextraActions = e.idextraActions WHERE w.firstname = ? AND w.lastname = ? AND MONTH(w.date) = ?",
      [firstName, lastName, monthNumber],
      (err, extraData) => {
        console.error("extraData: " + JSON.stringify(extraData));
        if (err) {
          console.error(err);
          return res.send("Error retrieving extra data");
        }
        mentor.extraActions = extraData.map(({extraName, extraRate, extrahours}) => ({extraName, extraRate, extrahours}));
        excelGenerator.generateExcel(mentor)
          .then(() => {
            console.log("Excel file created successfully");
            res.send("Salary file generated successfully");
          })
          .catch((error) => {
            console.error(error);
            res.send("Error generating salary");
          });
      }
    )
  });


app.listen(8080, () => {
    console.log("was connected")
})
