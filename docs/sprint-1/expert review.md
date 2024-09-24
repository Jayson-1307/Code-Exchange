# Expert review

## Inhoudsopgaven

1. [Wat willen wij met dit document laten zien](#wat-willen-wij-met-dit-document-laten-zien)
2. [K5 Object georiënteerd programmeren](#k5-object-georiënteerd-programmeren)
3. [K6 Relationele database](#k6-relationele-database)
4. [K7 Werk beschreven met UML](#k7-werk-beschreven-via-uml)
5. [G4 Werk volgens kwaliteitsnormen](#g4-werk-volgens-kwaliteitsnormen)
6. [G6 Gebruikt bronnen op een passende manier](#g6-gebruikt-bronnen-op-een-passende-manier)
7. [Bronnen](#bronnen)


## Wat willen wij met dit document laten zien
Met dit document laten wij zien dat wij de kwaliteits- en gedragscriteria van de opleiding HBO-ICT begrijpen en ook gebruikt hebben in ons project. De onderdelen zijn per kwaliteits- en gedragscriteria gescheiden. Eerst de kwaliteitscriteria en daarna de gedragscriteria. 
Voor het gemak is een inhoudsopgaven aan het begin van dit document gemaakt. Aan het einde van dit document bevinden de bronnen die gebruikt zijn met het maken van deze documentatie.


## K5 Object georiënteerd programmeren
Met het onderdeel "K5 Object georiënteerd programmeren" geven wij bewijs dat we volgens [de richtlijnen van de opleiding HBO-ICT Object georiënteerd programmeren](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/oop/0_oop_intro/) gewerkt hebben. Dat doen wij door de "Object georiënteerd programmeren" per onderdeel te benoem met voorbeelden uit het project als bewijs.

Verder hebben we voor een beter beeld van object georiënteerd programmeren gebruik gemaakt van ["Programming Foundations: Object-Oriented Design" door "Barron Stone en Olivia Chiu Stone"](https://www.linkedin.com/learning/programming-foundations-object-oriented-design-3/).

### Abstraction
Hieronder is een voorbeeld van "Abstraction". Dit is gebruik van abstractie, omdat het mogelijk is veel meer info van een gebruiker in de class te stoppen. Dat is overbodige informatie die niet nodig is voor het programma. Hier is dus abstractie gebruikt om alleen de nodige informatie te gebruiken.

![User class](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/raw/main/docs/afbeeldingen/classes/User%20class.png?ref_type=heads)


#### User class
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

    //getters and setters
    ***
    //database functions
    ***
}
```
### Encapsulation
Hieronder is een voorbeeld van "Encapsulation". Dit is gebruik van inkapseling, omdat de eigenschappen afgeschermd zijn en alleen bekeken en bewerkt kan worden door gebruik te maken van de methode van de class zelf. 

![Profile class](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/raw/main/docs/afbeeldingen/classes/Profile%20class.png?ref_type=heads)

#### Profile class
```typescript
import { api } from "@hboictcloud/api";
export class Profile {
    // private fields
    private _id: number;
    private _userID: number;
    private _birthdate: string;
    private _experience: number;
    private _expertise: string;
    private _title: string;
    private _about: string;
    private _gitlab: string;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(id: number, userID: number, birthdate: string, experience: number, expertise: string, title: string, about: string, gitlab: string) {
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

    public get birthdate(): string {
        return this._birthdate;
    }

    public get experience(): number {
        return this._experience;
    }

    ***
    public set birthdate(value) {
        this._birthdate = value;
    }

    public set experience(value) {
        this._experience = value;
    }
    ***
    //database functions
    ***
}
```


### Inheritance
Hieronder is een voorbeeld van "Inheritance". Dit is gebruik van erfenis, omdat de classes Question en Answer de class Post gebruikt voor de overeenkomende eigenschappen en methoden. Dit is dus een goede manier om code te hergebruiken. 

![Post, Question and Answer class](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/raw/main/docs/afbeeldingen/classes/Post%20Answer%20Question%20classes.png?ref_type=heads)

#### Post Class

```typescript
export class Post {
    // private fields
    private _id: number;
    private _userID: number;
    private _content: string;
    private _codeSnippet: string;
    private _creationDate: string;
    private _dateModified: string;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string) {
        this._id = id;
        this._userID = userID;
        this._content = content;
        this._codeSnippet = codeSnippet;
        this._creationDate = creationDate;
        this._dateModified = dateModified;
    }
    //getter and setters
    ***
    
    public toString(): string {
        return `Post: ${this._id} ${this._userID} ${this._content} ${this._codeSnippet} ${this._creationDate} ${this._dateModified}`;
    }

    //database functions
    ***
}
```

#### Question Class

```typescript
import { api } from "@hboictcloud/api";
import { Post } from "./post";

export class Question extends Post {
    //private fields
    private _title: string;

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string, title: string) {
        super(id, userID, content, codeSnippet, creationDate, dateModified);
        this._title = title;
    }

    //getters and setters
    ***

    public toString(): string {
        return `${super.toString()} Question: ${this.title}`;
    }

    //database functions
    ***
}
```

#### Answer Class

```typescript
import { api } from "@hboictcloud/api";
import { Post } from "./post";

export class Answer extends Post {
    //private fields
    private _questionID: number;
    private _isAnswerAccepted: boolean;

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string, questionID: number, isAnswerAccepted: boolean) {
        super(id, userID, content, codeSnippet, creationDate, dateModified);
        this._questionID = questionID;
        this._isAnswerAccepted = isAnswerAccepted;
    }

    //getters and setters
    ***
    public toString(): string {
        return `${super.toString()} Answer: ${this._questionID} ${this._isAnswerAccepted}`;
    }

    //database functions
    ***
}
```

### Polymorphism
Hieronder is een voorbeeld vaan "Polymorphism". Dis is gebruik van polymorfisme, omdat de classen Question en Answer beide dezelfde methoden naam gebruiken voor update() en delete() en roep je de methoden op dezelfde manier op. Toch is functie inhoudelijk anders. Hierdoor kan de uitkomst erg verschillen en de functie om de uitkomst te bereiken ook.

![Post, Question and Answer class](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/raw/main/docs/afbeeldingen/classes/Post%20Answer%20Question%20classes.png?ref_type=heads)

#### Post class

```typescript
export class Post {
    // private fields
    private _id: number;
    private _userID: number;
    private _content: string;
    private _codeSnippet: string;
    private _creationDate: string;
    private _dateModified: string;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string) {
        this._id = id;
        this._userID = userID;
        this._content = content;
        this._codeSnippet = codeSnippet;
        this._creationDate = creationDate;
        this._dateModified = dateModified;
    }

    // Getters en setters
    ***
    public toString(): string {
        return `Post: ${this._id} ${this._userID} ${this._content} ${this._codeSnippet} ${this._creationDate} ${this._dateModified}`;
    }

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

#### Question class

```typescript
import { api } from "@hboictcloud/api";
import { Post } from "./post";

export class Question extends Post {
    //private fields
    private _title: string;

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string, title: string) {
        super(id, userID, content, codeSnippet, creationDate, dateModified);
        this._title = title;
    }

    //getters and setters
    ***

    public toString(): string {
        return `${super.toString()} Question: ${this.title}`;
    }

    //database functions
    public async update(): Promise<void> {
        try{
            await api.queryDatabase(`
            UPDATE question
            SET title = ${this._title}, content = ${super.content}, codeSnippet = ${super.codeSnippet})
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
}
```

#### Answer class

```typescript
import { api } from "@hboictcloud/api";
import { Post } from "./post";

export class Answer extends Post {
    //private fields
    private _questionID: number;
    private _isAnswerAccepted: boolean;

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string, questionID: number, isAnswerAccepted: boolean) {
        super(id, userID, content, codeSnippet, creationDate, dateModified);
        this._questionID = questionID;
        this._isAnswerAccepted = isAnswerAccepted;
    }

    //getters and setters
    ***

    public toString(): string {
        return `${super.toString()} Answer: ${this._questionID} ${this._isAnswerAccepted}`;
    }

    //database functions
    public async update(): Promise<void> {
        try{
            await api.queryDatabase(`
            UPDATE answer
            SET content = ${super.content}, codeSnippet = ${super.codeSnippet}, isAnswerAccepted = ${this._isAnswerAccepted})
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
}
```


## K6 Relationele database
Met het onderdeel "K6 Relationele database" geven wij bewijs dat we volgens [de richtlijnen van de opleiding HBO-ICT Relationele Databases Ontwerpen](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/relationele_databases/0_relationele_databases/) gewerkt hebben.

### Ontwerp
Hierin geven we het ontwerp van de database weer. Dit doen wij door middel van de ERD (Entity Relationship Diagram) en de EERD (Extended Entitiy Relationship diagram) hieronder te tonen onder hun eigen kopjes.

#### Entity Relationship Diagram

![ERD database](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/raw/main/docs/afbeeldingen/database/ERD%20database.png?ref_type=heads)


#### Extended Entitiy Relationship diagram

![EERD database](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/raw/main/docs/afbeeldingen/database/EERD%20database.png?ref_type=heads)

### Create     
De volgende code snippet in SQL is gebruikt voor het maken van de tabel question in de database.

```sql
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
```

### Delete
De volgende code snippet in Typsecript is gebruikt voor het verwijderen van gebruikers gegevens in de database.

```typescript
//uses data from class User to delete user from database 
public async delete(): Promise<void> {
    try {
        const query = `
        DELETE FROM user
        WHERE userID = ${this._userID};
        `;
        await api.queryDatabase(query);
    } catch (error) {
        console.log(error);
    }
}
```

### Insert into
De volgende code snippet in Typescript is gebruikt voor het toevoegen van nieuwe gebruikers gegevens in de database.

```typescript
//add user to database
export async function addUser(username: string, password: string, email: string, firstname: string, preposition: string, lastname: string): Promise<void> {
    try {
        const query = `
        INSERT INTO user (username, password,email, firstname, preposition, lastname) 
        VALUES (${username}, ${password}, ${email}, ${firstname}, ${preposition}, ${lastname});
        `;
        const data: any = await api.queryDatabase(query);
    } catch (error) {
        console.error(error);
    }
}
```

### Select
De volgende code snippet in Typescript wordt gebruikt voor het selecteren van gebruikers gegevens vanuit de database, als username en password beide voor dezelfde gebruiker overeenkomen.

```typescript
/**
 * if password and username match, will return the fetched data from the database in an array, else return empty array
 * @param username entered username on login
 * @param password entered password on login
 * @returns Array with the user data
 */
async function loginFromDatabase(username: string, password: string): Promise<Array<any> | undefined> {
    try {
        const query = "SELECT userID FROM user WHERE username = ? AND password = ?",
            username,
            password
        const data: any = await api.queryDatabase(query);
        return data;
    } catch (error) {
        return [];
    }
}
```

### Update
De volgende code snippet in Typescript is gebruikt voor het updaten van de gebruikers gegevens met nieuwe gegevens in de database.

```typescript
//uses data from class User to update user data inside the database
public async update(): Promise<void> {
    try {
        const query = `
        UPDATE user
        SET username = ${this._username}, email = ${this._email}, firstname = ${this._firstname}, preposition = ${this._preposition}, lastname = ${this._lastname}
        WHERE userID = ${this._userID};
        `;
        await api.queryDatabase(query);
    } catch (error) {
        console.error(error);
    }
}
```


## K7 Werk beschreven via UML
Met het onderdeel "K7 Werk beschreven via UML" geef ik bewijs dat ik volgens [de richtlijnen van de opleiding HBO-ICT Unified Modeling Language (UML)](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/uml/0_uml/) gewerkt heb.

[De gehele technische documentatie voor verder voorbeelden](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/technische%20documentatie.md?ref_type=heads#technische-documentatie)

### UML Class Diagram

![UML Class Diagram](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/raw/main/docs/afbeeldingen/classes/All%20Classes%20Diagram%20V3.png?ref_type=heads)


## G4 Werk volgens kwaliteitsnormen
Tijdens het werken aan ons project hanteren we nog steeds de richtlijnen van de opleiding HBO-ICT voor de onderdelen van [Code conventies](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/0_code_conventies/), zoals [Naamgeving](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/naamgeving/0_naamgeving/), [Commentaar](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/code_commentaar/), [Code layout](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/code_layout/) en vermijden van [Magic numbers](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/magic_numbers/). Dit is terug te zien in de voorbeelden van [K6 Relationele database](#k6-relationele-database).


## G6 Gebruikt bronnen op een passende manier.
De bronnen zijn onderaan bij "[Bronnen](#bronnen)" in het document genoteerd zodat deze overzichtelijk te bekijken zijn. Bij alle bronnen staat aangegeven waarvan ze zijn en gelinkt naar waar ze staan op het web. Hierdoor zijn ze dus makkelijk terug te vinden en te controleren.

Tevens zijn bij alle onderdelen de daarvoor gebruikte bronnen nog eens vermeld voor de duidelijkheid.

## Bronnen
Gelinkte documenten:
* [Technische documentatie](https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/technische%20documentatie.md?ref_type=heads#technische-documentatie)

Bronnen van school:
* [HBO-ICT Object geörienteerd programmeren](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/oop/0_oop_intro/)
* [HBO-ICT Relationele Databases Ontwerpen](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/relationele_databases/0_relationele_databases/)
* [HBO-ICT Unified Modeling Language (UML)](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/uml/0_uml/)
* [HBO-ICT Code Conventies](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/0_code_conventies/)
* [HBO-ICT Naamgeving](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/naamgeving/0_naamgeving/)
* [HBO-ICT Commentaar](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/code_commentaar/)
* [HBO-ICT Code layout](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/code_layout/)
* [HBO-ICT Magic numbers](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/realiseren/code_conventies/magic_numbers/)

Bronnen buiten school:
* ["Learn Typescript" cursus van Codecademy](https://www.codecademy.com/learn/learn-typescript)
* ["Programming Foundations: Object-Oriented Design" door "Barron Stone en Olivia Chiu Stone"](https://www.linkedin.com/learning/programming-foundations-object-oriented-design-3/)
* ["Bootstrap Navbar"](https://getbootstrap.com/docs/4.0/components/navbar/)   
* ["Huemint - Kleurenschema"](https://huemint.com/website-3/#palette=fcf9e7-d6dadc-00215b-055fa5-f5561f-f9ca16)
* ["Stack Overflow - Fill the remaining height or width in a flex container"](https://stackoverflow.com/questions/37745051/fill-the-remaining-height-or-width-in-a-flex-container)





<!--
sprint 1
| 2 | K5 | Je hebt object georiënteerd geprogrammeerd en maakt gebruik van objectgeoriënteerde technieken zoals abstraction, inheritance en encapsulation. | S-O, S-R |
| 2 | K6 | Je hebt een genormaliseerde relationele database ontworpen en gebruikt om informatie uit je project in op te slaan, op te halen en te bewerken. | S-O, S-R |
| 2 | K7 | Je hebt je werk beschreven met behulp van UML-technieken. | S-R, S-MC |

| 4 | G4 | Je werkt volgens (gegeven) kwaliteitsnormen. | TO-M |
| 4 | G6 | Je gebruikt bronnen om antwoorden te vinden op een passende manier. | OP-O |
-->


<!-- 
https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/sprint-1/expert%20review.md?ref_type=heads#expert-review

K5 - zelf: Op niveau / docent: 
Via deze onderdeel worden de bewijzen van "Object georiënteerd programmeren" getoond.
(zie bewijs).
Url:
https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/sprint-1/expert%20review.md?ref_type=heads#k5-object-geori%C3%ABnteerd-programmeren


K6 - zelf: Op niveau / docent: 
Via deze onderdeel worden de bewijzen van "Relationele database" getoond.
(zie bewijs).
Url:
https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/sprint-1/expert%20review.md?ref_type=heads#k6-relationele-database


K7 - zelf: Op niveau / docent: 
Via deze onderdeel worden de bewijzen van het gebruik van UML getoond.  
(zie bewijs).
Url:
https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/sprint-1/expert%20review.md?ref_type=heads#k7-werk-beschreven-via-uml

G4 - zelf: Op niveau / docent: 
Via deze onderdeel worden de bewijzen van het "Werk volgens kwaliteitsnormen" getoond.
(zie bewijs).
Url:
https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/sprint-1/expert%20review.md?ref_type=heads#g4-werk-volgens-kwaliteitsnormen


G6 - zelf: Op niveau / docent:
Via deze onderdeel worden de bewijzen van het "Gebruikt bronnen op een passende manier" getoond.
(zie bewijs).
Url:
https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/sprint-1/expert%20review.md?ref_type=heads#g6-gebruikt-bronnen-op-een-passende-manier


Bronnen
Url:
https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-d-se-gd/blok-2/joovuuzeefee27/-/blob/main/docs/sprint-1/expert%20review.md?ref_type=heads#bronnen


Gekregen feedback
 -->