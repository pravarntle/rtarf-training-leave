import joget_request from "@/joget_request.js";

import store from "@/store.js";

const $joget = joget_request;

export const jogetService = {
  getActivityName,
  startProcess,
  formSubmit,
  jsonSubmit,
  listAll,
  list,
  getCurrentActivity,
  processComplete,
  processCompleteWithVariable,
  getMyAssignment,
  getAssignment,
  formDelete,
};

async function getActivityName(processId) {
  const axiosData = {
    processId: processId,
  }
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/process/getActivityName`,
    axiosData
  )
}

async function startProcess(appId, processDefId) {
  const axiosData = {
    app: {
      appId: appId,
      processDefId: processDefId,
    },
  }
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/process/start`,
    axiosData
  );
}

async function jsonSubmit(appId, formId, primaryKey, formData) {
  $joget.interceptors.response.use(
    function (response) {
      if (
        (formId == "createNews" || formId == "mergeNews") &&
        response.config.url.endsWith("/form/jsonAdd")
      ) {
        var assignmentCount = store.state.assignmentCount;
        store.commit("set", ["assignmentCount", assignmentCount + 1]);
      }

      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  const axiosData = {
    app: {
      appId: appId,
      formId: formId,
    },
    primaryKey: primaryKey,
    formData: formData,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/form/jsonAdd`,
    axiosData
  );
}

async function formSubmit(appId, formId, primaryKey, formData) {
  const axiosData = {
    app: {
      appId: appId,
      formId: formId,
    },
    primaryKey: primaryKey,
    formData: formData,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/form/add`,
    axiosData
  );
}

async function list(appId, listId, searchData) {
  const axiosData = {
    app: {
      appId: appId,
      listId: listId,
    },
    search: searchData,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/list/get`,
    axiosData
  );
}

async function listAll(appId, listId) {
  const axiosData = {
    app: {
      appId: appId,
      listId: listId,
    },
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/list/getAll`,
    axiosData
  );
}

async function getCurrentActivity(processId) {
  const axiosData = {
    processId: processId,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/process/view`,
    axiosData
  );
}

async function processComplete(activityId) {
  const axiosData = {
    activityId: activityId,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/process/complete`,
    axiosData
  );
}

async function processCompleteWithVariable(activityId, variableData) {
  const axiosData = {
    activityId: activityId,
    variables: variableData,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/process/completeWithVariables`,
    axiosData
  );
}

async function getMyAssignment() {
  $joget.interceptors.response.use(
    function (response) {
      if (response.config.url.endsWith("process/getAssignment")) {
        store.commit("set", ["assignmentCount", response.data.total]);
      }

      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/process/getAssignment`,
    ""
  );
}

async function getAssignment(processId) {
  const axiosData = {
    processId: processId,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/process/getAssignmentWithPid`,
    axiosData
  );
}

async function formDelete(appId, formId, primaryKey) {
  const axiosData = {
    app: {
      appId: appId,
      formId: formId,
    },
    primaryKey: primaryKey,
  };
  return await $joget.post(
    `${process.env.VUE_APP_BACKEND_URL}/form/delete`,
    axiosData
  );
}
