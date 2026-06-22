// DOM Elements
const elements = {
    form: document.getElementById("checkInForm"),
    nameInput: document.getElementById("attendeeName"),
    teamSelect: document.getElementById("teamSelect"),
    greeting: document.getElementById("greeting"),
    attendees: document.getElementById("attendeeCount"),
    progressBar: document.getElementById("progressBar")
};

let maxCount = 50;

let attendanceData = {
    count: 0,
    teams: {
        water: [],
        zero: [],
        power: []
    }
};

// Load saved data
const savedData = localStorage.getItem("attendanceData");

if (savedData) {
    attendanceData = JSON.parse(savedData);
}

function saveAttendance() {
    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}

function renderAttendance() {
    elements.attendees.textContent = attendanceData.count;

    const percentage = Math.round((attendanceData.count / maxCount) * 100) + "%";
    elements.progressBar.style.width = percentage;

    Object.keys(attendanceData.teams).forEach(function (team) {
        const teamMembers = attendanceData.teams[team];

        const teamCounter = document.getElementById(team + "Count");
        teamCounter.textContent = teamMembers.length;

        const list = document.querySelector(`.${team} ul`);
        list.innerHTML = "";

        teamMembers.forEach(function (name) {
            const li = document.createElement("li");
            li.textContent = name;
            list.appendChild(li);
        });
    });
}

elements.form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = elements.nameInput.value;
    const team = elements.teamSelect.value;
    const teamName = elements.teamSelect.selectedOptions[0].text;

    attendanceData.count++;
    attendanceData.teams[team].push(name);

    saveAttendance();
    renderAttendance();

    elements.greeting.textContent = `Welcome ${name} from ${teamName}`;
    elements.greeting.style.display = "block";

    // Check if Maxed
    if (attendanceData.count === maxCount) {
        document.getElementById("checkInBtn").disabled = true;
        elements.greeting.innerHTML += "<br>🎊 Max Attendees Reached 🎉"
        window.confetti();
    }

    elements.form.reset();
});

renderAttendance();