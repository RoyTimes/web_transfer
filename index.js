var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'random_shit.json';

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  authorize(JSON.parse(content), listMajors);
});
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}
function listMajors(auth) {
  var sheets = google.sheets('v4');

  let request = {
  		auth: auth,
        spreadsheetId: "1C1aXGByJrdH_wU-2llqJTW3EK8JDJqbt0KuyjNSfISY",
        resource: {
        	valueInputOption: "USER_ENTERED",
            data: [{
                range: "test!A1:B3",
                values: [[1,2], [2,3], [3,4]]
        	}]
        }
    };

    sheets.spreadsheets.values.batchUpdate(request, (err, response) => {
       	
       	console.log(JSON.stringify(err, null, 2));
        console.log(JSON.stringify(response, null, 2));
    });
}


// // sheets.spreadsheets.values.get({
// //   auth: auth,
// //   spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
// //   range: 'Class Data!A2:E',
// // }, function(err, response) {
// //   if (err) {
// //     console.log('The API returned an error: ' + err);
// //     return;
// //   }
// //   var rows = response.values;
// //   if (rows.length == 0) {
// //     console.log('No data found.');
// //   } else {
// //     console.log('Name, Major:');
// //     for (var i = 0; i < rows.length; i++) {
// //       var row = rows[i];
// //       // Print columns A and E, which correspond to indices 0 and 4.
// //       console.log('%s, %s', row[0], row[4]);
// //     }
// //   }
// // });


// var google = require('googleapis');
// let request = {
//     spreadsheetId: "1C1aXGByJrdH_wU-2llqJTW3EK8JDJqbt0KuyjNSfISY",
//     resource: {
//         data: [{
//             range: "A1:B3",
//             data: [[1,2], [2,3], [3,4]],
//     }]},
//     auth: "AIzaSyDK02IjoVoyyrfsoOsk_U3arPCTQO3J1zI"
// };

// var sheets = google.sheets('v4');
// sheets.spreadsheets.values.batchUpdate(request, (err, response) => {
   	
//    	console.log(JSON.stringify(err, null, 2));
//     console.log(JSON.stringify(response, null, 2));
// });

