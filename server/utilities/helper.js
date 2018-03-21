const express = require('express');
const rp = require('request-promise');
const cron = require('node-schedule');

const Trail = require('../db/models/Trails');
const weatherKey = require('../../config/config');

let WEATHERAPIKEY = weatherKey.weather.apiKey2;
const WEATHER_API_ENDPOINT = `http://api.wunderground.com/api/${WEATHERAPIKEY}/conditions/q/`;
const rule = new cron.RecurrenceRule();

module.exports = {
  setStatus,
  timedCalls
};

global.hikeNow = {};
global.hikeNow.weather = {
  station_id: '',
  weather: '',
  temp_f: '',
  temp_c: '',
  relative_humidity: '',
  wind_str: '',
  wind_dir: '',
  wind_mph: '',
  wind_gust_mph: '',
  wind_gust_kph: '',
  precip_1hr_string: '',
  icon_url: ''
};

function timedCalls() {
  cron.scheduleJob({ rule:' 0 0 6,9,12,15 * * *'},
  function getTrailHeads() {   
    let trails = [];
    new Trail()
    .fetchAll()
    .then(result => {
      result.map(element => {
        trails.push(element.attributes.coordinates[0]);
      })      
     fireWeatherAPI(trails);
    })
   })
  };

function fireWeatherAPI (arr) {
  arr.map(element => {
    let latitude = element[1];
    let longitude = element[0];
    getWeatherData(latitude,longitude);
  });
};

function getWeatherData(lat,long){
  return rp(`${WEATHER_API_ENDPOINT}${lat},${long}.json`)
  .then(json => {
    return JSON.parse(json);
  })
  .then(data => {
    if (data.current_observation && data.current_observation.station_id){
      global.hikeNow.weather[data.current_observation.station_id] = {
        observation_time: data.current_observation.observation_time,
        weather: data.current_observation.weather,
        temp_f: data.current_observation.temp_f,
        temp_c: data.current_observation.temp_c,
        relative_humidity: data.current_observation.relative_humidity,
        wind_dir: data.current_observation.wind_dir,
        wind_mph: data.current_observation.wind_mph,
        wind_gust_mph: data.current_observation.wind_gust_mph,
        wind_gust_kph: data.current_observation.wind_gust_kph,
        feelslike_f: data.current_observation.feelslike_f,
        feelslike_c: data.current_observation.feelslike_c
      }
    }else{
      return global.hikeNow.weather;
    }
  })
  .catch(err => {
    console.log(err)
  });
};

function setStatus(obj) {
  for (var key in obj){
    if(obj.hasOwnProperty(key)){
      let result = obj[key]
         for (var i in result) {
           if(result.hasOwnProperty(i)){
             let weather = result.weatherConditions
              for (var k in weather) {
                if(weather.wind_gust_mph < 24.9999){
                  result.status = 'GOOD'
                }
                if(weather.wind_gust_mph > 25 && weather.wind_gust_mph < 45.999) {
                  result.status = 'CAUTION'
                }
                if(weather.wind_gust_mph > 46) {
                  result.status = 'DANGER'
                }
              }
            }
          }
      } 
  }
  return obj
}
  


  // let weather = result[i]
  // for(var k in weather) {
  //   console.log('berrp', weather[k])
  //   console.log(k)