<template>
  <div id="app">
   <div>
    I midten:
    {{this.center}}
  </div>

  <div>
    The BOUNDNSDS:
    {{this.bounds}}
  </div>

  <button v-on:click="drawHeatMap"> klikk  </button>

  <gmap-map
  id="map"
  ref="map"
  :center="center" 
  v-on:center_changed="updateCenter"
  v-on:bounds_changed="updateBounds"
  v-on:dragend="drawHeatMap"
  v-on:tilesloaded="drawHeatMap"
  :zoom="10"
  style="width: 500px; height: 300px"
  >

</gmap-map>

</div>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps';
import * as axios from 'axios';
import Vue from 'vue';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBBOPgoEQFI73MPcHhXakXpafjbNsbDv1c',
    v: '',
    libraries: 'visualization',
  }
});

export default {
  name: 'app',
  data () {
    return {
      center: {lat: 59, lng: 5.7},
      bounds: {},
      heatMap: null,
      content: {
        barnehager: [],
        turstier: []
      }
    }
  },
  created: function (){
    this.fetchBarnehager();
    this.fetchTurstier();
  },
  methods: {

    fetchBarnehager: function () {
      axios.get('http://hotell.difi.no/api/json/stavanger/barnehager?')
      .then(function (response) {
        for (let i = 0; i < response.data.entries.length; i++) {
          this.content["barnehager"].push({
            coordinates: {
              lat: response.data.entries[i].breddegrad,
              lng: response.data.entries[i].lengdegrad
            }
          });
        }
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    },
    fetchTurstier: function () {
      axios.get('https://opencom.no/dataset/bf627d4a-f115-41a2-82b9-d19de3cd5414/resource/e1fe43ad-c4b6-4e12-a3b4-6e864c57f96a/download/turveger.json')
      .then(function (response) {
        if (response.data.features.length){
          response.data.features.forEach(function(feature){
            feature.geometry.coordinates.forEach(function(coordinate){
              this.content["turstier"].push({
                coordinates: {
                  lat: coordinate[1],
                  lng: coordinate[0]
                }
              });
            }.bind(this))
          }.bind(this))
        }
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    },
    updateCenter(center) {
      this.center = {
        lat: center.lat(),
        lng: center.lng()
      }
    },
    updateBounds(bounds) {
      this.bounds = {
       south: bounds.getNorthEast().lat(), 
       west: bounds.getNorthEast().lng(), 
       north: bounds.getSouthWest().lat(), 
       east: bounds.getSouthWest().lng()
     }
   },
   drawHeatMap: function () {
    let heatMapData = [];
    let results = this.generateHeatMapPoints();
    results.forEach(function(result){
      let latLng = new google.maps.LatLng(result.coordinates.lat, result.coordinates.lng);
      heatMapData.push({location: latLng, weight: result.weight});
    });
/*
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: {lat: 60.5, lng: 9},
        mapTypeId: 'terrain'
      });*/

  /*  if (this.heatMap !== null){
      this.heatMap.data.b = heatMapData;
    }*/

    // minzoom = 8

    if (this.heatMap !== null) this.heatMap = this.heatMap.setMap(null);
    let zoomValue = this.$refs.map.$mapObject.zoom;

    this.heatMap = new google.maps.visualization.HeatmapLayer({
      data: heatMapData,
      dissipating: false,
      map:  this.$refs.map.$mapObject,
      radius: 1,
      gradient: ['transparent', '#ff0000', '#ffff00', '#00ff00']
    });
    
  },
  generateHeatMapPoints: function (){
    let heatMapPoints = [];
    this.content.barnehager.forEach(function (barnehage){
     heatMapPoints.push({
      coordinates: {
        lat: barnehage.coordinates.lat,
        lng: barnehage.coordinates.lng
      },
      weight: (Math.random())*1.5
    });
   });
    return heatMapPoints;

  },
  generateHeatMapGrid: function () {
    console.log("geneerate heatmap");
    let heatMapGridCoordinates = [];
    let zoomValue = this.$refs.map.$mapObject.zoom;
    let gridRows = Math.round(80 / (zoomValue*0.4));
    let gridCols = Math.round(80*1.78  / (zoomValue*0.4));

    console.log("gridrows:" + gridRows);
    console.log("gridcols:" + gridCols);

    let gridHeight = this.bounds.south - this.bounds.north;
    let gridWidth = this.bounds.west - this.bounds.east;

    let gridVerticalSpace = gridHeight / gridRows;
    let gridHorizontalSpace = gridWidth / gridCols;


    let latCoordinate = this.bounds.north + (gridVerticalSpace/2);
    let lngCoordinate = this.bounds.east + (gridHorizontalSpace/2);

    for (let latIndex = 0; latIndex < gridRows; latIndex++) {
     for (let lngIndex = 0; lngIndex < gridCols; lngIndex++) {
      heatMapGridCoordinates.push({
        coordinates: {
          lat: latCoordinate,
          lng: lngCoordinate
        },
        weight: (Math.random())*1.5
      });
      lngCoordinate += gridHorizontalSpace;
    }
    latCoordinate += gridVerticalSpace;
    lngCoordinate = this.bounds.east + (gridHorizontalSpace/2);
  }
  return heatMapGridCoordinates;

},
}
}

</script>

<style lang="scss">

</style>
