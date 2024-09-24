//import database functions and connection
import "./config";
//import classes
import { UserManager } from "./models/userManager";

//import functons from classes
const userManager: UserManager = new UserManager;

// check loggin, then redirect to main page
async function start(): Promise<void> {
    document.querySelector(".login-btn")?.addEventListener("click", async () => {
        const username: string = (<HTMLInputElement>document.getElementById("username")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;
        userManager.login(username, password);
    });
};

// start functions on page load
start();
userManager.loggedIn();