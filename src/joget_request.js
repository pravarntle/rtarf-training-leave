import axios from "axios";
import { authHeader } from "@/helpers/auth-header.js";

const request = axios.create({
    headers: authHeader()
});

export default request;