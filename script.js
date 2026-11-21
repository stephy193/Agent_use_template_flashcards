"use strict";

const entryForm = document.getElementById("entry-form");
const symptomsCheckbox = document.getElementById("has-symptoms");
const symptomDetailsGroup = document.getElementById("symptom-details-group");
const symptomDetails = document.getElementById("symptom-details");
const entryDate = document.getElementById("entry-date");
const entryMeal = document.getElementById("entry-meal");
const containsLactoseCheckbox = document.getElementById("contains-lactose");
const entryTableBody = document.getElementById("entry-table-body");
const deleteSelectedButton = document.getElementById("delete-selected-button");
const lactoseChartCanvas = document.getElementById("lactose-chart");

const storageKey = "dairyDiaryEntries";
let entries = loadEntries();
let lactoseChart = null;

// This shows symptom details only when symptoms are selected.
function updateSymptomDetails() {
  if (symptomsCheckbox.checked) {
    symptomDetailsGroup.classList.add("visible");
    symptomDetails.required = true;
  } else {
    symptomDetailsGroup.classList.remove("visible");
    symptomDetails.required = false;
    symptomDetails.value = "";
  }
}

// This loads saved entries from localStorage.
function loadEntries() {
  const savedEntries = localStorage.getItem(storageKey);

  if (savedEntries === null) {
    return [];
  }

  try {
    const parsedEntries = JSON.parse(savedEntries);
    return Array.isArray(parsedEntries) ? parsedEntries : [];
  } catch (error) {
    return [];
  }
}

// This saves all entries to localStorage.
function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

// This creates one table cell for an entry.
function createTableCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

// This renders entries with the newest date first.
function renderEntries() {
  entryTableBody.textContent = "";
  entries.sort(function (firstEntry, secondEntry) {
    return secondEntry.date.localeCompare(firstEntry.date);
  });

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const tableRow = document.createElement("tr");

    const selectCell = document.createElement("td");
    const selectCheckbox = document.createElement("input");
    selectCheckbox.type = "checkbox";
    selectCheckbox.classList.add("entry-select");
    selectCheckbox.dataset.entryId = entry.id;
    selectCell.appendChild(selectCheckbox);
    tableRow.appendChild(selectCell);

    tableRow.appendChild(createTableCell(entry.date));
    tableRow.appendChild(createTableCell(entry.meal));
    tableRow.appendChild(createTableCell(entry.containsLactose ? "Yes" : "No"));
    tableRow.appendChild(createTableCell(entry.hasSymptoms ? "Yes" : "No"));
    tableRow.appendChild(createTableCell(entry.hasSymptoms ? entry.symptomDetails : ""));

    entryTableBody.appendChild(tableRow);
  }

  updateDeleteSelectedButton();
  countLactoseResults();
}

// This enables the delete button when entries are selected.
function updateDeleteSelectedButton() {
  const selectedCheckboxes = document.querySelectorAll(".entry-select:checked");
  deleteSelectedButton.disabled = selectedCheckboxes.length === 0;
}

// This counts lactose-containing meals and their symptom results.
function countLactoseResults() {
  let lactoseContainingMeals = 0;
  let positive = 0;
  let negative = 0;

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].containsLactose) {
      lactoseContainingMeals++;

      if (entries[i].hasSymptoms) {
        positive++;
      } else {
        negative++;
      }
    }
  }

  console.log("Lactose-containing meals:", lactoseContainingMeals);
  console.log("positive:", positive);
  console.log("negative:", negative);
  updateLactoseChart(positive, negative);
}

// This redraws the pie chart with the latest positive and negative counts.
function updateLactoseChart(positive, negative) {
  if (typeof Chart === "undefined") {
    return;
  }

  const chartData = {
    labels: ["Positive", "Negative"],
    datasets: [{
      data: [positive, negative],
      backgroundColor: ["#ffa500", "#add8e6"],
      borderColor: ["#ffffff", "#ffffff"]
    }]
  };

  if (lactoseChart === null) {
    lactoseChart = new Chart(lactoseChartCanvas, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  } else {
    lactoseChart.data = chartData;
    lactoseChart.update();
  }
}

// This removes all selected entries and updates localStorage.
function deleteSelectedEntries() {
  const selectedCheckboxes = document.querySelectorAll(".entry-select:checked");
  const selectedIds = [];

  for (let i = 0; i < selectedCheckboxes.length; i++) {
    selectedIds.push(Number(selectedCheckboxes[i].dataset.entryId));
  }

  entries = entries.filter(function (entry) {
    return !selectedIds.includes(entry.id);
  });

  saveEntries();
  renderEntries();
}

// This creates an entry and clears the form after submission.
function addEntry(event) {
  event.preventDefault();

  if (!entryForm.checkValidity()) {
    entryForm.reportValidity();
    return;
  }

  const newEntry = {
    id: Date.now(),
    date: entryDate.value,
    meal: entryMeal.value.trim(),
    containsLactose: containsLactoseCheckbox.checked,
    hasSymptoms: symptomsCheckbox.checked,
    symptomDetails: symptomsCheckbox.checked ? symptomDetails.value.trim() : ""
  };

  entries.push(newEntry);
  saveEntries();
  renderEntries();

  entryForm.reset();
  updateSymptomDetails();
}

symptomsCheckbox.addEventListener("change", updateSymptomDetails);
entryForm.addEventListener("submit", addEntry);
entryTableBody.addEventListener("change", updateDeleteSelectedButton);
deleteSelectedButton.addEventListener("click", deleteSelectedEntries);
renderEntries();