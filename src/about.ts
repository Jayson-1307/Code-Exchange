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
// async function setupThisPage(): Promise<void> {

// }



