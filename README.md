# Marvel Front End Test For Rex Software

Accessible at: http://faithful-theory.surge.sh/

## Setup

Steps to run

* navigate to root folder
* run "npm i"
* run "npm start"

Steps to host locally (to access with mobile device) Requires node v7.6 or above

* npm install -g local-web-server
* navigate to root folder
* run "npm i"
* run "npm run build"
* navigate to root/public folder
* run "ws --spa index.html"

## Functionality

* Allows user to Explore the marvel universe by either a character, comic, event or series
* Shows all the relationships that a given result has, formatted inside a tabbed layout
* Each unique entity has a detail page

### Features

* Responsive to mobile
* Searches API to give you drop down suggests after you finish typing
* Caches auto-suggestion searches to not over draw from API
* Each "tabbed section" has a slider controlling how many results to show, and a page number that are combined to produce the correct API request
* Caches Each "tabbed section"'s results to be more responsive on secondary viewing and to not over draw from API
* Each entity's unique detail page can be accessed directly via URL
* Responsive loading phases
