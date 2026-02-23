document.querySelector("#submitBtn").addEventListener("click", gradeQuiz);

let timesTaken = localStorage.getItem("timesTaken");
if (timesTaken === null) {
    document.getElementById("timesTaken").textContent = "You have taken this quiz 0 times."
    localStorage.setItem("timesTaken", 0);
} else {
    document.getElementById("timesTaken").textContent = `You have taken this quiz ${timesTaken} times.`
}
const wrongColor = "red";
const correctColor = "green";
const halfWrongColor = "orange";
shuffleQ1Choices();

function shuffleQ1Choices() {
    let q1Choices = ["font-color", "text-color", "color", "background-color"];
    shuffleArray(q1Choices);

    for (let i of q1Choices) {
        let radioElement = document.createElement("input");
        radioElement.type = "radio";
        radioElement.name = "q1";
        radioElement.value = i;

        let labelElement = document.createElement("label");
        labelElement.textContent = i;

        labelElement.prepend(radioElement);
        console.log(labelElement);

        document.querySelector("#q1Area").append(labelElement);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [ array[i], array[j] ] = [ array[j], array[i] ];
    }
}

function gradeQuiz() {
    let score = 0

    let q1Answer = document.querySelector("input[name=q1]:checked");
    const q2Answer = document.querySelector("#q2Input").value;
    const q3Answer = document.getElementById("q3-container").value;
    const q4Answer = document.getElementById("q4-input").valueAsNumber;
    const q5Answers = document.querySelectorAll('input[name="q5"]');

    const q1Area = document.getElementById("q1Area");
    const q2Area = document.getElementById("q2Area");
    const q3Area = document.getElementById("q3Area");
    const q4Area = document.getElementById("q4Area");
    const q5Area = document.getElementById("q5Area");


    if (q1Answer != null) {
        q1Answer = q1Answer.value;
    }
    if (q1Answer === "color") {
        score += 20;
        q1Area.style.backgroundColor = correctColor;
        q1Area.style.color = "black";
    } else {
        q1Area.style.backgroundColor = wrongColor;
        q1Area.style.color = "white";
    }

    if(q2Answer === "<body>") {
        score+= 20;
        q2Area.style.backgroundColor = correctColor;
        q2Area.style.color = "black";
    } else {
        q2Area.style.backgroundColor = wrongColor;
        q2Area.style.color = "white";
    }

    if (parseInt(q3Answer) > 100) {
        score+= 20;
        q3Area.style.backgroundColor = correctColor;
        q3Area.style.color = "black";
    } else {
        q3Area.style.backgroundColor = wrongColor
        q3Area.style.color = "white";
    }

    if (q4Answer == 91) {
        score+= 20;
        q4Area.style.backgroundColor =  correctColor
        q4Area.style.color = "black";
    } else {
        q4Area.style.backgroundColor = wrongColor
        q4Area.style.color = "white";
    }

    let q5Values = [];
    const q5CorrectAnswers = ["correct1", "correct2", "correct3", "correct4"];
    let q5correctness = 0;

    q5Answers.forEach(q5Answer => {
        if (q5Answer.checked) {
            q5Values.push(q5Answer.value);
        }
    });

    q5CorrectAnswers.forEach(correctAnswer => {
        if (q5Values.includes(correctAnswer)) {
            q5correctness+=5;
        }
    });

    if (q5correctness === 0 ) {
        q5Area.style.backgroundColor = wrongColor;
        q5Area.style.color = "white";
    } else if(q5correctness === 20){
        q5Area.style.backgroundColor = correctColor;
        q5Area.style.color = "black";
    } else {
        q5Area.style.backgroundColor = halfWrongColor;
    }
    score += q5correctness;
    document.getElementById("scoreText").textContent = `Your Total Score is ${score}.`

    if (timesTaken === null) {
        localStorage.setItem("timesTaken", 1);
    } else {
        timesTaken = Number(localStorage.getItem("timesTaken")) + 1;
        localStorage.setItem("timesTaken", timesTaken);
    }

    if (score >= 80) {
        alert(`Congrats, You got ${score}%!`)
    }
    document.getElementById("timesTaken").textContent = `You have taken this quiz ${localStorage.getItem("timesTaken")} times.`
}