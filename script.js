const riskForm = document.querySelector("#risk-form");

// Prevent a valid form from reloading the page before calculation is implemented.
function stopFormReload(event) {
    event.preventDefault();
}

riskForm.addEventListener("submit", stopFormReload);