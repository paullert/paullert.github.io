// HTML Vars
let UI = {
    firstName: document.querySelector('input[name="fName"]'),
    lastName: document.querySelector('input[name="lName"]'),
    state: document.getElementById("state"),
    username: document.getElementById("username"),
    county: document.getElementById("county"),
    suggPass: document.getElementById("suggestedPwd"),
    gender: document.querySelector('input[name="gender"]'),
    zip: document.getElementById("zip"),
    city: document.getElementById("city"),
    lat: document.getElementById("latitude"),
    lng: document.getElementById("longitude"),
    signUp: document.getElementById("signupForm"),
    password1:document.getElementById("password1"),
    password2: document.getElementById("password2"),

}

let FDBK = {
    firstName: document.getElementById("firstNameFeedback"),
    lastName: document.getElementById("lastNameFeedback"),
    gender: document.getElementById("genderFeedback"),
    zip: document.getElementById("zipFeedback"),
    state: document.getElementById("stateFeedback"),
    county: document.getElementById("countyFeedback"),
    username: document.getElementById("usernameFeedback"),
    password1: document.getElementById("password1Feedback"),
    password2: document.getElementById("password2Feedback")
}

// Listeners
UI.zip.addEventListener("change", displayCity);
UI.state.addEventListener("change", displayCounties);
UI.username.addEventListener("change", checkUsername);
UI.password1.addEventListener("click", generatePassword);
UI.signUp.addEventListener("submit", function (event) {
    validateForm(event);
});

let userNameAvailable;
displayStates();

async function displayCity() {
    // alert(document.querySelector("#zip").value);
    console.log("Function Display city");
    let zipCode = UI.zip.value;
    if (zipCode.length === 0) {
        FDBK.zip.innerHTML = "City not found";
        return;
    }

    let zipAPI = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(zipAPI);
    let data = await response.json();
    console.log(data);
    if (!data) {
        FDBK.zip.innerHTML = "City not found";
        return;
    } else {
        FDBK.zip.innerHTML = "";
    }

    UI.city.innerHTML = data.city;
    UI.lat.innerHTML = data.latitude;
    UI.lng.innerHTML = data.longitude;
}

async function displayStates() {
    let statesAPI = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(statesAPI);
    let data = await response.json();
    console.log(data);
    for (const retrieve of data) {
        // UI.state.innerHTML += '<option value="${retrieve.usps}">${retrieve.state}</option>';
        let newOption = document.createElement("option");
        newOption.textContent = retrieve.state;
        newOption.value = retrieve.usps;
        UI.state.appendChild(newOption);
    }
}

async function displayCounties(){
    UI.county.innerHTML = "<option> Select County </option>";
    let state = UI.state.value;
    let countiesAPI = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(countiesAPI);
    let data = await response.json();
    console.log(data);
    for (const element of data) {
        let newOption = document.createElement("option");
        newOption.innerHTML = element.county;
        // newOption.value = element.usps;
        UI.county.appendChild(newOption);
    }
}

async function checkUsername() {
    let username = UI.username.value;
    let usernamesAPI = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(usernamesAPI);
    let data = await response.json();
    console.log(data);
    userNameAvailable = data.available;
    if(userNameAvailable) {
        FDBK.username.innerHTML = `${username} is Available`;
        FDBK.username.className = "text-success";
    } else {
        FDBK.username.innerHTML = `${username} is not available`;
        FDBK.username.className = "text-danger";
    }
}

async function generatePassword() {
    const pwdLength = 10;
    let passwordAPI = `https://csumb.space/api/suggestedPassword.php?length=${pwdLength}`;
    let response = await fetch(passwordAPI);
    let data = await response.json();
    UI.suggPass.innerHTML = `Suggested Password: ${data.password}`;
}

function validateForm(e) {
    let isValid = true;
    let firstName = UI.firstName.value;
    let lastName = UI.lastName.value;
    let gender = UI.gender.value;
    let zipCode = UI.zip.value;
    let state = UI.state.value;
    let county = UI.county.value;
    let username = UI.username.value;
    let password = UI.password1.value;
    let passwordVerify = UI.password2.value;

    // Checks First Name Entry
    if(firstName.length === 0) {
        FDBK.firstName.innerHTML = "Enter a first name";
        isValid = false;
    } else {
        FDBK.firstName.innerHTML = "";
    }

    // Checks Last Name Entry
    if(lastName.length === 0) {
        FDBK.lastName.innerHTML = "Enter a last name";
        isValid = false;
    } else {
        FDBK.lastName.innerHTML = "";
    }

    // Checks Gender Entry
    if(gender === null) {
        FDBK.gender.innerHTML = "Select a Gender";
        isValid = false;
    } else {
        FDBK.gender.innerHTML = "";
    }

    // Checks Zipcode Entry
    if(zipCode.length === 0) {
        FDBK.zip.innerHTML = "Enter a zip code";
        isValid = false;
    } else {
        FDBK.zip.innerHTML = "";
    }
    // Checks State Entry
    console.log(state)
    if(state === "Select One") {

        FDBK.state.innerHTML = "Select a State";
        isValid = false;
    } else {
        FDBK.state.innerHTML = "";
    }
    // Checks County Entry
    if (county === "Select County") {
        FDBK.county.innerHTML = "Select a County";
        isValid = false;
    } else {
        FDBK.county.innerHTML = "";
    }

    // Checks Username Entry
    FDBK.username.className = "text-danger";
    if(username.length === 0) {
        FDBK.username.innerHTML = "Enter a Username";
        isValid = false;
    } else if(username.length < 3) {
        FDBK.username.innerHTML = "Username must be 3 characters or more";
        isValid = false;
    } else if(!userNameAvailable) {
        FDBK.username.innerHTML = `${username} is not available`;
        isValid = false;
    }
    else {
        FDBK.username.innerHTML = `${username} is Available`;
        FDBK.username.className = "text-success";
    }

    // Checks password entry
    if(password.length === 0) {
        FDBK.password1.innerHTML = "Password Required";
        isValid = false;
    } else if(passwordVerify.length === 0) {
        FDBK.password1.innerHTML = "Retype Password in second box";
        isValid = false;
    } else if(password.length < 6){
        FDBK.password1.innerHTML = "Password Must Be 6 Characters";
        isValid = false;
    } else if(passwordVerify !== password){
        FDBK.password1.innerHTML = "Passwords do not match";
        isValid = false;
    } else {
        FDBK.password1.innerHTML = "";
    }

    if(!isValid) {
        e.preventDefault();
    }
}