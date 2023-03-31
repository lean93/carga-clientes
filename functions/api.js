var mysql = require('mysql');
const express = require('express')
const serverless=require('serverless-http')

const app = express()
const router=express.Router()
const port = 3000

var con = mysql.createConnection({
  host: 'bajxiy5yyw6kleyymvfx-mysql.services.clever-cloud.com',
  user: 'ul1exuvxruk0vuyn',
  password: 'B7xnthbak0mnHzwKdpRF',
  database: 'bajxiy5yyw6kleyymvfx'
});

String.prototype.formatKeys = function(keys) {
    return [keys].reduce((p,c) => p.replace(/%k/,c), this);
};
String.prototype.formatValues = function(values) {
    return [values].reduce((p,c) => p.replace(/%v/,"'"+ c.join("', '") + "'"), this);
};

var INSERT_SQL = "insert into %k (%k) value (%v);";
var SELECT_SQL = "select * from %k where 1=1 ";
var LIKE_SQL = "and %k like '%%k%'";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function getData(parametros, tabla){
    var sql = SELECT_SQL.formatKeys(tabla)
    var where=""
    for(key of Object.keys(parametros)){
        var temp = LIKE_SQL.formatKeys(key)
        var temp = temp.formatKeys(parametros[key])
        where += temp
    }
    var finalSql = sql + (where || "");
    var queryResult;
    console.log("Ejecutando", finalSql)
     con.query(finalSql, function (err, result) {
            if (err) throw err;
             queryResult = result;
        });

    await sleep(500);
    return  queryResult
}

const agregarData = (reqBody, tableName)=>{

    var sql = INSERT_SQL.formatKeys(tableName);
    var sql = sql.formatKeys(Object.keys(reqBody));
    var sql = sql.formatValues(Object.values(reqBody));

    console.log("Ejecutando", sql)
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
}

con.connect();


//*****Clientes*********
router.get('/clientes',async (req, res) => {
    var data = await getData(req.query, "Registro")
    res.send(data)
})

router.post('/agregar-cliente', (req, res) => {
    console.log('Got body:', req.body);
    agregarData(req.body, "Registro")
    res.sendStatus(200);
});

//************ Prestadores *******************
router.get('/prestadores',async (req, res) => {
    var data = await getData(req.query)
    console.log("get",data)
    res.send(data)
})

router.post('/agregar-prestador', (req, res) => {
    console.log('Got body:', req.body);
    añadirCliente(req.body)
    res.sendStatus(200);
});


//************ Hospitales *******************
router.get('/hospitales',async (req, res) => {
    var data = await getData(req.query)
    console.log("get",data)
    res.send(data)
})

router.post('/agregar-hospital', (req, res) => {
    console.log('Got body:', req.body);
    añadirCliente(req.body)
    res.sendStatus(200);
});

app.use(express.json())
app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)