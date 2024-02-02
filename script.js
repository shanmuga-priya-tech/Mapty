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

class App {
  //creating the map and mapevent as a private property to make it available for all the instances
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", _this._toggleElevationField);
  }

  _getPosition() {
    //getting the current location coords using geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Allow to access the Location");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    //using these coords with googlemap
    //const gmap = `https://www.google.com/maps/@${latitude},${longitude},12z?entry=ttu`;

    const coords = [latitude, longitude];
    //leaflet starter code
    //creating a map obj using leaflet lib
    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    //render a workout form when user clicks on map
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    //changing the content of the form based on workout
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    //displaying the marker on map wherever the user clicks it and submit the form

    e.preventDefault();

    //clear input fields
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        "";

    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];
    //creation of marker and popup to display on map
    L.marker(coords, { riseOnHover: true })
      .addTo(this.#map)
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
  }
}

const app = new App();
