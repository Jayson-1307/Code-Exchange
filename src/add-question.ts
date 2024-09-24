import "./config";
import { url } from "@hboictcloud/api";
import { User } from "./models/user";
import { UserManager } from "./models/userManager";
import { PostManager } from "./models/postManager";

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
}

/**
 * starts when paige is loaded, this is used for every page
 * change page for logged in and logged out
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
        //listener for post question button, postmnanager will check data and error's, then add to database and return questionID
        document.querySelector(".post-question-button")!.addEventListener("click", async () => {
            const consoleMessage: string = "post-question-button";
            console.log(consoleMessage);
            //if successful returns questionID number, else empty array
            const questionID: any = await postManager.addQuestion(user.id);
            console.log(questionID);
            //if not bigger than 0, something went wrong.
            if (questionID > 0) {
                console.log("has questionID");
                const alertMessage: string = "Your question has been posted";
                const confirmationMessage: string = "Are you sure about posting your question?";
                if (window.confirm(confirmationMessage)) {
                    //check data, if all correct post answer and redirect user, else show error
                    postManager.addAnswer(user.id, questionID);
                    //infrom user question is posted
                    alert(alertMessage);
                    //somehow load question page for questionID, using url.redirect("/.......html")
                    url.redirect("/question-detail.html", { id: questionID });
                }
            }
        });
    } else {
        //cant be on this page if not logged in
        alert("please login to post a question");
        url.redirect("/login.html");
    }
}



