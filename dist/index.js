"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let questionsCount = document.querySelector(".quiz-app .question span ");
let quizBody = document.querySelector(".quiz-body ");
let rate = document.querySelector(".rate ");
let quizFooter = document.querySelector(".quiz-footer ");
let bullets = document.querySelector(".quiz-app .bullets");
let questionContent = document.querySelector(".quiz-app .quiz-body .question h3");
let ulElement = document.querySelector("ul.answers");
let submitBtn = document.querySelector("button");
let qCount = 0;
let questionsData = [];
let rightAnswer;
function questions() {
    return __awaiter(this, void 0, void 0, function* () {
        let fetchQuestions = yield fetch("src/questions.json");
        var questions = yield fetchQuestions.json();
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
    });
}
questions();
function createBullets(num) {
    questionsCount.innerHTML = num;
    if (!bullets.children.length) {
        for (let i = 0; i < num; i++) {
            let bullet = document.createElement("span");
            bullets.appendChild(bullet);
            i === 0 ? (bullet.className = "active") : null;
        }
    }
}
// add questions to page .
function addQuestions(question, questionsCount) {
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
            let optionNum = arr[index];
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
let totalRightAnswers = 0;
let submitBtnClicked = false;
submitBtn.onclick = function () {
    submitBtnClicked = true;
    checkAnswer(rightAnswer, questionsData.length);
    // First check if any answer is selected
    let answers = document.getElementsByName("answer");
    let isAnswered = false;
    let selectedAnswer = "";
    for (let index = 0; index < answers.length; index++) {
        if (answers[index].checked) {
            isAnswered = true;
            selectedAnswer =
                answers[index].dataset.answer || "";
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
    }
    else {
        submitBtn.disabled = true;
        submitBtn.style.cursor = "no-drop";
        submitBtn.innerHTML = "No More Questions";
        showResult();
    }
};
function checkAnswer(rightAnswer, questionsCount) {
    let answers = document.getElementsByName("answer");
    let answered = false;
    for (let index = 0; index < answers.length; index++) {
        if (answers[index].checked) {
            answered = true;
            // console.log(
            //   "The checked input =>",
            //   (answers[index] as HTMLInputElement).dataset.answer
            // );
            // Compare with right answer
            if (answers[index].dataset.answer === rightAnswer) {
                // console.log("Correct answer!");
                totalRightAnswers++;
                // console.log("total right answers is :", totalRightAnswers);
            }
            else {
                totalRightAnswers > 0 ? totalRightAnswers-- : null;
                // console.log("Wrong answer!");
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
let countdownInterval;
function countDown() {
    let time = document.querySelector(".time");
    // Clear any existing interval first
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    let totalSeconds = 60;
    // Set initial time display
    let min = Math.floor(totalSeconds / 60);
    let sec = totalSeconds % 60;
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
        }
        else {
            time.style.color = "unset";
        }
        if (totalSeconds === 0) {
            clearInterval(countdownInterval);
            submitBtn.click();
        }
    }, 1000);
}
