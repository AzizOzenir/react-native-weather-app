import axios from "axios";
import { apiKey } from "../constants/constants";

const forecastEndpoint = params=> `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`;
const locationsEndpoint = params=> `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;


export const imageCall = async (location)=>{
    const imageData = await axios.get("https://api.unsplash.com/search/photos/", {
        params: {
          query: location, page: 2, per_page: 2
        },
        headers: {
          Authorization: "API KEY FROM UNSPLASH.COM"
        }
      },
      )
      console.log(imageData.data.results[0].urls.full)
     return imageData.data.results[0].urls.full
}

const apiCall = async (endpoint)=>{
    const options = {
        method: 'GET',
        url: endpoint,
    };

      try{
        const response = await axios.request(options);
        
        return response.data;
      }catch(error){
        console.log('error: ',error);
        return {};
    }
}

export const fetchWeatherForecast = params=>{
    let forecastUrl = forecastEndpoint(params);
    return apiCall(forecastUrl);
}

export const fetchLocations = params=>{
    let locationsUrl = locationsEndpoint(params);
    return apiCall(locationsUrl);
}
