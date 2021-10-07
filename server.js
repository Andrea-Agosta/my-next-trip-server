const app = require('./app');
const db = require("./db/index");

const PORT = process.env.PORT || 2000;

db.connect().then(() => {
    app.listen(PORT, () => {
        console.log('Listening on port: ' + PORT);
    });
});