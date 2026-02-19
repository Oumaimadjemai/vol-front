import axios from "axios";

 const msAuthInstance = axios.create({
  baseURL: "http://localhost:8000/auth",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default msAuthInstance;