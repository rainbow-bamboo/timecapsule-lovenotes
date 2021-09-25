# Love Note Time Capsule
## Instructions
1. Write a note (or have someone write a note for you) in the text area
2. Bury the time capsule
3. In 777 minutes return to the website to view the note.

## Algorithm
There is a textarea for writing a note. When the "Bury Time Capsule" button is pressed, it saves the note and the current time to localstorage.

Then the view is changed to a timer.
On page load, if there is a note already stored, the view is changed to a timer with instructions for use.

In the timer view, we can provide a copy link which will copy a link to the page with the affirmation, a key, and the start-time encoded. We need to make page-load check for these query params and store them in localstorage if present, then set the url to be timecapsule.red.

After the timer is up, if enabled, show a notificiation.
Either way, reveal the note.

If the Leave another note button is pressed, clear the localstorage and switch to a view with the initial textarea and button.

## Technical Details
We're using localstorage for persistance. This allows the user to close the page, and re-open it at a later time without losing their note.

We're using the JS Notificaiton API (https://www.javascripttutorial.net/web-apis/javascript-notification/) for the notification. This is not a push notification because a push notification would require a server which adds cost and complexity. This will show up as a desktop notification, but will only work if the page is left open.

There are three sections, writing, timer and love-note. By default, sections are display:none.

There are four main functions, init, buryCapsule, currentTimer and clearNote.

init is run on page load, it checks localstorage and reveals the writing-section if there's no note, the timer-section if there's a note, but the *countdown is not complete*, and the love-note-section if there's a note and the *countdown is complete*.

buryCapsule is run on button press, it stores the note and the current time in localstorage -we can use seconds since epoch. Afterwards, it switches the view to the timer section.

currentTimer is run to calculate the current time remaining based on the time stored in localstorage. It's used by init in a loop to check if the countdown is complete.

clearNote is used to clear the note from localstorage, and change the view to the writing-section.


