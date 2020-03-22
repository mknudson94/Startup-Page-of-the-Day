# Startup Page of the Day

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Dev Note
As chrome extensions must run off of a built react app, it can't be fully tested with `npm start`, so all calls to the global `chrome` object have been wrapped in a `process.env.NODE_ENV === 'production'` conditional. In this way, all front-end aspects can be tested with the traditonal `npm start`, while back-end processes rely on building the project

## TODO

* Change icon to MON, TUES, etc depending on day of week
* Allow update to days-of-week for preexisting pages
* Reset input validation after form submit
* Animation to transition submitted url to existing urls table
* Add different sized icons
    * Add Icon to extensions management page
* Correctly order days of the week from pages loaded from `chrome.storage`
* Add alert after successful form submission
* Add color to the page
