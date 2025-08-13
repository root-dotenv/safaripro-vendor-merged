import axios from "axios";

const localHotelClient = axios.create({
  baseURL: "http://192.168.110.207:8010/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default localHotelClient;
