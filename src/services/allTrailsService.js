const allTrailService = ['$http', function ($http) {
  const allTrails = [];
  const trailHeads = [];

  this.getAllTrails = function () {
    return allTrails;
  }

  this.fetchAllTrails = function () {
    return $http.get('/api/hikeNow')
    .then(data => {
      let result = data.data;
      console.log(result)
      for(let i in result){
        if(result[i]){
          console.log(i)
          if(i !== 'Ualakaa Trail'){
            trailHeads.push(result[i].coordinates)
          }
          let trail = {
            'trailname': i,
            'amenities': result[i].amenities,
            'climate': result[i].climate,
            'coordinates': result[i].coordinates,
            'features': result[i].features,
            'hazards': result[i].hazard,
            'standard': result[i].standard,
            'elevation': result[i].elev,
            'length': result[i].length,
            'weather': result[i].weatherConditions
          }
          allTrails.push(trail);
        }
      }
      this.setTrailStatus();
      return allTrails;
    })
    .catch(err => {
      console.log(err)
    })
  }

  this.setTrailStatus = function () {
    allTrails.map(element => {
      let windSpeed = element.weather.wind_mph;
      if(windSpeed < 25) {
        element.status = 'GOOD';
      }
      if(windSpeed >= 25 && windSpeed <= 46) {
        element.status = 'CAUTION';
      }
      if(windSpeed > 46) {
        element.status = 'DANGER';
      }
      return true;
    })
  }

  this.getTrailHeadCoordinates = function () {
    return trailHeads;
  }





}];

export default allTrailService;