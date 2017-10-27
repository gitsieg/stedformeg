<template>
  <div id="app">
    <input type="text" v-model="msg" />
    <h1>{{msg}}</h1>
    <button v-on:click="drawHeatMap">testknapp</button>
    <div v-for="marker in markers">
      Posisjon:
      <p>lat = {{marker.position.lat}}</p>
      <input type="number" v-model.number="marker.position.lat" />
      <p>lon = {{marker.position.lng}}</p>
      <input type="number" v-model.number="marker.position.lng" />
    </div>

    <div v-for="result in results">
      <div>
        <input type="number" v-on:change="drawHeatMap" v-model="result.coordinates.lat" />
        <input type="number" v-on:change="drawHeatMap" v-model="result.coordinates.lng" />
        <input type="number" v-on:change="drawHeatMap" v-model="result.weight" />
      </div>
    </div>

    <gmap-map
    id="map"
    :center="center"
    :zoom="10"
    style="width: 500px; height: 300px"
    >
    <gmap-marker
    :key="index"
    v-for="(m, index) in markers"
    :position="m.position"
    :clickable="true"
    :draggable="true"
    @click="center=m.position"
    ></gmap-marker>

  </gmap-map>


</div>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps';
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
      msg: '',
      center: {lat: 60.5, lng: 9.0},
      markers: [{
        position: {lat: 60.5, lng: 9.0}
      }],
      results: require('./json/testdata.json')
    }
  },
  methods: {
    drawHeatMap: function () {
      var results = this.results;
      var heatmapData = [];

      this.results.forEach(function(result){
        var latLng = new google.maps.LatLng(result.coordinates.lat, result.coordinates.lng);
        heatmapData.push({location: latLng, weight: result.weight});
      })

      var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: {lat: 60.5, lng: 9},
        mapTypeId: 'terrain'
      });

      var heatMap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        dissipating: false,
        map: map,
        radius: 1,
        gradient: ['transparent', '#ff0000', '#ffff00', '#00ff00']

      });
    }
  }
}
</script>

<style lang="scss">

</style>
