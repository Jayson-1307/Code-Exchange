# Technische documentatie

## Inhoudsopgaven
1. [Wat willen wij met dit document laten zien](#wat-willen-wij-met-dit-document-laten-zien)
2. [Database](#database)  
    1. [Ontwerp gedachte](#ontwerp-gedachte)   
    2. [Database ERD, Entity Relationship Diagram](#database-erd-entity-relationship-diagram)
    3. [Database EERD, Extended Entitiy Relationship diagram](#database-erd-entity-relationship-diagram)
    4. [Creatie database](#creatie)
3. [Classen](#classen)
    1. [UML CLass Diagram](#uml-class-diagram)
    2. [UserManager](#usermanager)
    3. [User](#user)
    4. [Profile](#profile)
    5. [PostManager](#postmanager)
    6. [Post](#post)
        1. [Question](#question)
        2. [Answer](#answer)
    7. [Vote](#vote)
4. [Front-end](#front-end)
    1. [LESS](#less)
    2. [Bootstrap](#bootstrap)
    3. [Navbar](#navbar)
    4. [Searchbar(WIP)](#searchbar-wip)
    5. [Media queries](#media-queries-css)
5. [Bronnen](#bronnen)



## Wat willen wij met dit document laten zien
Met dit document willen wij delen met andere programmeurs, hoe onze programma en waarom voor bepaalde keuzes gekozen zijn. Om zo een betere beeld te creeeren voor ander die aan onze programma willen werken.

Verder is het document in verschillende documenten uitgespreid, zodat het overzichtelijker blijft.
Klik hier onder op de gewenste onderdeel.
* [Technische documentatie](./technische%20documentatie.md)
* [Database](./technische%20documenten/Database.md)
* [Classen](./technische%20documenten/Classen.md)
* [Front-End](./technische%20documenten/Front-End.md)

## Database
Hieronder komen de onderdelen: Het idee van het ontwerp, ERD (Entity Relationship Diagram), EERD (Extended Entitiy Relationship diagram), en daarna de individuele onderdelen aan orde.

De verdere interactie zal opgeroepen worden door andere onderdelen van het programma zoals een class User. De code zal dan dus bij de class staan.

### Ontwerp gedachte
De gedacht achter het ontwerp van onze database is:
De website moet bijhouden wat bij welke gebruiker hoort, dus een user
De user moet een gekoppelde profiel hebben om info van de gebruiker te kunnen delen, dus via userID
De user moet een vraag kunnen stellen, dus een question. Gekoppeld via userID
De user moet een antwoord op een vraag kunnen stellen, dus een answer. Gekoppeld via userID en question. Hierdoor is te achterhalen waar de antwoord hoort.
De user moet een beordeling van het kwaliteit van het antwoord kunnen geven, dus een vote. Gekopppeld via userID en answerID.
 
alle gebruikers zonder account:
Moeten kunnen: profiel bekijken en score zien, vragen zien, antwoorden zien, en scores voor elke antwoord kunnnen zien.

### Database ERD, Entity Relationship Diagram 

![ERD Database](./afbeeldingen/database/ERD%20database.png)

### Database EERD, Extended Entitiy Relationship diagram

![EERD Database](./afbeeldingen/database/EERD%20database.png)


### Creatie database
De creatie staat opgeslagen in het database bestand onder src > sql.

Daarin staat de volgende SQL code die gebruik is bij het maken van de database op HBO-iCT.Cloud omgeving dat gebruik maakt van phpMyAdmin. De code is toen direct in de SQL kopje gestopt en uitgevoerd.

```SQL
-- user table
CREATE TABLE user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    preposition VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
);

-- question table
/* 
DEFAULT if you dont provide data will use CURRENT_TIMESTAMP
ON UPDATE if you change or create data on row, this will update dateModified with CURRENT_TIMESTAMP
*/
CREATE TABLE question (
    questionID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    title VARCHAR(255),
    content TEXT NOT NULL,
    codeSnippet TEXT,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- answer table
CREATE TABLE answer (
    answerID INT AUTO_INCREMENT PRIMARY KEY,
    questionID INT,
    userID INT,
    content TEXT NOT NULL,
    codeSnippet TEXT,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isAnswerAccepted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (questionID) REFERENCES question(questionID),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- votes table
CREATE TABLE vote (
    votesID INT AUTO_INCREMENT PRIMARY KEY,
    answerID INT,
    userID INT,
    voteScore INT,
    FOREIGN KEY (answerID) REFERENCES answer(answerID),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- profile
CREATE TABLE profile (
    profileID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    birthdate DATE,
    experience INT,
    expertise VARCHAR(255),
    title VARCHAR(255),
    about VARCHAR(255),
    gitlab VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES user(userID)
);
```

## Classen
Hieronder kommen de onderdelen: <!-- Ontwerp gedachte,  -->UML Class Diagram, en daarna de indivuele afgemaakte classen. 
Voor uitleg van classen zal UML en code snippets gebruikt worden, en uitleg over de class.

<!-- ### Ontwerp gedachte
De gedachte achter het ontwerp van de classen:
Omdat we alleen interactie hebben met vragen en questions gaan we ervan uit dat iemand ingelogd is, of gekenen moet worden dat iemand ingelogd is.

Om een account te maken wordt de UserManager.addUser() aangesproken. Deze controleerd de gegevens en maakt dan de user + profiel in de database aan.
Om te controleren of iemand ingelogd is word gebruik gemaakt van 
Hierdoor hoeft de User class nog geen rekening te houden met de gegevens waarmee deze gemaakt word.  -->



### UML CLass Diagram

![UML Class Diagram V4](./afbeeldingen/classes/All%20Classes%20Diagram%20V4.png)

### UserManager
De UserManager wordt gebruikt om alles te regelen op de pagina als de gebruiker wel of niet ingelogd is. Hieronder zijn de dingen wat de UserManager doet:
* Het voegt de user aan de database toe,
* Het voegt het profiel van de user aan de database toe, 
* Het controleert of iemand ingelogd is,
* Het logt iemand in.
* Het logt iemand uit,
* Het past elementen op de dom aan, aan de hand of de gebruiker ingelogd is of niet.
* Het haalt de gevens van de gebruiker op,
* Het maakt de User class aan met de opgehaalde gegevens

#### UML

![UserManager UML](./afbeeldingen/classes/UserManager%20class.png)

#### Code
```typescript
import { api, session, url } from "@hboictcloud/api";
import { User } from "./user";

/**
 * create whole class
 */
export class UserManager {
    //functions

    /**
     * create user on database, with the following values 
     * @param username 
     * @param email
     * @param password 
     * @param firstname 
     * @param preposition 
     * @param lastname 
     * @returns This is used in other functions to immediatly create profile and set session with userId,
     */
    public async addUser(): Promise<Array<any> | undefined> {
        const consoleMessage: string = "addUser";
        console.log(consoleMessage);

        const username: string = (<HTMLInputElement>document.getElementById("username")).value;
        const email: string = (<HTMLInputElement>document.getElementById("email")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;
        const firstname: string = (<HTMLInputElement>document.getElementById("firstname")).value;
        const preposition: string = (<HTMLInputElement>document.getElementById("preposition")).value;
        const lastname: string = (<HTMLInputElement>document.getElementById("lastname")).value;
        const expertise: string = (<HTMLInputElement>document.getElementById("expertise")).value;

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
            console.error(errorMessage);
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            return;
        }

        //create data in database
        try {
            const query: string = `
            INSERT INTO user (username, email, password, firstname, preposition, lastname)
            VALUES ("${username}", "${email}", "${password}", "${firstname}", "${preposition}", "${lastname}");
            `;
            console.log(query);
            const databaseCommand: any = await api.queryDatabase(query);
            const data: any = databaseCommand;
            //show data for debut
            console.error(data);

            //add profile
            await this.addProfile(data.insertId, expertise);
            //add userID to session
            session.set("user", data.insertId);
            url.redirect("/index.html");
            return data;
        } catch (error: any) {
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            console.log("Error properties", Object.keys(error));
            //test
            // for (const key in error) {
            //     console.log(`Property: ${key}, Value:`, error[key]);
            // }
            console.error(String(error));
            //remember error contains
            //email_UNIQUE

            return [];
        }
    };


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
            VALUES (${userID}, "${expertise}");
            `;
            console.log(query);
            const databaseCommand: any = await api.queryDatabase(query);
            const data: any = databaseCommand;
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * verify if user is logged in
     * @returns boolean
     */
    public verifyUser(): boolean {
        if (!session.get("user") || session.get("user") === undefined) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * add user to session, to remember that user is logged in
     * @param username 
     * @param password 
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
        async function checkUsernameAndPassword(username: string, password: string): Promise<Array<any> | undefined> {
            const consoleMessage: string = "checkUsernameAndPassword";
            console.log(consoleMessage);
            try {
                const query: string = `
                SELECT userID 
                FROM user 
                WHERE username = "${username}" 
                AND password = "${password}"`;
                console.log(query);
                const data: any = await api.queryDatabase(query);
                console.log(data);
                return data;
            } catch (error) {
                console.error(error);
                return [];
            }
        };
    }

    /**
     * remove user from session and send to homepage
     */
    public logout(): void {
        if (window.confirm("Are you sure about loggin out?")) {
            session.remove("user");
            url.redirect("/index.html");
        }
    }


    /**
     * fetch data to make user object from User class, using only userID
     * dit not make more specific, is now possible to reuse with any user class creation. only needed userID
     * @param userID 
     * @returns data needed to make user object
     */
    public async fetchUserData(userID: number): Promise<Array<any>> {
        const consoleMessage: string = "fetchUserData";
        console.log(consoleMessage);
        try {
            const query: string = `
            SELECT userID, username, email, firstname, preposition, lastname
            FROM user
            WHERE userID = ${userID};
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    //create user object from user class
    public async createUserObject(userID: number): Promise<User> {
        const consoleMessage: string = "createUserObject";
        console.log(consoleMessage);
        const userData: any = await this.fetchUserData(userID);
        console.error(userData);
        //bug fix if user deleted from database while logged in
        if (userData.length === 0) {
            session.remove("user");
            url.redirect("/index.html");
            //does nothing, but remove error from promise
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
    };

    //change displayed items if logged in and when not
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

    //load standard items for page, meant for logged in
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

        return user;
    }

    //load standard items for page, meant for logged out
    public async setupIfLoggedOut(): Promise<boolean> {
        //listener add question, make user login first
        document.querySelector(".add-button")?.addEventListener("click", () => {
            const alertMessage: string = "please login to post a question";
            alert(alertMessage);
            url.redirect("/login.html");
        });
        return false;
    }


};


```

### User
De User class wordt gebruikt als een object voor als de gebruiker ingelogd is. Hiermee kunnen wij de pagina's persoonlijker maken en de de gegevens filteren voor het gemak van de gebruiker. Tevens wordt het gebruikt om te bekijken of een gebruiker wel rechten heeft om post te plaatsen, aanpassen en verwijderen.  

#### UML

![User](./afbeeldingen/classes/User%20class.png)

#### Code
```typescript
import { api } from "@hboictcloud/api";
export class User {
    // private fields
    private _id: number;
    private _username: string;
    private _email: string;
    private _firstname: string;
    private _preposition: string;
    private _lastname: string;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(userID: number, username: string, email: string, firstname: string, preposition: string, lastname: string) {
        this._id = userID;
        this._username = username;
        this._email = email;
        this._firstname = firstname;
        this._preposition = preposition;
        this._lastname = lastname;
    }

    // Getters en setters
    ***

    //database functions
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(`
            UPDATE user
            SET username = ${this._username}, email = ${this._email}, firstname = ${this._firstname}, preposition = ${this._preposition}, lastname = ${this._lastname}
            WHERE userID = ${this._id};
            `);
        } catch (error) {
            console.error(error);
        }
    }

    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(`
            DELETE FROM user
            WHERE userID = ${this._id};
            `);
        } catch (error) {
            console.log(error);
        }
    }
}

```


### Profile
De Profile class wordt gebruikt om een pagina over de gebruiker te tonen. Deze informatie is beschikbaar voor andere als de gebruiker deze gegevens heeft ingevuld. Dit zijn onder andere: gebortedatum, jaar ervaring, expertise level, title van pagina, omschrijving gebruiker, gitlab gebruikersnaam.

#### UML

![Profile UML](./afbeeldingen/classes/Profile%20class.png)

### Code
```typescript
import { api } from "@hboictcloud/api";
export class Profile {
    // private fields
    private _id: number;
    private _userID: number;
    private _birthdate: string;
    private _experience: string;
    private _expertise: string;
    private _title: string;
    private _about: string;
    private _gitlab: string;

    //constructor
    public constructor(id: number, userID: number, birthdate: string, experience: string, expertise: string, title: string, about: string, gitlab: string) {
        this._id = id;
        this._userID = userID;
        this._birthdate = birthdate;
        this._experience = experience;
        this._expertise = expertise;
        this._title = title;
        this._about = about;
        this._gitlab = gitlab;
    }

    // Getters en setters
    ***

    //database functions
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(`
            UPDATE profile
            SET profileID = ${this._id}, userID = ${this._userID}, birthdate = ${this._birthdate}, experience = ${this._experience}, expertise = ${this._expertise}, title = ${this._title}, about = ${this._about}, gitlab = ${this._gitlab}
            WHERE profileID = ${this._id};
            `);
        } catch (error) {
            console.error(error);
        }
    }

    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(`
            DELETE FROM profile
            WHERE profileID = ${this._id};
            `);
        } catch (error) {
            console.log(error);
        }
    }
}
```

### PostManager
De PostManager wordt gebruikt om alles met de antwoorden en vragen te beheren. Hieronder vallen de volgende:
* Het voegt vragen en antwoorden toe aan de database.
* Het fetcht de juiste data vanuit de database voor de gewenste pagina.
* Het maakt de benodigde Question en Answer classes aan.

#### UML

![PostManager UML](./afbeeldingen/classes/PostManager%20class.png)

#### Code
```typescript
import { api, url } from "@hboictcloud/api";
import { Question } from "./question";
import { Answer } from "./answer";

export class PostManager {
    //functions

    //add question to database, return id for later use
    public async addQuestion(userID: number): Promise<Array<any>> {
        //data for debug
        const consoleMessage: string = "addQuestion";
        console.log(consoleMessage);

        //gather input values, check values, if wrong show error and empty input fields, else add to database
        const title: string = (<HTMLInputElement>document.getElementById("title")).value;
        const content: string = (<HTMLInputElement>document.getElementById("content")).value;
        const codeSnippet: string = (<HTMLInputElement>document.getElementById("code-snippet")).value;
        const tags: string = (<HTMLInputElement>document.getElementById("tags")).value;

        console.log(userID);
        console.log(title);
        console.log(content);
        console.log(codeSnippet);
        console.log(tags);

        let errorMessage: string = "Missing: ";
        let addToMesssage: string;
        let problem: number = 0;

        if (!userID) {
            addToMesssage = "userID,";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!title) {
            addToMesssage = "title,";
            errorMessage += addToMesssage;
            problem++;
        }

        if (problem > 0) {
            console.error(errorMessage);
            failed();
            return [];
        }

        try {
            const query: string = `
            INSERT INTO question (userID, title, content, codeSnippet, tags) 
            VALUES (${userID}, "${title}", "${content}", "${codeSnippet}", "${tags}");
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            console.log(data);
            return data.insertId; //questionID
        } catch (error) {
            console.error(error);
            failed();
            return [];
        }

        function failed(): void {
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            (<HTMLInputElement>document.getElementById("title")).value = "";
            (<HTMLInputElement>document.getElementById("content")).value = "";
            (<HTMLInputElement>document.getElementById("code-snippet")).value = "";
            (<HTMLInputElement>document.getElementById("tags")).value = "";
        }
    }

    /**
     * gather input values, if all correct add answer to database
     * @param userID userID of logged in user
     * @param questionID question of question this is an answer to
     */
    public async addAnswer(userID: number, questionID: number): Promise<void> {
        const consoleMessage: string = "addAnswer";
        console.log(consoleMessage);

        const content: string = (<HTMLInputElement>document.getElementById("answerText")).value;
        const codeSnippet: string = (<HTMLInputElement>document.getElementById("answerCode")).value;

        let errorMessage: string = "Missing: ";
        let addToMesssage: string;
        let problem: number = 0;

        if (!userID) {
            addToMesssage = "userID, ";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!questionID) {
            addToMesssage = "questionID, ";
            errorMessage += addToMesssage;
            problem++;
        }
        if (!content) {
            addToMesssage = "content, ";
            errorMessage += addToMesssage;
            problem++;
        }

        if (problem > 0) {
            console.error(errorMessage);
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            return;
        }

        //create data in database
        try {
            const query: string = `
                INSERT INTO answer (questionID, userID, content, codeSnippet)
                VALUES ("${questionID}", "${userID}", "${content}", "${codeSnippet}");
                `;
            console.log(query);
            const databaseCommand: any = await api.queryDatabase(query);
            const answerID: number = databaseCommand.insertId;
            //show data for debug
            console.log(answerID);
            //add answerID to session
            url.redirect("/question-detail.html", { id: questionID });
        } catch (error) {
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");

            console.error(error);
        }
    };


    //convert for every row fetched data to question class, put every question class inside of an array and return to primary caller of functions 
    public createQuestionOrAnswerObject(fetchedData: Array<any>, isQuestion: boolean): Array<any> {
        const consoleMessage: string = "createQuestionObject";
        console.log(consoleMessage);

        const modifyDate: Array<any> = fetchedData.map((item: any) => {
            const isModified: boolean = item.creationDate !== item.dateModified;

            item.creationDate = new Intl.DateTimeFormat("nl-NL", { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", hourCycle: "h23", timeZone: "UTC" }).format(new Date(item.creationDate));
            item.dateModified = new Intl.DateTimeFormat("nl-NL", { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", hourCycle: "h23", timeZone: "UTC" }).format(new Date(item.dateModified));
            return {
                ...item,
                isModified
            };
        });


        if (isQuestion) {
            const questions: Question[] = modifyDate.map((item: any) => {
                return new Question(
                    item.questionID,
                    item.userID,
                    item.content,
                    item.codeSnippet,
                    item.creationDate,
                    item.dateModified,
                    item.title,
                    item.tags,
                    item.username,
                    item.expertise,
                    item.answers,
                    item.isModified
                );
            });
            return questions;
        } else {
            const answers: Answer[] = modifyDate.map((item: any) => {
                return new Answer(
                    item.questionID,
                    item.userID,
                    item.content,
                    item.codeSnippet,
                    item.creationDate,
                    item.dateModified,
                    item.title,
                    item.tags,
                    item.username,
                    item.expertise,
                    item.isModified
                );
            });
            return answers;
        }

    }



    //#region Questions
    //fetch questions with user data
    public async fetchQuestionsPageQuestionsList(): Promise<Question[] | undefined> {
        const consoleMessage: string = "fetchAllQuestionsWithLinkedUserData";
        console.log(consoleMessage);

        try {
            const query: string = `
        SELECT q.questionID, q.userID, q.title, q.content, q.codeSnippet, q.tags, q.creationDate, q.dateModified, u.username, u.email, u.firstname, u.preposition, u.lastname, p.expertise, COUNT(a.answerID) AS answers   
        FROM question AS q 
        INNER JOIN user AS u 
        ON q.userID = u.userID
        LEFT JOIN profile AS p
        on q.userID = p.userID
        LEFT JOIN answer AS a
        ON q.questionID = a.questionID
        GROUP BY q.questionID
        ORDER BY creationDate DESC;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            console.log(data);
            const questions: Question[] = this.createQuestionOrAnswerObject(data, true);
            return questions;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    //#endregion Questions


    //#region my-questions

    //fetch questions with user data
    public async fetchMyQuestionsPageQuestionList(userID: number): Promise<Question[] | undefined> {
        const consoleMessage: string = "fetchMyQuestionsQuestionList";
        console.log(consoleMessage);

        try {
            const query: string = `
            SELECT q.questionID, q.userID, q.title, q.content, q.codeSnippet, q.tags, q.creationDate, q.dateModified, u.username, u.email, u.firstname, u.preposition, u.lastname, p.expertise   
            FROM question AS q 
            LEFT JOIN user AS u 
            ON q.userID = u.userID
            LEFT JOIN profile AS p
            on q.userID = p.userID
            WHERE q.userID = ${userID}
            ORDER BY creationDate DESC;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            console.log(data);
            const questions: Question[] = this.createQuestionOrAnswerObject(data, true);
            return questions;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    //#endregion my-questions

    //#region index
    //fetch questions with user data
    public async fetchIndexPageQuestionList(): Promise<Question[] | undefined> {
        const consoleMessage: string = "fetchHomepageQuestionList";
        console.log(consoleMessage);

        try {
            const query: string = `
            SELECT q.questionID, q.userID, q.title, q.content, q.codeSnippet, q.tags, q.creationDate, q.dateModified, u.username, u.email, u.firstname, u.preposition, u.lastname, p.expertise, COUNT(a.answerID) AS answers   
                FROM question AS q 
                LEFT JOIN user AS u 
                ON q.userID = u.userID
                LEFT JOIN profile AS p
                on q.userID = p.userID
                LEFT JOIN answer AS a
                ON q.questionID = a.questionID
                GROUP BY q.questionID
                ORDER BY creationDate DESC
                LIMIT 3;
                `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            console.log(data);
            const questions: Question[] = this.createQuestionOrAnswerObject(data, true);
            return questions;
        } catch (error) {
            console.error(error);
            return;
        }
    }
    //#endregion index


    //#region question-detail

    //fetch Question data
    public async fetchQuestionDeatilPageQuestion(questionID: number): Promise<Question[] | undefined> {
        const consoleMessage: string = "fetchQuestionData";
        console.log(consoleMessage);

        try {
            const query: string = `
        SELECT q.questionID, q.userID, q.title, q.content, q.codeSnippet, q.tags, q.creationDate, q.dateModified, u.username, u.email, u.firstname, u.preposition, u.lastname, p.expertise, COUNT(a.answerID) AS answers   
        FROM question AS q 
        INNER JOIN user AS u 
        ON q.userID = u.userID
        LEFT JOIN profile AS p
        on q.userID = p.userID
        LEFT JOIN answer AS a
        ON q.questionID = a.questionID
        WHERE q.questionID = ${questionID}
        GROUP BY q.questionID
        ORDER BY creationDate DESC;
        `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            console.log(data);
            const questions: Question[] = this.createQuestionOrAnswerObject(data, true);
            return questions;
        } catch (error) {
            console.error(error);
            return;
        }
    }




    //fetch Question data
    public async fetchQuestionDetailPageAnswers(questionID: number): Promise<Answer[] | undefined> {
        const consoleMessage: string = "fetchAnswerData";
        console.log(consoleMessage);

        try {
            const query: string = `
            SELECT a.answerID, a.questionID, a.userID, a.content, a.codeSnippet, a.creationDate, a.dateModified, u.username, u.email, u.firstname, u.preposition, u.lastname, p.expertise   
            FROM answer AS a 
            LEFT JOIN user AS u 
            ON a.userID = u.userID
            LEFT JOIN profile AS p
            on a.userID = p.userID
            WHERE a.questionID = ${questionID}
            ORDER BY creationDate DESC;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            const answers: Answer[] = this.createQuestionOrAnswerObject(data, false);
            return answers;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    //#endregion question-detail

}
```


### Post
De Post class wordt als abstract gebruikt. Hierdoor hoeven de overeenkomende velden tussen Question class en de Answer class maar op een plek aangepast te worden.

#### UML

![Post UML](./afbeeldingen/classes/Post%20class.png)

#### Code
```typescript
export class Post {
    // private fields
    private _id: number;
    private _userID: number;
    private _content: string;
    private _codeSnippet: string;
    private _username: string;
    private _expertise: string;
    private _creationDate: string;
    private _dateModified: string;
    private _isModified: boolean;

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, username: string, expertise: string, creationDate: string, dateModified: string, isModified: boolean) {
        this._id = id;
        this._userID = userID;
        this._content = content;
        this._codeSnippet = codeSnippet;
        this._username = username;
        this._expertise = expertise;
        this._creationDate = creationDate;
        this._dateModified = dateModified;
        this._isModified = isModified;
    }

    // Getters en setters
    ***
    //database functions
    public async update(): Promise<void> {
        const error: string = "This message for update from Post should not show";
        console.log(error);
    }

    public async delete(): Promise<void> {
        const error: string = "This message for delete from Post should not show"; 
        console.log(error);
    }
}

```


#### Question
De Question class wordt gebruikt bij het tonen, updaten en bewerken van de vragen. Hierdoor is er een plek waar we de code hoeven te wijzigen als wij dit willen veranderen.

De Question class is een extensie van de Post class. Hierdoor moeten de velden die in de Post class staan via super aangeroepen worden. Dit is te zien in de constructor. 
Om de toString() uit te voeren met de private eigenschappen van de Post class. Moeten we de get methode van de Post class oproepen. Dit doen wij door super te gebruiken bij het oproepen van de Post class getter methode.

Als een object van de Question class gemaakt is. Dan werken nog alle public methods, en dus ook de getter en setter methods, van de Post class. Het is dus mogelijk om de id te krijgen door [object naam].id() te gebruiken.

##### UML

![Question UML](./afbeeldingen/classes/Question%20class.png)

##### Code
```typescript
import { api, url } from "@hboictcloud/api";
import { Post } from "./post";



export class Question extends Post {
    //private fields
    private _title: string;
    private _tags: string;
    private _answers: number;

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string, title: string, tags: string, username: string, expertise: string, answers: number, isModified: boolean) {
        super(id, userID, content, codeSnippet, username, expertise, creationDate, dateModified, isModified);
        this._title = title;
        this._tags = tags;
        this._answers = answers;
    }


    //getters and setters
    ***

    //database functions
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(`
            UPDATE question
            SET title = "${this.title}", content = "${super.content}", codeSnippet = "${super.codeSnippet}", tags = "${this.tags}")
            WHERE questionID = ${super.id};
            `);
        } catch (error) {
            console.error(error);
        }
    }

    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(`
                DELETE FROM question
                WHERE questionID = ${super.id};
            `);
        } catch (error) {
            console.error(error);
        }
    }

    //#region allPagesQuestionList

    //add elements to dom
    public printQuestionsList(): void {
        ***
    }

    //#endregion allPagesQuestionList


    //#region Question-details
    //add elements to dom
    public printQuestionDetailPageQuestion(loggedinUserID: number): void {
        ***
    }

    //#endregion Question-details

}
```


#### Answer
De Answer class wordt gebruikt bij het tonen, bewerken en updaten van de antwoorden. Hierdoor is er een plek waar we de code hoeven te wijzigen als wij dit willen veranderen.

De Answer class is een extensie van de Post class. Hierdoor moeten de velden die in de Post class staan via super aangeroepen worden. Dit is te zien in de constructor. 
Om de toString() uit te voeren met de private eigenschappen van de Post class. Moeten we de get methode van de Post class oproepen. Dit doen wij door super te gebruiken bij het oproepen van de Post class getter methode.

Als een object van de Answer class gemaakt is. Dan werken nog alle public methods, en dus ook de getter en setter methods, van de Post class. Het is dus mogelijk om de id te krijgen door [object naam].id() te gebruiken.

##### UML

![Answer UML](./afbeeldingen/classes/Answer%20class.png)

##### Code
```typescript
import { api } from "@hboictcloud/api";
import { Post } from "./post";

export class Answer extends Post {
    //private fields
    private _questionID: number;
    private _isAnswerAccepted: boolean;

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string, questionID: number, isAnswerAccepted: boolean, username: string, expertise: string, isModified: boolean) {
        super(id, userID, content, codeSnippet, username, expertise, creationDate, dateModified, isModified);
        this._questionID = questionID;
        this._isAnswerAccepted = isAnswerAccepted;

    }

    //getters and setters
    ***

    //database functions
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(`
            UPDATE answer
            SET content = ${super.content}, codeSnippet = ${super.codeSnippet}, isAnswerAccepted = ${this.isAnswerAccepted})
            WHERE anwerID = ${super.id};
            `);
        } catch (error) {
            console.error(error);
        }
    }

    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(`
                DELETE FROM answer
                WHERE answerID = ${super.id};
            `);
        } catch (error) {
            console.error(error);
        }
    }

    //add elements to dom
    public printAnswersList(loggedinUserID: number): void {
        ***
    }
}

```

### Vote


## Front-end
Hieronder kommen de onderdelen: <!-- Ontwerp gedachte,  -->LESS, Bootstrap, Navbar, Vraag toevoegen en search bar . 
Voor de uitleg van de aangegeven zal ik code snippets, images en uitleg in eigen woorden gebruiken.

### LESS
Binnen dit project hebben we ervoor gekozen om LESS te gebruiken om de website te stylen. Maar wat is LESS? LESS is een extention van CSS, wat de code makkelijker en efficienter maakt. Dit komt doordat je gebruik kan maken van variabelen, nesting en mixins. Nesting in CSS betekent dat je stijlregels binnen andere regels plaatst om de opmaak van specifieke elementen te organiseren. Mixins zijn herbruikbare codeblokken in CSS voor toepassing van meerdere stijlregels op verschillende elementen (hier heb ik momenteel nog geen voorbeeld van). Deze dingen besparen je (vooral in grote projecten) niet alleen veel tijd, maar ook scheelt ook lines aan code. 

**Voorbeeld LESS variabel**    
```LESS
@main-color: #fcf9e7;
```

**Voorbeeld oproep LESS variabel**    
```LESS
background-color: @main-color;
```

**Voorbeeld Nesting in LESS**    
```LESS
.nav-item {
        list-style: none;
        padding: 0 10px;
        
        a.nav-link {
            color: @light-text-color;
        }
    
        &.active a.nav-link {
            color: @text-color;
            border-bottom: 5px solid @highlight-color;
        }
    
        &.account {
            margin-left: auto;
            padding: 0;
        }
    }
```   
<br>

### Bootstrap
Om makkelijk blokken die al gestyled, responsive en (deels) functioneel zijn te plaatsen op de website, gebruiken we Bootstrap. Dit is scheelt heel erg veel tijd, aangezien je dingen zoals een navbar niet meer vanaf scratch hoeft te schrijven. Bootstrap werkt door de aangewezen links (te vinden op de bootstrap website), te plaatsen in de HTML bestanden waarbinnen je Bootstrap wilt gebruiken. Als je dit hebt gedaan kan je naar de website gaan en zoeken naar dingen die je wilt gebruiken. Dit kan je dan kopiëren en in je bestand plakken op de gewenste plek, en dan heb je een volledige gestyled en responsive blok op je website. 

**Hoe Bootstrap word opgeroepen ("link" in head, "Script" onderaan body)**
```HTML
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

```
<br>

### Navbar
De navbar op onze website komt van bootstrap, en is daarna met LESS naar onze wens gemaakt. De classes die zijn toegewezen aan de HTML elementen zijn zodat de bootstrap styling en functionaliteiten kunnen worden toegepast. Door die zelfde classes aan te spreken in LESS, kunnen wij deze blokken naar onze wens aanpassen. Een specifieke class genaamd 'active', maakt het mogelijk om het blok met die class apart te stylen. Dit is erg handig om op de website te kunnen tonen op welke pagina de gebruiker op dat moment is.

**HTML voor de navbar**
```HTML
<nav class="navbar navbar-expand-lg navbar-light">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
                          
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="questions.html">Questions</a>
            </li>
            <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
            <li class="nav-item account">
                <span id="profile" class="nav-link profile">Profile</span>
            </li>
        </ul>
    </div>
</nav>
```   

**Extra LESS code om navbar naar eigen wens te maken**
```LESS
ul.navbar-nav {
    width: 100%;

    .nav-item {
        list-style: none;
        padding: 0 10px;
        
        a.nav-link {
            color: @light-text-color;
        }
    
        &.active a.nav-link {
            color: @text-color;
            border-bottom: 5px solid @highlight-color;
        }
    
        &.account {
            margin-left: auto;
            padding: 0;
        }
    }
}
```
<br>

### Searchbar (WIP)
In de navbar is er een search bar te vinden. Deze is geplaatst door middel van bootstrap, en daarna aangepast naar wens met eigen LESS code. Zoals vermeld is dit nog een work in progress,en is het op kleinere schermen nu nog niet zichtbaar. 

**HTML voor de searchbar**
```HTML
<form class="form-inline my-2 my-lg-0">
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
</form>
```

**Extra LESS code om searchbar naar wens te maken** 
```LESS
 .form-inline {
    display: none;
                
    @media screen and (min-width: @screen-lg-min) {
        display: flex;
        flex-wrap: nowrap;
        flex: 1;
        margin: 0 20px;
    }
        
    .form-control {
        width: 100%;
    }
        
    button {
        color: @main-color;
        border-color: @accent-color;
        background-color: @accent-color;
            
        &:hover {
            background-color: @button-hover-color;
            border-color: @button-hover-color;
        }
    }  
}
```
<br>

### Media queries (CSS)
Om elementen op handmatige manier responsive te maken gebruiken we 'media queries'. Media queries worden gebruikt in CSS om zogenaamde 'breakpoints' aan te geven en op basis hiervan blokken styling te geven. Wil jij bijvoorbeeld dat een font size kleiner word wanneer het scherm kleiner is dan 500px, dan kan je dat aangeven met een media query. Hieronder zullen een paar media queries volgen die wij gebruiken op de website.

**Voorbeeld van media query waarvan de code ingaat wanneer het scherm minimaal 992 pixels breed is**
```LESS
@screen-lg-min: 992px;

@media screen and (min-width: @screen-lg-min) {
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
    margin: 0 20px;
}
```   

**Voorbeeld van media query waar de geselecteerde blokken, bepaalde styling mee moet krijgen als het beeld maximaal 991px breed is**
```LESS
@screen-md-max: 991px;

@media screen and (max-width: @screen-md-max) {
    .navbar {
        justify-content: end;
    }
    ul.navbar-nav li{
        width: fit-content;
        margin-left: auto;
        text-align: right;

        a {
            width: fit-content;
        }
    }
}
```

## Bronnen







