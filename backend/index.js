const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");
const FormData = require("form-data");

const request = require("request");

const axios = require("axios");
const authenticateToken = require("./configs/auth");

dotenv.config();
const port = process.env.VUE_APP_BACKEND_PORT;

// Set Parses JSON
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Option, Authorization"
  );
  next();
});
// enable files upload
app.use(
  fileUpload({
    createParentPath: true
  })
);

// enable middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res, next) => {
  res.json({ message: "I am OK." });
});
// Import passport
require("./configs/passport");

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/users"));
app.use("/process", require("./routes/process"));
app.use("/form", require("./routes/form"));
app.use("/list", require("./routes/list"));
app.use("/check", require("./routes/check"));
app.use("/audit", require("./routes/audit"));
app.use("/dms", require("./routes/file"));

// upload file or create folder (alfresco)
app.post("/nodes/:id/children", authenticateToken, async (req, res) => {
  let file = "";
  const ticket = req.user.ticket;
  if (req.files) {
    file = req.files.filedata;
    var form = new FormData();
    form.append("filedata", file.data, {
      contentType: file.mimetype,
      filename: req.body.name || file.name
    });
    const response = await axios({
      method: "POST",
      url: `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${req.params.id}/children`,
      params: { alf_ticket: ticket },
      data: form,
      headers: { "Content-Type": "multipart/form-data", ...form.getHeaders() }
    });

    res.status(response.status).send(response.data.entry);
  } else {
    const response = await axios({
      method: "post",
      url: `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${req.params.id}/children`,
      data: req.body,
      params: { alf_ticket: ticket }
    });
    res.status(response.status).send(response.data.entry);
  }
});

// delete node
app.delete("/nodes/:id/:ticket", async (req, res) => {
  console.log(req.user)
  const ticket = req.params.ticket;
  axios({
    method: "delete",
    url: `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${req.params.id}`,
    params: { alf_ticket: ticket }
  }).then(() => {
    res.status(204).send({ message: "Remove Successful" });
  }).catch((err) => {
    console.log(err)
  })
});

// preview file
app.get("/nodes/:id/content/:ticket", async (req, res) => {
  const ticket = req.params.ticket;
  request({
    method: "get",
    url: `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${req.params.id}/content`,
    qs: { alf_ticket: ticket }
  }).pipe(res);
});

// get node child
app.post("/nodes/:id/view", authenticateToken, async (req, res) => {
  const ticket = req.user.ticket;
  var headers = {};
  if (req.headers.hasOwnProperty("authorization")) {
    headers.authorization = req.headers.authorization;
  }
  const maxItems = 1000;
  var skipCount = 0;
  var hasMoreItems = false;
  var list = [];
  var total = 0;

  do {
    var query = {
      maxItems,
      skipCount,
      alf_ticket: ticket,
      include: 'properties'
    };
    const response = await axios({
      method: "get",
      url: `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${req.params.id}/children`,
      params: query
    });

    list.push(...response.data.list.entries.map(item => item.entry));

    skipCount += maxItems;
    hasMoreItems = response.data.list.pagination.hasMoreItems;

    if (!hasMoreItems) {
      total = response.data.list.pagination.totalItems;
    }
  } while (hasMoreItems);

  res.status(200).send({ total, list });
});

// get node
app.get("/nodes/:id", authenticateToken, async (req, res) => {
  const ticket = req.user.ticket;
  axios({
    method: "get",
    url: `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${req.params.id}`,
    params: { alf_ticket: ticket }
  }).then(response => {
    res.status(response.status).send(response.data.entry);
  });
});

// update node
app.put("/nodes/:id", authenticateToken, async (req, res) => {
  const ticket = req.user.ticket;
  axios({
    method: "put",
    url: `${process.env.VUE_APP_ALFRESCO_API}alfresco/versions/1/nodes/${req.params.id}`,
    params: { alf_ticket: ticket },
    data: req.body
  }).then(response => {
    res.status(response.status).send(response.data.entry);
  }).catch((err) => {
    console.log(err)
  })
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message: err.message
    }
  });
});

// Start Server HTTPS
// https.createServer({
//   key: fs.readFileSync(__dirname + '/rtarf.key'),
//   cert: fs.readFileSync(__dirname + '/rtarf.crt')
// }, app)
// .listen(process.env.VUE_APP_BACKEND_PORT, function () {
//   console.log('Example app listening on port 3000! Go to https://j2news.rtarf.mi.th:3000/')
// })

// Start Server HTTP
app.listen(port, () => console.log(`Server is running on port ${port}`));
