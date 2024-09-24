//import database functions and connection
import "./config";
//import classes
import { UserManager } from "./models/userManager";

//import functons from classes
const userManager: UserManager = new UserManager;

// check loggin, then redirect to main page
async function start(): Promise<void> {
    document.querySelector(".register-btn")?.addEventListener("click", async () => {

        await userManager.addUser();

    });
};

// start functions on page load
start();
userManager.loggedIn();

