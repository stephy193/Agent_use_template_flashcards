"use strict";

const entryForm = document.getElementById("entry-form");
const symptomsCheckbox = document.getElementById("has-symptoms");
const symptomDetailsGroup = document.getElementById("symptom-details-group");
const symptomDetails = document.getElementById("symptom-details");
const entryDate = document.getElementById("entry-date");
const entryMeal = document.getElementById("entry-meal");
const containsLactoseCheckbox = document.getElementById("contains-lactose");
const entryTableBody = document.getElementById("entry-table-body");

const storageKey = "dairyDiaryEntries";
let entries = loadEntries();

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

    tableRow.appendChild(createTableCell(entry.date));
    tableRow.appendChild(createTableCell(entry.meal));
    tableRow.appendChild(createTableCell(entry.containsLactose ? "Yes" : "No"));
    tableRow.appendChild(createTableCell(entry.hasSymptoms ? "Yes" : "No"));
    tableRow.appendChild(createTableCell(entry.hasSymptoms ? entry.symptomDetails : ""));

    entryTableBody.appendChild(tableRow);
  }
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
renderEntries();