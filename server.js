const mysql = require('mysql');
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

var bodyParser = require('body-parser');
var url = require('url');

var server = app.listen(8084, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

const conn = mysql.createConnection({
    host: "mysql.metropolia.fi",
    user: "jasmija",
    password: "jassumetropoliasql",
    database: "jasmija"
});

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

var util = require('util');
const res = require("express");
const query = util.promisify(conn.query).bind(conn);

app.get("/api/results", function (req, res) {
    console.log("Get values from database");
    var q = url.parse(req.url, true).query;
    var id = q.id;
    var string;

    var sql = "SELECT Arvostelut.id, Arvostelut.osoite, Arvostelut.kunto, Arvostelut.viihtyvyys, Arvostelut.kokonaisarvosana, Arvostelut.vapaasana"
        + " FROM Arvostelut"
        + " WHERE id= ?";

    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {
            const rows = await query(sql,[id]);
            string = JSON.stringify(rows);
            console.log(string);
            res.send(string);
        }
        catch (err) {
            console.log("Database error!"+ err);
        }
        finally {
            //conn.end();
        }
    })()
});