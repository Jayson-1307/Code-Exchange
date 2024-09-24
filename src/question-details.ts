import "./config";
import { url } from "@hboictcloud/api";
import { UserManager } from "./models/userManager";
import { PostManager } from "./models/postManager";
import { User } from "./models/user";
import { Question } from "./models/question";
import { Answer } from "./models/answer";


//create classes to use functions from classes
const userManager: UserManager = new UserManager;
const postManager: PostManager = new PostManager;
//create user object, with logged in user info
let user: User;

//check for question id of this page using id inside the url
const questionID: number = url.getFromQueryString("id");
console.log(questionID);


main();

// Run at startup, used to specify if order is important, call all functions
async function main(): Promise<void> {
    //setupCommon must run first else user stays empty, will cause error
    await setupCommon();
    setupThisPage();
    //load questions on page
    fillingPage();
}

/**
 * changes elements of page, depending if user is logged in or not
 * also loads the data of logged in user trough User class
 */
async function setupCommon(): Promise<void> {
    //toggle none/block html elements if logged in or logged out
    userManager.loggedIn();

    //if loggedin else
    if (userManager.verifyUser()) {
        user = await userManager.setupIfLoggedIn();
    } else {
        userManager.setupIfLoggedOut();
    }
}

/**
 * changes elements of page but only this page
 */
async function setupThisPage(): Promise<void> {
    //listener post answer button
    const postAnswer: HTMLElement = document.getElementById("answerSubmit")!;
    postAnswer?.addEventListener("click", (): void => {
        if (window.confirm("Are you sure about posting your answer?")) {
            //check data, if all correct post answer and redirect user, else show error
            postManager.addAnswer(user.id, questionID);
        }
    });
};

/**
 * runs functions to fill page
 */
async function fillingPage(): Promise<void> {
    const consoleMessage: string = "fillingPage";
    console.log(consoleMessage);
    
    //FIX: if not logged in user.id does not exist
    let loggedinUserID: number;
    if (userManager.verifyUser()) {
        loggedinUserID = user.id;
    } else {
        loggedinUserID = 0;
    }

    //fetch and print question data
    const questions: Question[] | undefined = await postManager.fetchQuestionDeatilPageQuestion(questionID);
    questions?.forEach((question) => {
        question.printQuestionDetailPageQuestion(loggedinUserID);
    });

    //fetch and print answers data
    let currentUserID: number;
    if (user) {
        currentUserID = user.id;
    } else {
        currentUserID = 0;
    }
    const answers: Answer[] | undefined = await postManager.fetchQuestionDetailPageAnswers(questionID, currentUserID);
    answers?.forEach((answer) => {
        answer.printAnswersList(loggedinUserID);
    });
}
