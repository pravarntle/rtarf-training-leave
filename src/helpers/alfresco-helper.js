import axios from 'axios'
import { authHeader } from "@/helpers/auth-header";

const axiosOptions = {
  headers: authHeader()
};

export const alfrescoService = {
  getNode,
  getNodeChild,
  deleteNode,
  createFolder,
  updateNode,
}

async function getNode(nodeId, ticket) {
  return await axios.get(`${process.env.VUE_APP_ALF_URL}alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}?alf_ticket=${ticket}`)
}

async function getNodeChild(nodeId, ticket) {
  return await axios.post(`${process.env.VUE_APP_BACKEND_URL}/nodes/${nodeId}/view`, '', axiosOptions)
}

async function deleteNode(nodeId, aTicket) {
  return await axios.delete(`${process.env.VUE_APP_BACKEND_URL}/nodes/${nodeId}/${aTicket}`)
}

async function createFolder(folderName, parentNode, ticket) {
  const axiosData = {
    name: folderName,
    nodeType: 'cm:folder'
  }
  // console.log('url', `${process.env.VUE_APP_BACKEND_URL}/dms/nodes/${parentNode}/children`)
  return await axios.post(`${process.env.VUE_APP_BACKEND_URL}/nodes/${parentNode}/children`, axiosData, axiosOptions)
}

// async function fileUpload(folderName, parentNode, ticket) {
//   const axiosData = {
//     name: folderName,
//     nodeType: 'cm:folder'
//   }
//   // console.log('url', `${process.env.VUE_APP_BACKEND_URL}/dms/nodes/${parentNode}/children`)
//   return await axios.post(`${process.env.VUE_APP_BACKEND_URL}/dms/nodes/${parentNode}/children`, axiosData, axiosOptions)
// }

async function updateNode(nodeId, properties, ticket) {
  const axiosData = {
    properties: properties
  }
  return await axios.put(`${process.env.VUE_APP_BACKEND_URL}/nodes/${nodeId}`, axiosData, axiosOptions)
}