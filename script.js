"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map;

//getting the current location coords using geolocation API
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      //using these coords with googlemap
      //const gmap = `https://www.google.com/maps/@${latitude},${longitude},12z?entry=ttu`;

      const coords = [latitude, longitude];
      //leaflet starter code
      //creating a map obj using leaflet lib
      map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //displaying the marker on map wherever the user clicks it
      map.on("click", function (mapEvent) {
        const { lat, lng } = mapEvent.latlng;
        const coords = [lat, lng];
        //creation of marker and popup to display on map
        L.marker(coords, { riseOnHover: true })
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: "running-popup",
            })
          )
          .setPopupContent("Popup")
          .openPopup();
      });
    },
    function () {
      alert("Allow to access the Location");
    }
  );
}
