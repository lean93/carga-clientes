var mysql = require('mysql');
const express = require('express')

const app = express()
const port = 3000

var con = mysql.createConnection({
  host: "127.0.0.1",
  port: '3306',
  user: "root",
  password: ""
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

    await sleep(100);
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

con.connect(function(err) {
    if (err){
    throw err;  
    } 
  console.log("Connected!");

  con.query("use carga_cliente;", function (err, result) {
    if (err) throw err;
    console.log("Result: ", result);
  });
});

app.use(express.json())

//*****Clientes*********
app.get('/clientes',async (req, res) => {
    var data = await getData(req.query, "Registro")
    res.send(data)
})

app.post('/agregar-cliente', (req, res) => {
    console.log('Got body:', req.body);
    agregarData(req.body, "Registro")
    res.sendStatus(200);
});

//************ Prestadores *******************
app.get('/prestadores',async (req, res) => {
    var data = await getData(req.query)
    console.log("get",data)
    res.send(data)
})

app.post('/agregar-prestador', (req, res) => {
    console.log('Got body:', req.body);
    añadirCliente(req.body)
    res.sendStatus(200);
});


//************ Hospitales *******************
app.get('/hospitales',async (req, res) => {
    var data = await getData(req.query)
    console.log("get",data)
    res.send(data)
})

app.post('/agregar-hospital', (req, res) => {
    console.log('Got body:', req.body);
    añadirCliente(req.body)
    res.sendStatus(200);
});
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})