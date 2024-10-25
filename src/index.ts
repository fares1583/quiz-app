let questionsCount: HTMLDivElement = document.querySelector(
  ".quiz-app .question span "
)!;
let quizBody: HTMLDivElement = document.querySelector(".quiz-body ")!;
let rate: HTMLDivElement = document.querySelector(".rate ")!;
let quizFooter: HTMLDivElement = document.querySelector(".quiz-footer ")!;
let bullets: HTMLDivElement = document.querySelector(".quiz-app .bullets")!;
let questionContent: HTMLDivElement = document.querySelector(
  ".quiz-app .quiz-body .question h3"
)!;
let ulElement: HTMLUListElement = document.querySelector("ul.answers")!;
let submitBtn: HTMLButtonElement = document.querySelector("button")!;

let qCount: number = 0;
let questionsData: any[] = [];

let rightAnswer: string;

async function questions() {
  let fetchQuestions = await fetch("src/questions.json");

  var questions = await fetchQuestions.json();

  // console.log(
  //   "the array of questions is form async function questions()",
  //   questions.questions
  // );

  questionsData = questions.questions;

  // make question count  equal to the number of questions in the json file
  createBullets(questions.questions.length);

  // passing data to add question to the page
  addQuestions(questions.questions[qCount], questions.questions.length);
  countDown();
}
questions();

function createBullets(num: any) {
  questionsCount.innerHTML = num;
  if (!bullets.children.length) {
    for (let i: number = 0; i < num; i++) {
      let bullet: HTMLSpanElement = document.createElement("span");
      bullets.appendChild(bullet);

      i === 0 ? (bullet.className = "active") : null;
    }
  }
}

// add questions to page .

function addQuestions(question: any, questionsCount: number): void {
  questionContent.innerHTML = `${question.id}-${question.question}`;

  rightAnswer = question.answer;
  rightAnswer = question.options[rightAnswer];

  // create the answers

  if (!ulElement.children.length) {
    const options = [
      { id: "option1" },
      { id: "option2" },
      { id: "option3" },
      { id: "option4" },
    ];

    // Loop through the options array and create the radio inputs and labels
    options.forEach((option, index) => {
      let arr = ["a", "b", "c", "d"];

      let optionNum: string = arr[index];
      // Create list item

      const li = document.createElement("li");

      // Create radio input
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.id = option.id;
      input.dataset.answer = question.options[optionNum];

      li.addEventListener("click", function () {
        input.checked = true;
      });
      // make the first radio button checked by default
      if (input.id === "option1") {
        input.checked = true;
      }

      // Create label
      const label = document.createElement("label");
      label.setAttribute("for", option.id);

      label.textContent = question.options[optionNum];

      // Append input and label to the list item
      li.appendChild(input);
      li.appendChild(label);

      // Append list item to the ul element
      ulElement.appendChild(li);
    });
  }
}

let totalRightAnswers: number = 0;

let submitBtnClicked = false;

submitBtn.onclick = function () {
  submitBtnClicked = true;

  checkAnswer(rightAnswer, questionsData.length);

  // First check if any answer is selected
  let answers = document.getElementsByName("answer");
  let isAnswered = false;
  let selectedAnswer = "";

  for (let index = 0; index < answers.length; index++) {
    if ((answers[index] as HTMLInputElement).checked) {
      isAnswered = true;
      selectedAnswer =
        (answers[index] as HTMLInputElement).dataset.answer || "";
      break;
    }
  }

  // Only proceed if an answer was selected
  if (!isAnswered) {
    alert("Please select an answer before proceeding!");
    return;
  }

  // console.log("Selected answer:", selectedAnswer);
  // console.log("The right answer is:", rightAnswer);

  // Now proceed with the rest of your logic

  qCount++;

  if (qCount < questionsData.length) {
    countDown();
    ulElement.innerHTML = "";
    // bullets.innerHTML = "";

    addQuestions(questionsData[qCount], questionsData.length);
    createBullets(questionsData.length);

    // Array.from(bullets.children).forEach((ele) => (ele.className = ""));
    bullets.children[qCount].classList.add("active");
  } else {
    submitBtn.disabled = true;
    submitBtn.style.cursor = "no-drop";
    submitBtn.innerHTML = "No More Questions";
    showResult();
  }
};

function checkAnswer(rightAnswer: string, questionsCount: number) {
  let answers = document.getElementsByName("answer");
  let answered = false;

  for (let index = 0; index < answers.length; index++) {
    if ((answers[index] as HTMLInputElement).checked) {
      answered = true;
      // console.log(
      //   "The checked input =>",
      //   (answers[index] as HTMLInputElement).dataset.answer
      // );

      // Compare with right answer
      if ((answers[index] as HTMLInputElement).dataset.answer === rightAnswer) {
        // console.log("Correct answer!");
        totalRightAnswers++;
        // console.log("total right answers is :", totalRightAnswers);
      }
      break;
    }
  }
}

function showResult() {
  submitBtn.remove();
  quizBody.remove();
  quizFooter.remove();

  rate.innerHTML = `<div style="background-color: #cad2c5;
    padding: 15px;
    border-radius: 6px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #0c7a1c;
    user-select: none;
    cursor: pointer;">You Got ${totalRightAnswers} Out Of  ${questionsData.length}  Questions Right! </div>`;
}

// count down handling

let countdownInterval: any;
function countDown() {
  let time: HTMLDivElement = document.querySelector(".time")!;

  // Clear any existing interval first
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  let totalSeconds = 60;

  // Set initial time display
  let min: number | string = Math.floor(totalSeconds / 60);
  let sec: number | string = totalSeconds % 60;
  sec = sec < 10 ? "0" + sec : sec;
  min = min < 10 ? "0" + min : min;
  time.innerHTML = `${min}:${sec}`;

  countdownInterval = setInterval(() => {
    totalSeconds--;

    min = Math.floor(totalSeconds / 60);
    sec = totalSeconds % 60;

    sec = sec < 10 ? "0" + sec : sec;
    min = min < 10 ? "0" + min : min;

    time.innerHTML = `${min}:${sec}`;

    if (totalSeconds <= 5) {
      time.style.color = "red";
    } else {
      time.style.color = "unset";
    }

    if (totalSeconds === 0) {
      clearInterval(countdownInterval);
      submitBtn.click();
    }
  }, 1000);
}
