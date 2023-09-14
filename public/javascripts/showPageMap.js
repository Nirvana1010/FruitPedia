mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: "map", // container ID
style: "mapbox://styles/mapbox/streets-v12", // style URL
center: spot.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(spot.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h5>${spot.title}</h5><p>${spot.location}</p>`
        )
    )
    .addTo(map)