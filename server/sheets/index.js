const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const functions = require('../functions');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}


async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1M4Mfkwg9fxwR-iaXtGjmwbLd3hDzxs_fWLhsqcg5tEs',
    range: 'A1:X',
  });
  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  return rows
}

cities = ["Tartu","Narva","Kohtla-Järve","Tallinn"]
jobsType = ["Automatisation",  "Bookkeeping",  "Communication",  "Community",  "Curriculum",  "Design",  "Engineering",  "Events",  "Homework sending",  "Individual Lesson",  "Individual lesson with special needs",  "Invoices",  "Onboarding",  "Schedule",  "Social media",  "Trial Lesson",  "General"]
const mentorsData = []
authorize().then(async (auth) => {
  const data = await listMajors(auth);
  data.splice(0,1);

  data.forEach(el => {

    const mentorData = {}
    for (let i = 0; i < el.length; i++) {
        if( functions.isDate(el[i]) && i == 0){
          mentorData.date = el[i].split(' ')[0]
        }
        if( cities.includes(el[i]) && i == 1){
          mentorData.city = el[i]
        }
        if(i == 2 && el[i] != ""){
          mentorData.name = el[i].split(' ')
        }
        else if(i == 3 && el[i] != ""){
          mentorData.name = el[i].split(' ')
        }
        else if(i == 4 && el[i] != ""){
          mentorData.name = el[i].split(' ')
        }
        else if(i == 5 && el[i] != "" ){
          mentorData.name = el[i].split(' ')
        }
        if (el.some(item => !isNaN(parseInt(item)))){
          mentorData.hours = el[i]
        }
        if ( i == 6 ){
          let splitedCategory = el[i].split(",")
          // console.log("i: " + i + " mentor name: " + mentorData.name + " "  + splitedCategory)
          if(splitedCategory.length>1){
            for(let j = 0; j <= splitedCategory.length;j++){
              mentorData.categoryID = {};
              for (let j = 0; j < splitedCategory.length; j++) {
                let category = splitedCategory[j].trim();
                let shift = 6
                let col = parseInt(jobsType.indexOf(category))+1
                if (category === "Curriculum" && jobsType.includes(category)) {
                  mentorData.categoryID[1] = el[col+shift];
                } else if (category === "Communication") {
                  mentorData.categoryID[2] = el[col+shift]
                } else if (category === "Trial lesson") {
                  mentorData.categoryID[3] = el[col+shift]
                } else if (category === "Social media") {
                  mentorData.categoryID[4] = el[col+shift]
                } else if (category === "Invoices") {
                  mentorData.categoryID[5] = el[col+shift]
                } else if (category === "Community") {
                  mentorData.categoryID[6] = el[col+shift]
                } else if (category === "Onboarding") {
                  mentorData.categoryID[7] = el[col+shift]
                } else if (category === "Individual Lesson") {
                  mentorData.categoryID[8] = el[col+shift]
                } else if (category === "Engineering") {
                  mentorData.categoryID[9] = el[col+shift]
                } else if (category === "Automation" || category === "Automatisation") {
                  mentorData.categoryID[10] = el[col+shift]
                } else if (category === "Homework sending") {
                  mentorData.categoryID[11] = el[col+shift]
                } else if (category === "Schedule") {
                  mentorData.categoryID[12] = el[col+shift]
                } else if (category === "Individual lesson with special needs") {
                  mentorData.categoryID[13] = el[col+shift]
                } else if (category === "Events") {
                  mentorData.categoryID[14] = el[col+shift]
                } else if (category === "Bookkeeping") {
                  mentorData.categoryID[15] = el[col+shift]
                } else if (category === "Design") {
                  mentorData.categoryID[16] = el[col+shift]
                } else if (category === "General") {
                  mentorData.categoryID[17] = el[col+shift]
                } else if (category === "Other") {
                  mentorData.categoryID[18] = el[col+shift]
                }
              }
            }
          }
        }
        if(jobsType.includes(el[i])){
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
    mentorsData.push(mentorData)

  });
  console.log(mentorsData)
  return mentorsData

}).catch(console.error);


module.exports = { authorize, listMajors, cities, jobsType, mentorsData};


