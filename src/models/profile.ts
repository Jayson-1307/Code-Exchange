import { api, url, utils, session } from "@hboictcloud/api";
import { AbstractUser } from "./abstractUser";

/**
 * This class extends from the AbstractUser class. This is used to represent the profile.
 * it can update, delete, using the APi,
 * it can render the profile on the page
 */
export class Profile extends AbstractUser {
    //attributes and constructor
    public constructor(
        id: number,
        private _userID: number,
        private _birthdate: string,
        private _experience: number,
        private _expertise: string,
        private _title: string,
        private _about: string,
        private _gitlab: string,
        private _profilePicture: any,
        username: string,
        email: string
    ) {
        super(id, username, email);
    }

    //getters en setters
    public toString(): string {
        const userInfo: string = `${super.toString()} 
        Profile: userID ${this._userID} 
        birthdate: ${this._birthdate} 
        experience: ${this._experience} 
        expertise: ${this._expertise} 
        title: ${this._title} 
        about: ${this._about} 
        gitlab: ${this._gitlab}`;
        console.log(userInfo);
        return userInfo;
    }

    //database functions
    
    /**
     * this is used to update the profile in the database, using the API
     */
    public async update(): Promise<void> {
        try {
            console.log(this._birthdate);
            const query: string = 
            `
            UPDATE profile
            SET birthdate = ?, experience = ?, expertise = ?, title = ?, about = ?, gitlab = ?, profilePicture = ?
            WHERE profileID = ?;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(
                query,
                this._birthdate,
                this._experience,
                this._expertise,
                this._title,
                this._about,
                this._gitlab,
                this._profilePicture,
                this.id
            );
            console.log("has updated");
            console.log(data);
            const userID: number = session.get("user");
            url.redirect("/profile.html", { id: userID });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * this is used to delete the profile from the database, using the API
     */
    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(
            `
            DELETE FROM user
            WHERE userID = ?;
            `,
                this._userID
            );
        } catch (error) {
            console.log(error);
        }
    }

    //print functions

    /**
     * this is used to show the data on the profile page
     */
    public async fillProfileContent(): Promise<void> {
        // const userID : number = session.get("user");
        const query: string = `
        SELECT p.userID, p.birthdate, p.experience, p.expertise, p.title, p.about, p.gitlab, p.profilePicture, u.username, ROUND(AVG(v.voteScore)) AS averageScore
        FROM profile AS p
        INNER JOIN user AS u 
        ON p.userID = u.userID
        LEFT JOIN answer AS a
        ON p.userID = a.userID
        LEFT JOIN vote AS v
        ON a.AnswerID = v.AnswerID
        WHERE p.userID = ?
        GROUP BY p.userID`;

        console.log(query);
        console.log(this.toString());
        const data: any = await api.queryDatabase(query, this._userID);
        console.log("data");
        console.log(data);
        console.log(this._birthdate);

        const modifiedToStringBirthdate: string = new Intl.DateTimeFormat("nl-NL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(this._birthdate));
        // let birthdate: Date = data[0]["birthdate"];
        // const experience: number = data[0]["experience"];
        // const expertise: string = data[0]["expertise"];
        // const title: string = data[0]["title"];
        // const about: string = data[0]["about"];
        // const gitlab: string = data[0]["gitlab"];
        // const profilePicture: any = data[0]["profilePicture"];
        const username: string = data[0]["username"];
        const averageScore: number = data[0]["averageScore"];

        const birthdateElement: HTMLElement = document.getElementById("birthdate")!;
        const experienceElement: HTMLElement = document.getElementById("experience")!;
        const expertiseElement: HTMLElement = document.getElementById("expertise")!;
        const titleElement: HTMLElement = document.getElementById("title")!;
        const aboutElement: HTMLElement = document.getElementById("about")!;
        const gitlabElement: HTMLElement = document.getElementById("gitlab")!;
        let profilePictureElement: HTMLImageElement = <HTMLImageElement>(
            document.getElementById("profilePicture")!
        );
        const voteScore: HTMLElement = <HTMLElement>document.getElementById("voteScore")!;
        const usernameElement: HTMLElement = document.getElementById("display-name")!;
        usernameElement.innerHTML += username;
        const usernameTopElement: HTMLElement | null = document.getElementById("usernameTop")!;
        usernameTopElement.innerHTML += username;

        if (this._birthdate !== null && this._birthdate !== undefined) {
            birthdateElement.innerHTML += modifiedToStringBirthdate;
        } else {
            birthdateElement.innerHTML += "Not available";
        }

        if (this._experience !== null && this._experience !== undefined) {
            experienceElement.innerHTML += this._experience;
        } else {
            experienceElement.innerHTML += "Not available";
        }

        if (this._expertise !== null && this._expertise !== undefined) {
            expertiseElement.innerHTML += this._expertise;
        } else {
            expertiseElement.innerHTML += "Not available";
        }

        if (this._title !== null && this._title !== undefined) {
            titleElement.innerHTML += this._title;
        } else {
            titleElement.innerHTML += "Not available";
        }

        if (this._about !== null && this._about !== undefined) {
            aboutElement.innerHTML += this._about;
        } else {
            aboutElement.innerHTML += "Not available";
        }

        if (this._profilePicture !== null && this._profilePicture !== undefined) {
            profilePictureElement.src = this._profilePicture;
        } else {
            profilePictureElement.src = "./assets/img/pfp.png";
        }

        if (this._gitlab !== null && this._gitlab !== undefined) {
            gitlabElement.innerHTML += this._gitlab;
        } else {
            gitlabElement.innerHTML += "Not available";
        }

        if (averageScore !== null && averageScore !== undefined) {
            for (let i: number = 0; i < 5; i++) {
                const star: HTMLElement = document.createElement("i");
                if (averageScore > i) {
                    star.className = "bi bi-star-fill";
                } else {
                    star.className = "bi bi-star";
                }
                voteScore.appendChild(star);
            }
        } else {
            const empty: number = 0;
            for (let i: number = 0; i < 5; i++) {
                const star: HTMLElement = document.createElement("i");
                if (empty > i) {
                    star.className = "bi bi-star-fill";
                } else {
                    star.className = "bi bi-star";
                }
                voteScore.appendChild(star);
            }
        }
    }

    /**
     * will gather the input data, check and if all correct send to the database
     */
    public async updateProfile(): Promise<void> {
        console.error(this._birthdate);
        const userProfilepicture: any = document.querySelector("#pictureUpload");
        // Initialisatie van de variabele voor de profielfotoupload.
        let uploadResponse: string | undefined = userProfilepicture?.profilePhoto;

        // Controleer of er een bestand is geselecteerd voor upload.
        if (userProfilepicture.files && userProfilepicture.files.length > 0) {
            const fileData: any = await utils.getDataUrl(userProfilepicture);
            const timestamp: number = new Date().getTime();
            const fileName: string = `profileImage_${timestamp}.jpg`;
            /** Voer de profielfotoupload uit en ontvang de uploadreactie. */
            uploadResponse = await api.uploadFile(fileName, fileData.url);
            console.log(uploadResponse);
        }

        let editBirthdate: string = (<HTMLInputElement>document.getElementById("editBirthdate")!).value;
        let editTitle: string = (<HTMLInputElement>document.getElementById("editTitle")!).value;
        let editExperience: number = parseInt(
            (<HTMLInputElement>document.getElementById("editExperience")!).value
        );
        let editExpertise: string = (<HTMLInputElement>document.getElementById("editExpertise")!).value;
        let editAbout: string = (<HTMLInputElement>document.getElementById("editAbout")!).value;
        let editGitlab: string = (<HTMLInputElement>document.getElementById("editGitlab")!).value;

        console.log("this is editbirthdate");
        console.log(editBirthdate);
        if (editBirthdate === null || editBirthdate === undefined || editBirthdate === "") {
            console.log("test is run");
            this.changeBirthdate(this._birthdate);
        } else {
            this.changeBirthdate(editBirthdate);
            console.log("test is run not empty");
        }

        if (editTitle === "") {
            editTitle = this._title;
        } else this._title = editTitle;

        if (editExperience === null || editExperience === undefined) {
            editExperience = this._experience;
        } else {
            this._experience = editExperience;
        }

        if (editExpertise === "") {
            editExpertise = this._expertise;
        } else {
            this._expertise = editExpertise;
        }

        if (editAbout === "") {
            editAbout = this._about;
        } else {
            this._about = editAbout;
        }

        if (editGitlab === "") {
            editGitlab = this._gitlab;
        } else {
            this._gitlab = editGitlab;
        }

        if (uploadResponse === "" || uploadResponse === undefined) {
            uploadResponse = this._profilePicture;
        } else {
            this._profilePicture = uploadResponse;
        }

        console.log("run update");
        this.update();
    }

    /**
     * This is used to format the date for the database
     * @param birthdate date to format, old or new date
     * @returns void
     */
    private changeBirthdate(birthdate: string): void {
        console.log("start error");
        console.log(birthdate);
        if (birthdate === null || birthdate === undefined) {
            return;
        }
        if (birthdate.length > 12) {
            console.error("change date > 12");
            //[0] is limit, means that noting else gets stored when splitting at T
            birthdate = birthdate.split("T")[0];
            console.log(birthdate);
            this._birthdate = birthdate;
        } else if (birthdate.length > 1) {
            console.error("change date > 1");
            let dateSplit: Array<any> = birthdate.split("-");
            console.log(dateSplit);
            const newDate: any = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]).toLocaleDateString(
                "en-CA"
            );
            console.log(newDate);
            this._birthdate = newDate;
        }
    }
}
