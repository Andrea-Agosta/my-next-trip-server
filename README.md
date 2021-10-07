# My Next Flight

Web application for searching the cheapest flight for a specific route.
The user can create an account and search a flight. 

## Technology Used

For this application, I used Node.js for the backend side with Express framework. 
For the authentication, I used the npm package Passport and for the database I used MongoDB.
The system has two jobs `"countriesCurrenciesUpdate"` and `"placesListUpdate"`.
the jobs use the npm package **cron**. The first job run the first day of each month, calls 
the API's service and save all the countries and currencies on DB, the second job run the second day 
of each month, call the API's service and save all the list of the airports on the DB.

### Installation:
After the `git clone` of the project cd in to project root folder.

Rename the file `.env-example` into `.env` and update the file with your data.

Run in a terminal
```bash
npm install
npm start
```
The application run on
```bash
http://localhost:2000
```

### Future Implementation
The user will have the possibility to save the flights, and choose to search flights without dates.
The application will check daily if the flight ticket change prices, or if the application finds a new flight
with the range price previously set form the user and send an email with the updated specifications.