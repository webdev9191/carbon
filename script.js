let customInput = "";
let customInputQuestion = "";
const customInputField = document.querySelector(".next");

const handleVariableChange = (e) => {
  customInputField.classList.remove("border-error");
  document.querySelector(".submit-button").classList.remove("border-error");

  const input = e.target.value;
  const question = e.target.getAttribute("data-value");

  customInput = input;
  customInputQuestion = question;

  if (e.key === "Enter" && customInput) {
    customInputField.classList.remove("border-error");

    const isQuestionLast = customInputQuestion == "city-rail";

    chooseAnswer(customInputQuestion, customInput, isQuestionLast);
    customInput = "";
    customInputQuestion = "";
    goToNextQuestion();
  }

  if (e.key === "Enter" && !customInput) {
    console.log("Custom Input Field is Empty");

    document.querySelectorAll(".customInput").forEach((field) => {
      if (notHidden(field)) {
        customInputField.classList.add("border-error");
      }
    });
  }
};

window.onkeyup = handleVariableChange;

let id = 0;

const valuesToProcess = [];

const chooseAnswer = (question, value, questionIsLast = false) => {
  if (value == "custom") value = customInput; // edge case. for latest question

  // Find the index of the item with the same question, if it exists
  const index = valuesToProcess.findIndex((item) => item.question === question);

  // If an item with the same question exists, replace it with the new item
  if (index !== -1) {
    valuesToProcess[index] = { id, question, value };
  } else {
    // If no existing item found, push the new item
    valuesToProcess.push({ id, question, value });
  }

  id++;

  console.log(id, question, value, questionIsLast);

  if (questionIsLast) {
    handleSubmit();
  }
};

let finalValue = 0;

const handleSubmit = () => {
  if (valuesToProcess.length == 6 && valuesToProcess[5].value.length > 0) {
    valuesToProcess.map((item) => {
      const { question, value } = item;
      if (question == "car") {
        finalValue += calculateCarsEmission(value);
      }
      if (question == "long-flight") {
        finalValue += calculateFlightEmission(value);
      }
      if (question == "else") {
        if (value == "bus") {
          finalValue += 300000; // In a year - estimate
        }

        if (value == "transit") {
          finalValue += 150000; // In a year - estimate
        }

        if (value == "rail") {
          finalValue += 15000; // In a year - estimate
        }
      }
      if (question == "bus") {
        finalValue += calculateOtherTransportsEmission("interCityRail", value);
      }
      if (question == "transit-rail") {
        finalValue += calculateOtherTransportsEmission("transitRail", value);
      }
      if (question == "city-rail") {
        finalValue += calculateOtherTransportsEmission("bus", value);
      }
      console.log(`${finalValue} CO2 gram`);
      localStorage.setItem("carbon_footprint", finalValue.toString());
    });

    window.location.href = "/submit.html";
  } else {
    document.querySelector(".submit-button").classList.add("border-error");
  }
};

const queButtons = document.querySelectorAll(".que_container button");
const questions = document.querySelectorAll(".question");
let currentQuestion = 0;

function hideAllQuestions() {
  questions.forEach((question) => {
    question.style.display = "none";
  });
}

function showCurrentQuestion() {
  hideAllQuestions();
  questions[currentQuestion].style.display = "block";
}

function hideAllButtonsExceptCurrent() {
  const allButtons = document.querySelectorAll(".options");
  allButtons.forEach((buttons, index) => {
    if (index !== currentQuestion) {
      buttons.style.display = "none";
    } else {
      buttons.style.display = "block";
    }
  });
}

function goToNextQuestion() {
  const warn1 = document.getElementById("warn1");
  const warn2 = document.getElementById("warn2");
  warn1.style.visibility = "hidden";
  warn2.style.visibility = "hidden";

  customInputField.classList.remove("border-error");
  customInput = "";
  customInputQuestion = "";

  document.querySelectorAll(".customInput").forEach((field) => {
    field.value = "";
  });

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showCurrentQuestion();
    hideAllButtonsExceptCurrent();
    updateQueButtonsColor();
    if (currentQuestion === questions.length - 1) {
      document.querySelector(".submit-button").style.display = "block";
      document.querySelector(".next").style.display = "none";
    }
  } else {
    document.querySelector(".submit-button").style.display = "block";
    document.querySelector(".next").style.display = "none";
  }
}

function goToPreviousQuestion() {
  const warn1 = document.getElementById("warn1");
  const warn2 = document.getElementById("warn2");
  warn1.style.visibility = "hidden";
  warn2.style.visibility = "hidden";
  customInputField.classList.remove("border-error");

  customInput = "";
  customInputQuestion = "";

  customInputField.value = "";

  if (currentQuestion > 0) {
    currentQuestion--;
    showCurrentQuestion();
    hideAllButtonsExceptCurrent();
    updateQueButtonsColor();
    document.querySelector(".submit-button").style.display = "none";
    // Optionally, show the next button if needed
    document.querySelector(".next").style.display = "block";
  }
}

function handleAnswerClick() {
  goToNextQuestion();
}

function updateQueButtonsColor() {
  queButtons.forEach((button, index) => {
    if (index === currentQuestion) {
      button.style.backgroundColor = "#fff"; // Set the current question's button to white
    } else {
      button.style.backgroundColor = "gray"; // Set other buttons to gray
    }
  });
}
// Show the first question initially
showCurrentQuestion();
hideAllButtonsExceptCurrent();
updateQueButtonsColor();

if (currentQuestion === questions.length - 1) {
  document.querySelector(".submit-button").style.display = "block";
  document.querySelector(".next").style.display = "none";
}

document.querySelectorAll(".options button").forEach((button) => {
  button.addEventListener("click", handleAnswerClick);
});

document.querySelector(".prev").addEventListener("click", goToPreviousQuestion);

document.querySelector(".next").addEventListener("click", () => {
  if (customInput && customInputQuestion) {
    chooseAnswer(customInputQuestion, customInput);
    customInput = "";
    customInputQuestion = "";
    goToNextQuestion();
  }

  if (!customInput) {
    const warn1 = document.getElementById("warn1");
    const warn2 = document.getElementById("warn2");

    if (notHidden(warn1)) {
      warn1.style.visibility = "visible";

      setTimeout(() => {
        warn1.style.visibility = "hidden";
      }, 2750); //ms
    }

    if (notHidden(warn2)) {
      warn2.style.visibility = "visible";

      setTimeout(() => {
        warn2.style.visibility = "hidden";
      }, 2750); //ms
    }

    document.querySelectorAll(".customInput").forEach((field) => {
      if (notHidden(field)) {
        customInputField.classList.add("border-error");
      }
    });
  }
});

document.getElementById("scrollToTopLink").addEventListener("click", function (e) {
  e.preventDefault();
  const scrollToTop = () => {
    const currentPositionY = window.scrollY;
    if (currentPositionY > 0) {
      window.scrollTo(0, currentPositionY - currentPositionY / 8);
      requestAnimationFrame(scrollToTop);
    }
  };
  scrollToTop();
});

// Show the link when scrolling down
window.onscroll = function () {
  showScrollToTopLink();
};

function showScrollToTopLink() {
  var scrollToTopLink = document.getElementById("scrollToTopLink");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopLink.style.display = "block";
  } else {
    scrollToTopLink.style.display = "none";
  }
}

document.getElementById("scrollToTopLink1").addEventListener("click", function (e) {
  e.preventDefault();
  const scrollToTop = () => {
    const currentPositionY = window.scrollY;
    if (currentPositionY > 0) {
      window.scrollTo(0, currentPositionY - currentPositionY / 8);
      requestAnimationFrame(scrollToTop);
    }
  };
  scrollToTop();
});

// Show the link when scrolling down
window.onscroll = function () {
  showScrollToTopLink();
};

function showScrollToTopLink() {
  var scrollToTopLink = document.getElementById("scrollToTopLink1");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopLink.style.display = "block";
  } else {
    scrollToTopLink.style.display = "none";
  }
}

const assignedNumber = w5; // Change this number to see the bar grow

function updateChart() {
  const bar = document.getElementById("bar");
  const widthPercentage = Math.min(assignedNumber, 100); // Limit the bar width to 100%
  bar.style.width = widthPercentage + "%";
  document.getElementById("widthValue").innerText = widthPercentage;
}

// Initial call to update the chart with the predefined number
updateChart();

// FORMULAS
function calculateCarsEmission(quantity) {
  function calculateTotalCarDistance(numberOfCars, averageDistancePerCar) {
    // Assuming numberOfCars is the number of cars in the household
    // and averageDistancePerCar is the average distance each car travels

    // Calculate total distance for all cars
    let totalCarDistance = numberOfCars * averageDistancePerCar;

    return totalCarDistance;
  }

  // average distance of 300 kilometers per car
  const distanceInKm = calculateTotalCarDistance(quantity, 300);

  const averageAnnualMileage = 12000;
  const emissionFactor = 2.34; // Gasoline

  const totalEmissions = distanceInKm * averageAnnualMileage * emissionFactor;
  return totalEmissions;
}

function calculateFlightEmission(quantity) {
  function calculateTotalDistance(roundtripFlights, distancePerFlight) {
    // Assuming roundtripFlights is the number of roundtrip flights
    // and distancePerFlight is the assumed distance for each one-way flight

    // Calculate total distance for all one-way flights
    let totalDistance = roundtripFlights * 2 * distancePerFlight;

    return totalDistance;
  }

  // on average per flight
  const averageKilometerage = 500;

  const distanceInKm = calculateTotalDistance(quantity, averageKilometerage);

  let totalEmissions = 0;

  let longFlightEmissionsFactor = 0.23505; // Emission factor for long-haul flights

  totalEmissions = longFlightEmissionsFactor * distanceInKm;

  return totalEmissions;
}

function calculateOtherTransportsEmission(transport, quantity) {
  let totalEmissions = 0;

  const busEmissionFactor = 73;
  const transitRailEmissionFactor = 32;
  const intercityRailEmissionFactor = 20;

  if (transport == "bus") {
    function calculateTotalBusDistance(travelPerWeek, averageDistancePerBusTrip) {
      // Assuming travelPerWeek is the number of bus trips per week
      // and averageDistancePerBusTrip is the average distance for each bus trip

      // Calculate total distance for all bus trips in a week
      let totalBusDistance = travelPerWeek * averageDistancePerBusTrip;

      return totalBusDistance;
    }

    // Example usage with (quantity) bus trips per week and an average distance of 20 kilometers per trip
    let totalBusDistance = calculateTotalBusDistance(quantity, 20);
    let distanceInKm = totalBusDistance;

    totalEmissions = busEmissionFactor * distanceInKm;
  }

  if (transport == "transitRail") {
    function calculateTotalRailDistance(travelPerWeek, averageDistancePerRailTrip) {
      // Assuming travelPerWeek is the number of rail trips per week
      // and averageDistancePerRailTrip is the average distance for each rail trip

      // Calculate total distance for all rail trips in a week
      let totalRailDistance = travelPerWeek * averageDistancePerRailTrip;

      return totalRailDistance;
    }

    // Example usage with 5 rail trips per week and an average distance of 50 kilometers per trip
    let totalRailDistance = calculateTotalRailDistance(quantity, 50);

    let distanceInKm = totalRailDistance;

    totalEmissions = transitRailEmissionFactor * distanceInKm;
  }

  if (transport == "interCityRail") {
    function calculateTotalIntercityRailDistance(travelPerWeek, averageDistancePerIntercityRailTrip) {
      // Assuming travelPerWeek is the number of intercity rail trips per week
      // and averageDistancePerIntercityRailTrip is the average distance for each intercity rail trip

      // Calculate total distance for all intercity rail trips in a week
      let totalIntercityRailDistance = travelPerWeek * averageDistancePerIntercityRailTrip;

      return totalIntercityRailDistance;
    }

    // Example usage with (quantity) intercity rail trips per week and an average distance of 200 kilometers per trip
    let totalIntercityRailDistance = calculateTotalIntercityRailDistance(quantity, 200);

    let distanceInKm = totalIntercityRailDistance;

    totalEmissions = intercityRailEmissionFactor * distanceInKm;
  }

  return totalEmissions;
}

function notHidden(el) {
  return el.offsetParent !== null;
}
