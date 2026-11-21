const riskForm = document.querySelector("#risk-form");
const diabetesCheckbox = document.querySelector("#diabetes");
const diabetesDialog = document.querySelector("#diabetes-dialog");
const closeDialogButton = document.querySelector("#close-dialog");

// Prevent the form from reloading the page.
function handleFormSubmit(event) {
    event.preventDefault();

    if (diabetesCheckbox.checked) {
        showDiabetesMessage();
    }
}

// Show a message when diabetes is selected.
function showDiabetesMessage() {
    if (!diabetesDialog.open) {
        diabetesDialog.showModal();
    }
}

// Show the diabetes message as soon as the checkbox is checked.
function handleDiabetesChange() {
    if (diabetesCheckbox.checked) {
        showDiabetesMessage();
    }
}

// Close the diabetes message dialog.
function closeDiabetesMessage() {
    diabetesDialog.close();
}

riskForm.addEventListener("submit", handleFormSubmit);
diabetesCheckbox.addEventListener("change", handleDiabetesChange);
closeDialogButton.addEventListener("click", closeDiabetesMessage);
