const riskForm = document.querySelector("#risk-form");
const diabetesCheckbox = document.querySelector("#diabetes");
const diabetesDialog = document.querySelector("#diabetes-dialog");
const closeDialogButton = document.querySelector("#close-dialog");
const riskResult = document.querySelector("#risk-result");
const riskValue = document.querySelector("#risk-value");
const riskCategory = document.querySelector("#risk-category");
const riskMarker = document.querySelector("#risk-marker");
let riskConfig = null;

// Load the calculation settings and coefficients from the JSON file.
async function loadRiskConfig() {
    const response = await fetch("risk-config.json");
    riskConfig = await response.json();
}

// Center each input value before applying the SCORE2 coefficients.
function getCenteredValues(values) {
    const algorithm = riskConfig.algorithm;
    const cholesterolMmol = values.totalCholesterol / algorithm.mgdlPerMmol;
    const hdlMmol = values.hdl / algorithm.mgdlPerMmol;

    return {
        age: (values.age - algorithm.centering.age.subtract) / algorithm.centering.age.divideBy,
        systolicBp: (values.systolicBp - algorithm.centering.systolicBp.subtract) / algorithm.centering.systolicBp.divideBy,
        totalCholesterol: (cholesterolMmol - algorithm.centering.totalCholesterol.subtract) / algorithm.centering.totalCholesterol.divideBy,
        hdl: (hdlMmol - algorithm.centering.hdl.subtract) / algorithm.centering.hdl.divideBy
    };
}

// Calculate the calibrated 10-year cardiovascular risk percentage.
function calculateRisk(values) {
    const algorithm = riskConfig.algorithm;
    const sexValues = algorithm[values.sex];
    const centered = getCenteredValues(values);
    const coefficients = sexValues.coefficients;
    const interactions = sexValues.ageInteractions;
    let linearPredictor = 0;

    linearPredictor += coefficients.age * centered.age;
    linearPredictor += coefficients.smoker * Number(values.smoker);
    linearPredictor += coefficients.systolicBp * centered.systolicBp;
    linearPredictor += coefficients.diabetes * Number(values.diabetes);
    linearPredictor += coefficients.totalCholesterol * centered.totalCholesterol;
    linearPredictor += coefficients.hdl * centered.hdl;

    linearPredictor += interactions.smoker * centered.age * Number(values.smoker);
    linearPredictor += interactions.systolicBp * centered.age * centered.systolicBp;
    linearPredictor += interactions.diabetes * centered.age * Number(values.diabetes);
    linearPredictor += interactions.totalCholesterol * centered.age * centered.totalCholesterol;
    linearPredictor += interactions.hdl * centered.age * centered.hdl;

    const uncalibratedRisk = 1 - Math.pow(sexValues.baselineSurvival, Math.exp(linearPredictor));
    const regionScale = algorithm.regionScales[algorithm.region][values.sex];
    const calibratedRisk = 1 - Math.exp(
        -Math.exp(regionScale.scale1 + regionScale.scale2 * Math.log(-Math.log(1 - uncalibratedRisk)))
    );

    return calibratedRisk * 100;
}

// Match a risk percentage to one of the configured categories.
function getRiskCategory(riskPercent) {
    const categories = riskConfig.riskBar.categories;

    for (const category of categories) {
        if (category.upTo === null || riskPercent <= category.upTo) {
            return category;
        }
    }

    return categories[categories.length - 1];
}

// Create the coloured low, moderate, and high areas from the risk settings.
function setRiskBarColors() {
    const riskBar = document.querySelector(".risk-bar");
    const categories = riskConfig.riskBar.categories;
    const maxPercent = riskConfig.riskBar.maxPercent;
    let gradientParts = [];
    let startPercent = 0;

    for (const category of categories) {
        const endPercent = category.upTo === null
            ? maxPercent
            : Math.min(category.upTo, maxPercent);
        const startPosition = (startPercent / maxPercent) * 100;
        const endPosition = (endPercent / maxPercent) * 100;
        const transparentColor = hexToTransparentColor(category.color);

        gradientParts.push(transparentColor + " " + startPosition + "%");
        gradientParts.push(transparentColor + " " + endPosition + "%");
        startPercent = endPercent;
    }

    riskBar.style.background = "linear-gradient(to right, " + gradientParts.join(", ") + ")";
}

// Convert a hex color to a transparent CSS color.
function hexToTransparentColor(hexColor) {
    const red = parseInt(hexColor.substring(1, 3), 16);
    const green = parseInt(hexColor.substring(3, 5), 16);
    const blue = parseInt(hexColor.substring(5, 7), 16);

    return "rgba(" + red + ", " + green + ", " + blue + ", 0.55)";
}

// Fill the risk bar up to the marker and keep the rest transparent.
function setRiskBarFill(riskPercent) {
    const riskBar = document.querySelector(".risk-bar");
    const categories = riskConfig.riskBar.categories;
    const markerPercent = Math.min((riskPercent / riskConfig.riskBar.maxPercent) * 100, 100);
    let gradientParts = [];
    let startPercent = 0;

    for (const category of categories) {
        const endPercent = category.upTo === null
            ? riskConfig.riskBar.maxPercent
            : Math.min(category.upTo, riskConfig.riskBar.maxPercent);
        const startPosition = (startPercent / riskConfig.riskBar.maxPercent) * 100;
        const endPosition = (endPercent / riskConfig.riskBar.maxPercent) * 100;
        const fillStart = startPosition;
        const fillEnd = endPosition;

        if (fillEnd <= markerPercent) {
            gradientParts.push(category.color + " " + fillStart + "%");
            gradientParts.push(category.color + " " + fillEnd + "%");
        } else if (fillStart < markerPercent) {
            gradientParts.push(category.color + " " + fillStart + "%");
            gradientParts.push(category.color + " " + markerPercent + "%");
            gradientParts.push(hexToTransparentColor(category.color) + " " + markerPercent + "%");
            gradientParts.push(hexToTransparentColor(category.color) + " " + fillEnd + "%");
        } else {
            const transparentColor = hexToTransparentColor(category.color);
            gradientParts.push(transparentColor + " " + fillStart + "%");
            gradientParts.push(transparentColor + " " + fillEnd + "%");
        }
        startPercent = endPercent;
    }

    riskBar.style.background = "linear-gradient(to right, " + gradientParts.join(", ") + ")";
}

// Read form inputs and show the result, category, and risk marker.
function showRiskResult() {
    const values = {
        age: Number(document.querySelector("#age").value),
        sex: document.querySelector("#sex").value,
        systolicBp: Number(document.querySelector("#systolic-bp").value),
        totalCholesterol: Number(document.querySelector("#total-cholesterol").value),
        hdl: Number(document.querySelector("#hdl").value),
        smoker: document.querySelector("#smoker").checked,
        diabetes: false
    };
    const riskPercent = calculateRisk(values);
    const roundedRisk = riskPercent.toFixed(riskConfig.algorithm.roundDecimals);
    const category = getRiskCategory(riskPercent);
    const markerPercent = Math.min((riskPercent / riskConfig.riskBar.maxPercent) * 100, 100);

    riskValue.textContent = roundedRisk + " %";
    riskCategory.textContent = "Category: " + category.label;
    riskMarker.style.left = markerPercent + "%";
    riskMarker.style.backgroundColor = "#fff";
    setRiskBarFill(riskPercent);
    riskMarker.parentElement.setAttribute(
        "aria-label",
        "Estimated 10-year cardiovascular risk: " + roundedRisk + " percent, " + category.label
    );
    riskResult.hidden = false;
    console.log("Calculated 10-year cardiovascular risk:", roundedRisk + "%");
}

// Prevent the form from reloading the page.
function handleFormSubmit(event) {
    event.preventDefault();

    if (diabetesCheckbox.checked) {
        showDiabetesMessage();
    } else if (riskConfig) {
        showRiskResult();
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
loadRiskConfig().then(function () {
    setRiskBarColors();
});
