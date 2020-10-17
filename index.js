const http = require('http');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const cors = require('cors');

const app = express();
const oCorsOptions = {
  origin: ['https://chrisfrew.in'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// use the cors middleware
app.use(cors(oCorsOptions));

// static gzip serve
app.use("/", expressStaticGzip("./dist"));

// http server at port 8081
const server = http.createServer(app);
server.listen(9007);

