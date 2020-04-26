/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidmlzaHdhamVldHJhajExIiwiYSI6ImNrOThmNzY0cjAxaXUzZm15NnltN240dmsifQ.YHstH_aaWK3IBx9yv6Xf0g';
  var map = new mapboxgl.Map({
    container: 'map', // it will put the map with the element having id = map
    style: 'mapbox://styles/vishwajeetraj11/ck98fw1uh08bu1iodc62inkv3',
    scrollZoom: false
    // center:[-118.113491, 34.111745],
    // zoom: 4,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create the  marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker
    new mapboxgl.Marker({
      elememt: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 40
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  });
};
