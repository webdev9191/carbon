// GRAPHS

function gramsToTons(input) {
  const grams = parseFloat(input);

  if (isNaN(grams)) {
    return "Invalid input. Please enter a numeric value.";
  }

  const tons = grams / 1000000;
  return tons;
}

const carbon_footprint = localStorage.getItem("carbon_footprint");
const footprintInTons = gramsToTons(carbon_footprint);
const fixedTo2Footprint = footprintInTons.toFixed(1);

const graph_header = document.getElementById("graph_header");
graph_header.innerHTML = `Your footprint is ${fixedTo2Footprint} tons of CO₂ per year.`;

const youGraph = document.querySelector(".graph3");

youGraph.innerHTML = fixedTo2Footprint;

// Assuming 100% is equivalent to 30vw
const baseVW = 30;

// Calculate the value in vw based on fixedTo2Footprint
const valueInVW = (fixedTo2Footprint / 27.5) * baseVW;

// Check if the calculated value exceeds 30vw
let finalWidth = valueInVW > baseVW ? `${baseVW}vw` : `${valueInVW}vw`;

if (valueInVW <= 2) {
  finalWidth = `3vw`;
}

if (valueInVW == 0) {
  finalWidth = "0";
}

youGraph.style.width = finalWidth;

// CHARTS
let MAX_HEIGHT = 15; // vw

const chart1 = document.querySelector(".chart1");
const chart2 = document.querySelector(".chart2");
const chart3 = document.querySelector(".chart3");
const chart4 = document.querySelector(".chart4");

// Calculate the value in vw based on fixedTo2Footprint
const heightValueInVW = (fixedTo2Footprint / 22.5) * MAX_HEIGHT;

const heightFinalWidth = heightValueInVW > MAX_HEIGHT ? `${MAX_HEIGHT}vw` : `${heightValueInVW}`;
chart1.style.height = `${heightFinalWidth}vw`;
chart2.style.height = `${heightFinalWidth / 1.5}vw`;
chart3.style.height = `${heightFinalWidth / 2.5}vw`;
chart4.style.height = `${heightFinalWidth / 5}vw`;

const difference = heightFinalWidth - heightFinalWidth / 1.5;

const graph_header_down = document.getElementById("graph_header_down");
graph_header_down.innerHTML = `Offsetting your emissions has ${difference.toFixed(1)}x the immediate impact of driving an electric car.`;
