# Spec: Risk calculator using SCORE2

## Goal (one or two sentences)
A single web page where a patient enters a few routine health values and sees an estimated 10-year cardiovascular risk. It is for awareness, not diagnosis.

## Users
Patients without medical knowledge, using the page on their own."

## Features (numbered, so prompts can refer to them)
F1: Form with 5 input fields (Age, Sex, Systolic Blood Pressure, Total Cholesterol, HDL) and two checkboxes (Smoker, Diabetes) and the buttons "Calculate" and "Reset".
F2: If Diabetes is checked, only show Message: "Not applicable. Please use other methods!"
F3: Calculate the 10-year risk in % from the inputs and using the algorithm in risk-config.json, then show it with a category (low / moderate / high). Show a horizontal risk bar, coloured by category.
F4: "What if" checkboxes: "Stop smoking", "Systolic Blood Pressure < 130 mmHg", "HDL > 55mg/dl", "Total Cholesterol < 190 mg/dl" : shows a second bar with the calculated lower risk in a separate risk bar. 
F5: When "Reset" button is clicked, clear entire page.


## Acceptance criteria (how I know a feature works)
F1: Dropdown menu for Sex. mmHg used for Blood Pressure, mg/dl for Total Cholesterol and HDL. Empty fields cannot be submitted.
Show input fields in 2 columns.
F2: Pop up-message is shown
F3: Show calculated risk in cosole. 

## Out of scope (do NOT build)
- No login, no server, no database
- No frameworks or libraries (no React, no jQuery, no Bootstrap)
- No sound, no animations beyond simple CSS transitions
- No mobile app

## Look & feel
Simple, readable, playful, max width: 800px.