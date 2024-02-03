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

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; //[lat,lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    //km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  //creating the map and mapevent as a private property to make it available for all the instances
  #map;
  #mapEvent;
  #workouts = [];

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
    //fn to validate form inputs
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    //displaying the marker on map wherever the user clicks it and submit the form
    e.preventDefault();

    //1)get the form data (using + to convert input value to number)
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //2)if activity is running,create running obj
    if (type === "running") {
      const cadence = +inputCadence.value;

      //validate the data in form
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert("Inputs have to be a positive numbers!");
      }

      //creating a running obj
      workout = new Running([lat, lng], distance, distance, cadence);
    }

    //3)if activity is cycling,create cycling obj
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      //validate the data in form
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert("Inputs have to be a positive numbers!");
      }
      //creating a cycling obj
      workout = new Cycling([lat, lng], distance, distance, elevation);
    }

    //4)add the new obj to the workout array
    this.#workouts.push(workout);

    //5)render workout on map as marker
    this.renderWorkoutMarker(workout);

    //6)render workout on list

    //7)hide the form and clear input fields
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        "";
  }

  renderWorkoutMarker(workout) {
    //creation of marker and popup to display on map
    L.marker(workout.coords, { riseOnHover: true })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type}`)
      .openPopup();
  }
}

const app = new App();
