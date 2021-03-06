"use strict";

(function () {

  window.addEventListener("load", init);

  function init() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
    let map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      zoom: 10, // starting zoom
      center: [-122.2559435, 47.6002614] // starting center
    });

    map.on('load', () => {

      map.addSource('base-tiles', {
        'type': 'raster',
        'tiles': [
          'tiles/base/{z}/{x}/{y}.png'
        ],
        'tileSize': 256,
        'attribution': 'Generated by QTiles'
      });

      map.addSource('thematic-tiles', {
        'type': 'raster',
        'tiles': [
          'tiles/thematic/{z}/{x}/{y}.png'
        ],
        'tileSize': 256,
        'attribution': 'Map tiles designed by Joshua Zhang'
      });

      map.addSource('base_thematic-tiles', {
        'type': 'raster',
        'tiles': [
          'tiles/base_and_thematic/{z}/{x}/{y}.png'
        ],
        'tileSize': 256,
        'attribution': 'Generated by QTiles'
      });

      map.addSource('customized-tiles', {
        'type': 'raster',
        'tiles': [
          'tiles/customized/{z}/{x}/{y}.png'
        ],
        'tileSize': 256,
        'attribution': 'Generated by QTiles'
      });

      map.addLayer({
        'id': 'Base Map',
        'type': 'raster',
        'layout': {
          'visibility': 'none'
        },
        'source': 'base-tiles'
      });

      map.addLayer({
        'id': 'Landslide Locations',
        'type': 'raster',
        'layout': {
          'visibility': 'none'
        },
        'source': 'thematic-tiles'
      });

      map.addLayer({
        'id': 'Mix',
        'type': 'raster',
        'layout': {
          'visibility': 'none'
        },
        'source': 'base_thematic-tiles'
      });

      map.addLayer({
        'id': 'Book Culture',
        'type': 'raster',
        'layout': {
          'visibility': 'none'
        },
        'source': 'customized-tiles'
      });
    });

    const scale = new mapboxgl.ScaleControl({
      maxWidth: 200,
      unit: 'metric'
    });
    map.addControl(scale);
    map.addControl(new mapboxgl.NavigationControl());

    map.on('idle', () => {
      if (!map.getLayer('Base Map') || !map.getLayer('Landslide Locations')
        || !map.getLayer('Mix') || !map.getLayer('Book Culture')) {
        return;
      }

      const toggleableLayerIds = ['Base Map', 'Landslide Locations', 'Mix', 'Book Culture'];

      for (const id of toggleableLayerIds) {
        if (document.getElementById(id)) {
          continue;
        }

        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = 'inactive';

        link.onclick = function (e) {
          const clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();

          const visibility = map.getLayoutProperty(
            clickedLayer,
            'visibility'
          );

          if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
          } else {
            this.className = 'active';
            map.setLayoutProperty(
              clickedLayer,
              'visibility',
              'visible'
            );
          }
        };

        const layers = document.getElementById('menu');
        layers.appendChild(link);
      }
    });

  }
})();