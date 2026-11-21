"use strict";

const entryForm = document.getElementById("entry-form");
const symptomsCheckbox = document.getElementById("has-symptoms");
const symptomDetailsGroup = document.getElementById("symptom-details-group");
const symptomDetails = document.getElementById("symptom-details");

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

// This creates an entry and clears the form after submission.
function addEntry(event) {
  event.preventDefault();

  if (!entryForm.checkValidity()) {
    entryForm.reportValidity();
    return;
  }

  entryForm.reset();
  updateSymptomDetails();
}

symptomsCheckbox.addEventListener("change", updateSymptomDetails);
entryForm.addEventListener("submit", addEntry);