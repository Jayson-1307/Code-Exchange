import { api, session, url } from "@hboictcloud/api";
import { User } from "./user";
import { Profile } from "./profile";

/**
 * this is used to manage user related operations, such as user creation, login, logout, and porfile creation.
 * it interact with the database through an API and using sessions for user authentication.
 */
export class UserManager {
    /**
     * this method adds a new user to the databse, including user details and profile information.
     * it validates the input, displays error messages, and redirect the user upon succesful registration.
     * @returns nothing
     */
    public async addUser(): Promise<void> {
        const consoleMessage: string = "addUser";
        console.log(consoleMessage);
        const errorBlock: HTMLElement = <HTMLInputElement>document.getElementById("error");
        //(?=.*[0-9]) - Assert a string has at least one number;
        //(?=.*[!@#$%^&*]) - Assert a string has at least one special character.
        // const minNumberofChars: number = 6;
        // const maxNumberofChars: number = 16;
        const regularExpressionPassword: RegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        const username: string = (<HTMLInputElement>document.getElementById("username")).value;
        const email: string = (<HTMLInputElement>document.getElementById("email")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;
        const firstname: string = (<HTMLInputElement>document.getElementById("firstname")).value;
        const preposition: string = (<HTMLInputElement>document.getElementById("preposition")).value;
        const lastname: string = (<HTMLInputElement>document.getElementById("lastname")).value;
        const expertise: string = (<HTMLInputElement>document.getElementById("expertise")).value;

        const emailParts: string[] = email.split("@");
        let errorMessage: string = "Missing: ";
        let addToMesssage: string;
        let problem: number = 0;

        if (!username) {
            addToMesssage = "Username, ";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!email) {
            addToMesssage = "Email, ";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!password) {
            addToMesssage = "password, ";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!firstname) {
            addToMesssage = "firstname, ";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!lastname) {
            addToMesssage = "lastname,";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!expertise) {
            addToMesssage = "expertise,";
            errorMessage += addToMesssage;
            problem++;
        }

        if (problem > 0) {
            errorMessage = errorMessage.slice(0, -2);
            console.error(errorMessage);
            errorBlock.innerHTML = errorMessage;
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            return;
        }
        //check password
        if (!regularExpressionPassword.test(password)) {
            const passwordMessage: string =
                "Password needs: a uppercase letter, lowercase letter, number, special character, and between 6 to 16 characters";
            console.log("testing password");
            // console.log(regularExpressionPassword.test(password));
            errorBlock.innerHTML = passwordMessage;
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            return;
        }

        //check email
        const localPart: string = emailParts[0];
        const domainPart: string = emailParts[1];

        console.log(domainPart);
        console.log(typeof domainPart);
        if (typeof domainPart === "undefined") {
            const emailMessage: string = "Please enter a valid email address";
            errorBlock.innerHTML = emailMessage;
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            return;
        }

        const emailLocalPartRegex: RegExp = 
            /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+(\.[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+)*$/;
        const emailDomainPartRegex: RegExp = /^[a-zA-Z0-9.-]+$/;
        const emailTopLevelDomain: RegExp = /^[a-zA-Z]{2,}$/;
        const domainParts: string[] | undefined = domainPart.split(".");

        // check valid email
        if (
            emailParts.length !== 2 ||
            !emailLocalPartRegex.test(localPart) ||
            localPart.includes("..") ||
            localPart.startsWith(".") ||
            localPart.endsWith(".") ||
            !emailDomainPartRegex.test(domainPart) ||
            domainPart.includes("--") ||
            domainPart.startsWith("-") ||
            domainPart.endsWith("-") ||
            domainParts.length < 2 ||
            domainParts[0].length < 1 ||
            !emailTopLevelDomain.test(domainParts[domainParts.length - 1])
        ) {
            const emailMessage: string = "Please enter a valid email address";
            errorBlock.innerHTML = emailMessage;
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            return;
        }
        //check local part for invalid characters

        //create data in database
        try {
            const query: string = `
            INSERT INTO user (username, email, password, firstname, preposition, lastname)
            VALUES (?, ?, ?, ?, ?, ?);
            `;
            console.log(query);
            const databaseCommand: any = await api.queryDatabase(
                query,
                username,
                email,
                password,
                firstname,
                preposition,
                lastname
            );
            const data: any = databaseCommand;
            //show data for debut
            console.error(data);

            //add profile
            await this.addProfile(data.insertId, expertise);
            //add userID to session
            session.set("user", data.insertId);
            url.redirect("/index.html");
        } catch (error: any) {
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            console.error(String(error));
            //remember error contains
            //email_UNIQUE
            const stringError: string = String(error);
            if (stringError.includes("email_UNIQUE")) {
                console.log("error duplicate");
                console.error(stringError);
                const errorMessage: string = "Email is already in use";
                errorBlock.innerHTML = errorMessage;
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            }
            if (stringError.includes("username_UNIQUE")) {
                console.log("error duplicate");
                console.error(stringError);
                const errorMessage: string = "Username is already in use";
                errorBlock.innerHTML = errorMessage;
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            }
            //username_UNIQUE
            return;
        }
    }

    /**
     * create profile on databse, with only the userID value
     * @param userID used to link the user to profile of user
     */
    private async addProfile(userID: number, expertise: string): Promise<void> {
        const consoleMessage: string = "addProfile";
        console.log(consoleMessage);
        //create data in database
        try {
            const query: string = `
            INSERT INTO profile (userID, expertise)
            VALUES (?, ?);
            `;
            console.log(query);
            const databaseCommand: any = await api.queryDatabase(query, userID, expertise);
            const data: any = databaseCommand;
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * verify if user is logged in bij checking sessions.
     * @returns boolean, true if logged in, else false
     */
    public verifyUser(): boolean {
        if (!session.get("user") || session.get("user") === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * this handles login bij checking the provided username, and password against the databases.
     * if it succeeds sets the user session and redirect to the homepage, else display an error message.
     * @param username entered by user
     * @param password entered by user
     */
    public async login(username: string, password: string): Promise<void> {
        const consoleMessage: string = "login";
        console.log(consoleMessage);
        //check login with database, (if not await, wil keep going without waiting for response)
        const data: any = await checkUsernameAndPassword(username, password);
        if (data.length > 0) {
            session.set("user", data[0].userID);
            url.redirect("/index.html");
        } else {
            // if user does not exits, give error to user. using css (bootstrap) to change display to block
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            // make fields empty again
            (<HTMLInputElement>document.getElementById("username")).value = "";
            (<HTMLInputElement>document.getElementById("password")).value = "";
        }

        /**
         * if loggin details are good, return userID
         * @param username
         * @param password
         * @returns if data is same, userID, else empty array
         */
        async function checkUsernameAndPassword(
            username: string,
            password: string
        ): Promise<Array<any> | undefined> {
            const consoleMessage: string = "checkUsernameAndPassword";
            console.log(consoleMessage);
            try {
                const query: string = `
                SELECT userID 
                FROM user 
                WHERE username = ? 
                AND password = ?`;
                console.log(query);
                const data: any = await api.queryDatabase(query, username, password);
                console.log(data);
                return data;
            } catch (error) {
                console.error(error);
                return [];
            }
        }
    }

    /**
     * this is used to log the user out, bij removing the user session.
     * it wil ask for an confirmation and if confirmed then redirect to the homepage
     */
    public logout(): void {
        if (window.confirm("Are you sure about loggin out?")) {
            session.remove("user");
            url.redirect("/index.html");
        }
    }

    /**
     * this fetches the user data from the database, based on the provided userID
     * @param userID the id of the user for whom the User object is created.
     * @returns an array of user data.
     */
    public async fetchUserData(userID: number): Promise<Array<any>> {
        const consoleMessage: string = "fetchUserData";
        console.log(consoleMessage);
        try {
            const query: string = `
            SELECT userID, username, email, firstname, preposition, lastname
            FROM user
            WHERE userID = ?;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query, userID);
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     * this creates an User object using the user data fetched from fetchUserData.
     * it is also used for when the user is deleted from the database while still logged in.
     * @param userID the id of the user for whom the User object is created.
     * @returns User object
     */
    public async createUserObject(userID: number): Promise<User> {
        const consoleMessage: string = "createUserObject";
        console.log(consoleMessage);
        const userData: any = await this.fetchUserData(userID);
        console.error(userData);
        // bug fix if user deleted from database while logged in
        if (userData.length === 0) {
            session.remove("user");
            url.redirect("/index.html");
            // does nothing, but remove error from promise
            return userData;
        } else {
            const user: User = new User(
                userData[0]["userID"],
                userData[0]["username"],
                userData[0]["email"],
                userData[0]["firstname"],
                userData[0]["preposition"],
                userData[0]["lastname"]
            );
            console.log(user);
            this.loggedIn();
            return user;
        }
    }

    /**
     * this fetches the profile data from the database, based on the provided userID
     * @param userID the id of the user for whom the profile object is created.
     * @returns an array of profile data.
     */
    public async fetchProfileData(userID: number): Promise<Array<any>> {
        const consoleMessage: string = "fetchProfileData";
        console.log(consoleMessage);
        try {
            const query: string = `
            SELECT profileID, p.userID, p.birthdate, p.experience, p.expertise, p.title, p.about, p.gitlab, p.profilePicture, u.username, u.email
            FROM profile AS p
            JOIN user AS u ON p.userID = u.userID 
            WHERE p.userID = ?;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query, userID);
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async createProfileObject(userID: number): Promise<Profile> {
        const consoleMessage: string = "createProfileObject";
        console.log(consoleMessage);
        const profileData: any = await this.fetchProfileData(userID);
        console.error(profileData);

        const profile: Profile = new Profile(
            profileData[0]["profileID"],
            profileData[0]["userID"],
            profileData[0]["birthdate"],
            profileData[0]["experience"],
            profileData[0]["expertise"],
            profileData[0]["title"],
            profileData[0]["about"],
            profileData[0]["gitlab"],
            profileData[0]["profilePicture"],
            profileData[0]["username"],
            profileData[0]["email"]
        );
        console.log(profile);
        return profile;
    }

    /**
     * this is used to toggle the visibility of elements on the page. this is based on the user's login status.
     */
    public async loggedIn(): Promise<void> {
        if (this.verifyUser()) {
            //remove if logged in
            const elements: HTMLCollectionOf<Element> = document.getElementsByClassName("not-loggedin");
            for (let i: number = 0; i < elements.length; i++) {
                elements[i].setAttribute("style", "display: none");
            }
        } else {
            //remove if not logged in
            const elements: HTMLCollectionOf<Element> = document.getElementsByClassName("loggedin");
            for (let i: number = 0; i < elements.length; i++) {
                elements[i].setAttribute("style", "display: none");
            }
        }
    }

    /**
     * this sets up the page for a logged in user. it adds event listeners, creates a User object, and displays the user's name on the page.
     * @returns User object
     */
    public async setupIfLoggedIn(): Promise<User> {
        const consoleMessage: string = "userData";
        console.log(consoleMessage);

        //listener add question
        document.querySelector(".add-button")?.addEventListener("click", () => {
            url.redirect("/add-question.html");
        });

        //create user object, with logged in user info
        const userID: number = session.get("user");
        const user: User = await this.createUserObject(userID);
        console.log(user);

        //listener logout
        document.querySelector(".logout-btn")?.addEventListener("click", this.logout);

        //show username on navbar
        const accountNameId: string = "navbarDropdown accountName";
        const accountName: HTMLElement = document.getElementById(accountNameId)!;
        accountName.innerHTML = user.username;

        //Profile to my profile
        const idProfile: string = "profile";
        document.getElementById(idProfile)?.addEventListener("click", () => {
            url.redirect("/profile.html", { id: userID });
        });

        return user;
    }

    /**
     * this sets up the page for a logged out user. it adds event listener for a button, display's an alert, and redirects the user to the logn page.
     * @returns false boolean
     */
    public async setupIfLoggedOut(): Promise<boolean> {
        //listener add question, make user login first
        document.querySelector(".add-button")?.addEventListener("click", () => {
            const alertMessage: string = "please login to post a question";
            alert(alertMessage);
            url.redirect("/login.html");
        });
        return false;
    }
}
