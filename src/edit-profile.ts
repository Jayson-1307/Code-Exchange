import "./config";
import { url, session } from "@hboictcloud/api";
import { UserManager } from "./models/userManager";
import { User } from "./models/user";
import { Profile } from "./models/profile";

//create classes to use functions from classes
const userManager: UserManager = new UserManager;

const userID: number = session.get("user");
let profile: Profile = await userManager.createProfileObject(userID); 
console.log(userID);

console.log(profile);

const deleteButton: HTMLElement = document.getElementById("deleteProfileButton")!;
deleteButton.addEventListener("click", () => {
    if(confirm("Are you sure about deleting your account?") === true) {
        profile.delete();
        alert("Your account and all related data is deleted");
        session.remove("user");
        url.redirect("/index.html");
    }
})


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

console.log(userID);

document.getElementById("uploadButton")?.addEventListener("click", async () => {
    const fileInput: HTMLInputElement | null = document.getElementById(
        "pictureUpload"
    ) as HTMLInputElement;
  
    const preview: HTMLDivElement | null = document.getElementById(
        "preview"
    ) as HTMLDivElement;
  
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file: File = fileInput.files[0];
  
        if (file.type.match(/^image\//)) {
            const reader: FileReader = new FileReader();
  
            reader.onload = async function (event: ProgressEvent<FileReader>): Promise<void> {
                if (event.target) {
                    const img: HTMLImageElement = document.createElement("img");
                    img.src = event.target.result as string;
                    img.width = 200; // Adjust width as needed
                    img.height = 200; // Adjust height as needed
        
                    if (preview) {
                        preview.innerHTML = "";
                        preview.appendChild(img);
                    }
                }
            };
  
            reader.readAsDataURL(file);
        } else {
            alert("Please upload an image file.");
        }
    } else {
        alert("Please select a file to upload.");
    }
});


document.getElementById("editProfileButton")?.addEventListener("click", async ()=> {
    profile.updateProfile();
    
});


