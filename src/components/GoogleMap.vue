<template>
	<div class="google-map" :id="mapName"></div>
</template>

<script>
export default {
	name: 'google-map',
	props: ['name'],
	data: function () {
		return {
			mapName: this.name + "-map",
			points: '',
			bounds: {},
			map: {}
		}
	},
	mounted: function () {
		const element = document.getElementById(this.mapName)
		const options = {
			zoom: 14,
			center: new google.maps.LatLng(60.5, 9),
			mapTypeId: 'terrain'
		}
		const map = new google.maps.Map(element, options);
		this.bounds = map.getBounds();
		console.log(map.getBounds());
		/*
		const heatmap = new google.maps.visualization.HeatmapLayer({
			data: this.generateHeatMapGrid(),
			map: map,
			radius: 1,
			gradient: ['transparent', '#ff0000', '#ffff00', '#00ff00']
		});
		console.log(heatmap);*/
	},
	methods: {
		generateHeatMapGrid: function () {
			console.log("geneerate heatmap");
			this.bounds = {
			south: this.map.getBounds().getNorthEast().lat(), 
			west: this.map.getBounds().getNorthEast().lng(), 
			north: this.map.getBounds().getSouthWest().lat(), 
			east: this.map.getBounds().getSouthWest().lng()
		};
			let heatMapGridCoordinates = [];
			let gridRows = 3;
			let gridCols = 5;

			let gridHeight = this.bounds.south - this.bounds.north;
			let gridWidth = this.bounds.west - this.bounds.east;

			let gridVerticalSpace = gridHeight / gridRows;
			let gridHorizontalSpace = gridWidth / gridCols;

			for (let latIndex = 0; latIndex < 3; latIndex++) {
				for (let lngIndex = 0; lngIndex < 3; lngIndex++) {
					heatMapGridCoordinates.push({
						coordinates: {
							lat: this.bounds.north + (gridHorizontalSpace * latIndex),
							lng: this.bounds.east + (gridVerticalSpace * lngIndex)
						},
						weight: 1
					});
				} 
			}
			return heatMapGridCoordinates;
		}
	}
};
</script>

<style scoped>
.google-map {
	width: 800px;
	height: 600px;
	margin: 0 auto;
	background: gray;
}
</style>