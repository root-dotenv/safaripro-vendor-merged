import axios from "axios";

const localHotelClient = axios.create({
  baseURL: "http://hotel.safaripro.net/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default localHotelClient;
