import "./config";
import { UserManager } from "./models/userManager";
import { PostManager } from "./models/postManager";
import { User } from "./models/user";
import { Question } from "./models/question";

//create classes to use functions from classes
const userManager: UserManager = new UserManager();
const postManager: PostManager = new PostManager();

//create user as global object
let user: User;

main();

// Run at startup, used to specify if order is important, call all functions
async function main(): Promise<void> {
    //setupCommon must run first else user stays empty, will cause error
    await setupCommon();
}

let currentPage: number = 1;
let offset: number = 10;

let alertcontrole :  boolean = true;

/**
 * Loads the questions
 */
async function loadQuestions():Promise<undefined> {
    const questions: Question[] | undefined = await postManager.fetchQuestionsPageQuestionsList(currentPage, offset);
    console.log(questions);

    questions?.forEach((question) => {
        question.printQuestionsList();
    });

    if (questions === undefined){
        return
    }
    if (questions.length < 10) {
        alert("maximum questions reached"); 
        alertcontrole = false; 
    } 

    
}

loadQuestions();

/**
 * dynamically loads in 10 items at a time
 */
window.addEventListener("scroll", async () => {
    // Check if user has scrolled to the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (alertcontrole) {
            currentPage++;
            console.log(currentPage);
            await loadQuestions();
        }
    }
});

/**
 * activates when the filter is used
 */
const sortSelect: HTMLSelectElement | null = document.getElementById("submitFilters") as HTMLSelectElement;
sortSelect.addEventListener('click', async function():Promise<undefined> {
    currentPage = 1;
    offset = 10;
    alertcontrole = true;
    postManager.rebuildQuestionOverview(); 
    loadQuestions();
});



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

