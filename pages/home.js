import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'

import tw from 'twrnc';

import React, { useCallback, useEffect, useState } from 'react'
import {  MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/solid'
import { fetchLocations, fetchWeatherForecast, imageCall } from '../api/weather';
import { debounce } from "lodash";
import { countries, weatherImages } from '../constants/constants';
const Homepage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [didSearch, setdidSearch] = useState(true)
  const [weather, setWeather] = useState({})
  const [flag, setFlag] = useState("")

  const [image, setImage] = useState("https://images.unsplash.com/photo-1593238738950-01f243cac6fc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1Mjg2OTh8MHwxfHNlYXJjaHwzfHxBbnRhbHlhfGVufDB8fHx8MTcwMDEwOTk4Nnww&ixlib=rb-4.0.3&q=85")




  const handleSearch = search => {
    if (search && search.length > 2)
      fetchLocations({ cityName: search }).then(data => {
        setLocations(data);
      })
  }
  const handleLocation = loc => {
    setLoading(true);
    setdidSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(async data => {
      setFlag(`https://flagsapi.com/${countries[data.location.country]}/flat/64.png`)
      const imageT = await imageCall(loc.name)
      
      setImage(imageT)
      setLoading(false);
      setWeather(data);
    })
  }
  useEffect(() => {
    fetchMyWeatherData();
   

  }, []);

  const fetchMyWeatherData = async () => {
    let cityName = 'Antalya';
    fetchWeatherForecast({
      cityName,
      days: '7'
    }).then(async data => {
      setFlag(`https://flagsapi.com/${countries[data.location.country]}/flat/64.png`)
      
      
      const imageT =await imageCall(data.location.region)
      setImage(imageT)

      setWeather(data);
      setLoading(false);
    })
  }
  //for delay and better api performance
  const handleTextDebounce = useCallback(debounce(handleSearch, 800), []);
  const { location, current } = weather;
  return (
    <View style={tw`flex-1 relative`}>
      {/* bg design */}
      <Image blurRadius={5} source={{uri:image}}
        style={tw`absolute h-full w-full`}/>
      {
        loading && (
          <View style={tw`flex-1 flex-row justify-center items-center`}>
            <Text style={tw` text-xl text-white font-extrabold`}>Loading...</Text>
          </View>
        )
      }
      {
        !loading && (
          <SafeAreaView className="flex flex-1">

            {/* search section */}
            <View style={tw`mx-4 relative h-28 z-50 `} >
              <View
                style={tw`flex-row justify-end items-center rounded-full`}>
                {
                  didSearch ? (
                    <TextInput
                      onChangeText={handleTextDebounce}
                      placeholder="Search city"
                      placeholderTextColor={'lightgray'}
                      style={tw`pl-6 h-10 pb-1 flex-1 text-base text-white`}
                    />
                  ) : null
                }
                <TouchableOpacity
                  onPress={() => setdidSearch(!didSearch)}
                  style={tw`rounded-full p-3 m-1`}
                >
                  {
                    didSearch ? (
                      <XMarkIcon size="25" color="white" />
                    ) : (
                      <MagnifyingGlassIcon size="25" color="white" />
                    )
                  }
                </TouchableOpacity>
              </View>
              {
                locations.length > 0 && didSearch ? (
                  <View style={tw`absolute w-full bg-gray-300 top-16 rounded-3xl   `} >
                    {
                      locations.map((loc, index) => {
                        let showBorder = index + 1 != locations.length;
                        let borderClass = showBorder ? ` border-b-2 border-b-gray-400` : ``;
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => handleLocation(loc)}
                            style={tw`flex flex-row  border-0  mb-1 opacity-50 gap-10 ` + borderClass}>
                         
                            <Text style={tw`text-black text-lg ml-2 p-2`}>{loc?.name}, {loc?.country}</Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                ) : null
              }
            </View>
            {/* forecast section */}
            <View style={tw`mx-4 gap-4`}>
              {/* location */}
              <Text style={tw`text-white text-center text-2xl font-bold`}>
                {location?.name},
                <Image source={{ uri: flag, height: 40, width: 40 }} />
                <Text style={tw`text-lg font-semibold text-gray-300`}  >{location?.country}</Text>
              </Text>



              {/* weather icon */}
              <View style={tw`flex-row justify-center`} >
                <Image
                  source={{uri: 'https:'+current?.condition?.icon}} 
                  style={tw`w-24 h-24`} />
              </View>
              {/* degree celcius */}
              <View style={tw`space-y-2`} >
              <Text style={tw`text-center text-white text-xl mb-2 tracking-widest`}>
                  {current?.condition?.text}
                </Text>
                <Text style={tw`text-center font-bold text-white text-6xl ml-5`}>
                  {current?.temp_c}&#176;
                </Text>
              
              </View>
              {/* other stats */}
              <View style={tw`flex-row justify-between mx-4`}  >
                <View style={tw`flex-row space-x-2 items-center`} >
                  <Image style={tw`w-6 h-6`} source={require('../assets/icons/wind.png')} />
                  <Text style={tw`text-white font-semibold text-base`} >{current?.wind_kph}km</Text>
                </View>
                <View style={tw`flex-row space-x-2 items-center`} >
                  <Image style={tw`w-6 h-6`} source={require('../assets/icons/drop.png')} />
                  <Text style={tw`text-white font-semibold text-base`} >{current?.humidity}%</Text>
                </View>
                <View style={tw`flex-row space-x-2 items-center`} >
                  <Image style={tw`w-6 h-6`} source={require('../assets/icons/sun.png')} />
                  <Text style={tw`text-white font-semibold text-base`} >
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>
            </View>
            {/* forecast for next days */}
            <View style={tw`mb-2 flex flex-row items-center  justify-between space-y-3`} >
      
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 50 }}
                showsHorizontalScrollIndicator={false}>
                {
                  weather?.forecast?.forecastday?.map((item, index) => {
                    const date = new Date(item.date);
                    const options = { weekday: 'long' };
                    let dayName = date.toLocaleDateString('en-US', options);
                    dayName = dayName.split(',')[0];

                    return (
                      <View
                        key={index}
                        style={tw`flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4`}>
                        <Image
                          style={tw`w-11 h-11`}
                          // source={{uri: 'https:'+item?.day?.condition?.icon}}
                          source={weatherImages[item?.day?.condition?.text || 'other']} />
                        <Text style={tw`text-white`} >{dayName}</Text>
                        <Text style={tw`text-white text-xl font-semibold`} >
                          {item?.day?.avgtemp_c}&#176;
                        </Text>
                      </View>
                    )
                  })
                }
              </ScrollView>
            </View>
          </SafeAreaView>
        )
      }
    </View>
  )
}

export default Homepage