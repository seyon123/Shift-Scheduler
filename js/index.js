// Client ID and API key from the Developer Console
var CLIENT_ID = '983807328555-lqv3ohki0ddrjgod6snc4a8hla5q5n5p.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCI7cIe6iggtXnDi4-jzbr8yYLYi9h0HnM';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events";
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var clockinbutton = document.getElementById('clockin_button');
var breakinbutton = document.getElementById('breakin_button');
var breakoutbutton = document.getElementById('breakout_button');
var clockoutbutton = document.getElementById('clockout_button');
var starttime = '';
var endime = '';
var bstarttime = '';
var bendtime = '';



/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function (error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}
/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}
/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function (response) {
    var events = response.result.items;
    appendPre('Upcoming events:');
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.');
    }
  });
}

function getDate(){
  var date = new Date();
  return date.toISOString();

}

clockinbutton.style.display = "none";
breakinbutton.style.display = "none";
breakoutbutton.style.display = "none";
clockoutbutton.style.display = "none";


clockinbutton.onclick = function() {
  starttime = getDate();
  clockinbutton.style.display = "none";
  breakinbutton.style.display = "block";
  breakoutbutton.style.display = "none";
  clockoutbutton.style.display = "block";
};

breakinbutton.onclick = function() {
  bstarttime = getDate();
  breakinbutton.style.display = "none";
  breakoutbutton.style.display = "block";
  clockoutbutton.style.display = "none";
};

breakoutbutton.onclick = function() {
  bendtime = getDate();
  createBreakEvent();
  breakoutbutton.style.display = "none";
  breakinbutton.style.display = "block";
  clockoutbutton.style.display = "block";
};

clockoutbutton.onclick = function() {
  endtime = getDate();
  createWorkEvent();
  clockinbutton.style.display = "block";
  breakinbutton.style.display = "none";
  breakoutbutton.style.display = "none";
  clockoutbutton.style.display = "none";
};


function createWorkEvent() {

  var event = {
    'summary': 'WORK (Added By: seyonrajagopal.ca)',
    'start': {
      'dateTime': starttime,
    },
    'end': {
      'dateTime': endtime,
    },
    'reminders': {
      'useDefault': false,
    }
  };
  console.log(starttime);
  console.log(endtime);

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });
  

  request.execute(function (event) {
    if (event.status == 'confirmed') {
      alert("Event has been added successfully.");
      //<br>View it on <a href='" + event.htmlLink + "' target='_blank'>Google Calendar</a>
    } else {
      alert("Unfortunately, an error has occurred. Please try again / sign out and sign in again.");
    }
    console.log(event);
  });
}

function createBreakEvent() {

  var event = {
    'summary': 'BREAK (Added By: seyonrajagopal.me)',
    'start': {
      'dateTime': bstarttime,
    },
    'end': {
      'dateTime': bendtime,
    },
    'reminders': {
      'useDefault': false,
    }
  };
  console.log(bstarttime);
  console.log(bendtime);

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });
  

  request.execute(function (event) {
    if (event.status == 'confirmed') {
      
    } else {
      alert("Unfortunately, an error has occurred while adding the break. Please try again / sign out and sign in again.");
    }
    console.log(event);
  });
}