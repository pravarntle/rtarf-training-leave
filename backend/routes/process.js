const router = require("express").Router();
const axios = require("axios");
const { last } = require("pdf-lib");
const authenticateToken = require("../configs/auth");

router.post("/start", authenticateToken, async (req, res) => {
  const app = req.body.app;
  const user = req.user;
  console.log(user)
  const url = `${process.env.VUE_APP_JOGET_URL}web/json/workflow/process/start/${app.appId}:latest:${app.processDefId}?j_username=${user.username}&hash=${user.hashed}`;
  await axios
    .post(url)
    .then(response => {
      res.status(200).send(response.data);
    })
    .catch(error => {
      res.status(500).send({ statusText: "can not start process" });
    });
});

router.post("/view", authenticateToken, async (req, res) => {
  const processId = req.body.processId;
  const user = req.user;

  const url = `${process.env.VUE_APP_JOGET_URL}web/json/workflow/assignment/process/view/${processId}?j_username=${user.userId}&hash=${user.jogetHashed}`;
  //  console.log(url)
  await axios
    .post(url)
    .then(response => {
      res.status(200).send(response.data);
    })
    .catch(error => {
      res.status(500).send({ statusText: "can not start process" });
    });
});

router.post("/complete", authenticateToken, async (req, res) => {
  const activityId = req.body.activityId;
  const user = req.user;
  const url = `${process.env.VUE_APP_JOGET_URL}web/json/workflow/assignment/complete/${activityId}?j_username=${user.userId}&hash=${user.jogetHashed}`;
  await axios
    .post(url)
    .then(response => {
      res.status(200).send(response.data);
    })
    .catch(error => {
      res.status(500).send({ statusText: "can not start process" });
    });
});

router.post("/completeWithVariables", authenticateToken, async (req, res) => {
  const activityId = req.body.activityId;
  const user = req.user;
  let params = "";
  if (req.body.variables) {
    const variables = req.body.variables;
    variables.forEach(param => {
      params = `${params}&var_${param.paramName}=${param.paramValue}`;
    });
  }
  const url = `${process.env.VUE_APP_JOGET_URL}web/json/workflow/assignment/completeWithVariable/${activityId}?j_username=${user.userId}&hash=${user.jogetHashed}${params}`;
  await axios
    .post(encodeURI(url))
    .then(response => {
      console.log(response);
      res.status(200).send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ statusText: "can not start process" });
    });
});

router.post("/getAssignment", authenticateToken, async (req, res) => {
  const user = req.user;
  const url = `${process.env.VUE_APP_JOGET_URL}web/json/workflow/assignment/list/pending?j_username=${user.userId}&hash=${user.jogetHashed}`;
  await axios
    .post(url)
    .then(response => {
      console.log(response.data);
      res.status(200).send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ statusText: "can not start process" });
    });
});

router.post("/getAssignmentWithPid", authenticateToken, async (req, res) => {
  const user = req.user;
  const processId = req.body.processId;
  //  console.log(processId)
  const url = `${process.env.VUE_APP_JOGET_URL}web/json/workflow/assignment/process/view/${processId}?j_username=${user.userId}&hash=${user.jogetHashed}`;
  await axios
    .post(url)
    .then(response => {
      res.status(200).send(response.data);
    })
    .catch(error => {
      res.status(500).send({ statusText: "can not start process" });
    });
});

router.post("/getActivityName", authenticateToken, async (req, res) => {
  const user = req.user
  const processId = req.body.processId
  const url = `${process.env.VUE_APP_JOGET_URL}web/json/monitoring/activity/list?processId=${processId}&j_username=${user.userId}&hash=${user.jogetHashed}`
  await axios.post(url)
    .then((response) => {
      let responseItem = ''
      response.data.data.forEach((item) => {
        if (item.state === 'open.not_running.not_started') {
          responseItem = item
        }
      })
      res.status(200).send(responseItem);
    }).catch(error => {
      res.status(500).send({ statusText: "can not start process" })
    })
})

router.post("/getLastActivity", authenticateToken, async (req, res) => {
  const user = req.user
  const processId = req.body.processId
  let url = `${process.env.VUE_APP_JOGET_URL}web/json/monitoring/activity/list?processId=${processId}&sort=id&j_username=${user.userId}&hash=${user.jogetHashed}`
  await axios.post(url)
    .then(async (response) => {
      let lastActivityId = ''
      const processDefId = 'RoyalThaiCommunication:latest:createNewsProcess'
      const data = response.data.data
      data.forEach((item, index) => {
        console.log(item)
        if (item.state === 'open.not_running.not_started') {
          lastActivityId = data[index-1].id
        }
      })
      url = `${process.env.VUE_APP_JOGET_URL}web/json/monitoring/activity/view/${lastActivityId}`
      await axios.post(url)
        .then((response) => {
          // console.log(response)
        })
    })
})

module.exports = router;
