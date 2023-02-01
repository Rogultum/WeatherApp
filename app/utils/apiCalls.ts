import axios from "axios"
import { API_KEY } from "../.env/WeatherApi"

export const getCurrentWeather = async () => {
  await axios
    .get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=LONDON`)
    .then((response) => {
      return response.data
    })
}
