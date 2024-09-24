import "./config";
import { User } from "./models/user";
import { UserManager } from "./models/userManager";
import { PostManager } from "./models/postManager";
import { Question } from "./models/question";

//create object to use class functions
const userManager: UserManager = new UserManager;
const postManager: PostManager = new PostManager;

//create user as global object
let user: User;



main();

// Run at startup, used to specify if order is important, call all functions
async function main(): Promise<void> {
    //setupCommon must run first else user stays empty, will cause error
    await setupCommon();
    setupThisPage();
    //load questions on page
    const questions: Question[] | undefined = await postManager.fetchIndexPageQuestionList();
    questions?.forEach((question) => {
        question.printQuestionsList();
    });
}


/**
 * starts when paige is loaded, this is used for every page
 * change pagefor logged in and logged out
 */
async function setupCommon(): Promise<void> {
    //toggle none/block html elements if logged in or logged out
    userManager.loggedIn();

    //if loggedin else
    if (userManager.verifyUser()) {
        //loading User, logout button (await because fetching from database)
        user = await userManager.setupIfLoggedIn();
    } else {
        userManager.setupIfLoggedOut();
    }
}


/**
 * starts after setupCommon, is used to change depending on logged in or not
 */
async function setupThisPage(): Promise<void> {
    if (userManager.verifyUser()) {


        //welcome message, depending on preposition
        const welcomeMessage: string = "Welcome, ";
        const userNames: string = user.userNames;
        let nameMessage: string;
        //check if undefined, then false
        nameMessage = `you are logged in ${userNames}`;

        document.querySelector(".welcome")!.innerHTML = welcomeMessage;
        document.querySelector(".name")!.innerHTML = nameMessage;
    } else {
        //welcome message
        const welcomeMessage: string = "Welcome to our site";
        document.querySelector(".welcome")!.innerHTML = welcomeMessage;
    }

}




// // Code die de searchbar laat zien
// const searchButton: HTMLElement | null = document.getElementById("searchButton");
// const searchField: HTMLElement | null = document.getElementById("searchField");

// if (searchButton && searchField) {
//   searchButton.addEventListener("click", () => {
//     if (searchField.classList.contains("active")) {
//       searchField.classList.remove("active");
//     } else {
//       searchField.classList.add("active");
//     }
//   });
// }
