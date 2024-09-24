import "./config";
import { url, session } from "@hboictcloud/api";
import { UserManager } from "./models/userManager";
import { PostManager } from "./models/postManager";
import { User } from "./models/user";
import { Profile } from "./models/profile";

//create classes to use functions from classes
const userManager: UserManager = new UserManager;
const postManager: PostManager = new PostManager;
const userID: number = session.get("user");
const userIDForProfile: number = url.getFromQueryString("id");
let profile: Profile = await userManager.createProfileObject(userIDForProfile); 


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


function test():Promise<void> | any{
    profile.toString();

    profile.fillProfileContent();
}
test();

