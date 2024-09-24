# Technische documentatie

## Inhoudsopgaven
1. [Wat willen wij met dit document laten zien](#wat-willen-wij-met-dit-document-laten-zien)
3. [Classen](#classen)
    1. [UML CLass Diagram](#uml-class-diagram)
    2. [UserManager](#usermanager)
    3. [AbstractUser](#abstractuser)
    4. [User](#user)
    5. [Profile](#profile)
    6. [PostManager](#postmanager)
    7. [Post](#post)
    8. [Question](#question)
    9. [Answer](#answer)



## Wat willen wij met dit document laten zien
Het doel van dit document is om andere uitleg te geven, over hoe ons project in elkaar zit en werkt.

Dit document is in andere documenten uitgespreid, zodat het overzichtelijk blijft zonder dat te veel onderdelen op één pagina staan en het onoverzichtelijk wordt.
Klik hieronder op het gewenste onderdeel.
* [Technische documentatie](../technische%20documentatie.md)
* [Database](./Database.md)
* [Classen](./Classen.md)
* [Front-End](./Front-End.md)

### UML CLass Diagram

![UML Class Diagram V5](../afbeeldingen/classes/Class%20Diagram%20V5.drawio.png)

### UserManager
De UserManager wordt gebruikt om alles te beheren wat met de gebruiker te maken heeft. Het maak gebruik van een API voor de interactie met de server, en gebruikt sessions voor de gebruikers authenticatie. 
De UserManager kan:
* gebruikers toevoegen aan de database,
* gebruikers in- en uitloggen,
* gebruikers profiel toevoegen aan de database,

#### UML

![UserManager UML](../afbeeldingen/classes/Class%20UserManager.drawio.png)

#### addUser
Deze methode voegt een nieuwe gebruiker toe aan de database. Dit wordt gedaan door de gebruikers en profiel informatie toe te voegen aan de database.
Het valideert de ingevulde gegevens, laat error berichten zien, en als alles succesvol stuurt het de gebruiker naar de hoofdpagina.

Return: niks

```typescript
    public async addUser(): Promise<void> 
```

#### verifyUser
Deze methode verifieerd of de gebruiker is ingelogd. Dit wordt gedaan doormiddel van de sessions.

Return: boolean, waar als ingelogd en anders onwaar.

```typescript
    public verifyUser(): boolean 
```

#### login
Deze methode handelt de login. Dit wordt gedaan door de gegeven gebruikersnaam en paswoord te vergelijken met de database. Als succesvol dan wordt de gebruiker id in de sessions gezet, en de gebruiker wordt naar de hoofdpagina gestuurd. Als het niet lukt, laat dan een error bericht zien.

Parameter username: ingevuld door gebruiker
Parameter password: ingevuld door gebruiker
```typescript
    public async login(username: string, password: string): Promise<void>
```

#### logout
Deze methode wordt gebruikt om de gebruiker die ingelogd, uit te loggen. Dit wordt gedaan door de gebruiker uit session te verwijderen, en daarna de gebruiker naar de hoofdpagina te sturen 

```typescript
    public logout(): void 
```

#### fetchUserData
Deze methode haalt de gebruikers gegevens op vanuit de database, dit wordt gedaan door de meegegeven userID.

Paramater userID: dit is de id van ingelogde gebruiker
Return: een array van gebruiker data

```typescript
    public async fetchUserData(userID: number): Promise<Array<any>>
```

#### createUserObject
Deze methode maakt een User class object van de data dat wordt opgehaald door fetchUserData.
Het wordt ook gebruikt om de gebruiker van de session te verwijderen als de gebruiker nog ingelogd is, maar verwijderd is van de database.

Paramater userID: de id van de ingelogde gebruiker.
Return: User object

```typescript
    public async createUserObject(userID: number): Promise<User> 
```

#### fetchProfileData
Deze methode haalt de gebruikers profiel gegevens op vanuit de database, dit wordt gedaan door de meegegeven userID.

Paramater userID: dit is de id van ingelogde gebruiker
Return: een array van gebruiker's profiel data

```typescript
    public async fetchProfileData(userID: number): Promise<Array<any>>
```

#### createProfileObject
Deze methode maakt een Profile class object van de data dat wordt opgehaald door fetchProfileData.

Paramater userID: de id van de ingelogde gebruiker.
Return: Profile object

```typescript
    public async createProfileObject(userID: number): Promise<Profile> 
```    

#### loggedIn
Deze methode wordt gebruikt om zichtbare elementen te laten zien, op basis van de status of de gebruiker ingelogd is of niet.

```typescript
    public async loggedIn(): Promise<void> 
```

#### setupIfLoggedIn
Deze methode past de pagina aan voor een gebruiker die ingelogd is. Het maakt event listeners, User class object, en laat de gebruikers zijn naam op de pagina zien.

Return: User class object
```typescript
    public async setupIfLoggedIn(): Promise<User> {
```

#### setupIfLoggedOut
Deze methode past de pagina aan voor een gebruiker die niet ingelogd is. Het maakt een event listener, laat error bericht zien, stuurt de gebruiker naar de login pagina.

```typescript
    public async setupIfLoggedOut(): Promise<boolean> {
```

### AbstractUser
De AbstractUser class wordt als abstract gebruikt. Hierdoor hoeven de overeenkomende velden tussen User class en de Profile class maar op een plek aangepast te worden.

#### UML

![AbstractUser UML](../afbeeldingen/classes/Class%20UserManager.drawio.png)

#### Attributes en Constructor
```typescript
    public constructor(
        public id: number, 
        public username: string, 
        protected _email: string
        ) {}
```

#### ToString
Deze methode wordt gebruik om een representatie van de AbstractUser class als string te krijgen.

```typescript
    public toString(): string 
```

#### Update
Deze methode is een tijdelijke aanduiding functie voor het updaten van de AbstractUser in de database. Het print een error.

```typescript
    public async update(): Promise<void>
```

#### Delete
Deze methode is een tijdelijk aanduiding functie voor het verwijderen van de AbstractUser in de database. Het print een error.        

```typescript
    public async delete(): Promise<void>
```

### User
De User class gebruikt inheritance op de AbstractUser class.
De User class wordt gebruikt voor als representatie van een gebruiker. Het kan de gebruiker updaten en verwijderen, van de database doormiddel van het gebruik van een API.  

#### UML   
![User](../afbeeldingen/classes/Class%20AbstractUser%20User.drawio.png)

#### Code

#### Attributes en Constructor
Dit initialiseert de instatie van de User class.
<!-- initialiseren = het voorbereiden/ klaar zetten van gegevens voordat het programma echt aan het werk gaat-->
``` typescript
    public constructor(
        id: number,
        username: string,
        email: string,
        private _firstname: string,
        private _preposition: string,
        private _lastname: string
    ) {
        super(id, username, email);
    }
```

#### Getters en Setters
De getter userNames wordt gebruikt om de aanwezige gegevens terug te sturen voor berichten die aan de gebruiker getoond worden.

Return: stuurt het bericht terug
```typescript
    public get userNames (): string
```

#### ToString
Deze methode stuurt een string terug dat een representatie van de User instantie als string is.
```typescript
    public toString(): string
```

#### Update
Deze methode wordt gebruikt om de gebruikers gegevens in de database te updaten, doormiddel van een API.

```typescript
    public async update(): Promise<void>
```

#### Delete
Deze methode wordt gebruikt om de gebruiker uit de database te verwijderen, door middel van een API

```typescript
    public async delete(): Promise<void>
```

### Profile
De Profile class gebruikt inheritance op de AbstactUser class.
De Profile class wordt gebruikt om een pagina over de gebruiker te tonen. Deze informatie is beschikbaar voor andere als de gebruiker deze gegevens heeft ingevuld. Dit zijn onder andere: geboortedatum, jaar ervaring, expertise level, titel van pagina, omschrijving gebruiker, Gitlab gebruikersnaam.

#### UML   
![Profile UML](../afbeeldingen/classes/Class%20AbstractUser%20Profile.drawio.png)

#### Attributes en Constructor
Dit initialiseert de instatie van de User class.
<!-- initialiseren = het voorbereiden/ klaar zetten van gegevens voordat het programma echt aan het werk gaat-->
``` typescript
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
```

#### ToString
Deze methode stuurt een string terug dat een representatie van de User instantie als string is.
```typescript
    public toString(): string
```

#### Update
Deze methode wordt gebruikt om de profiel gegevens in de database te updaten, doormiddel van een API.

```typescript
    public async update(): Promise<void>
```

#### Delete
Deze methode wordt gebruikt om het profiel uit de database te verwijderen, door middel van een API

```typescript
    public async delete(): Promise<void>
```

#### FillprofileContent
Deze methode wordt gebruikt om de profielinformatie uit de database te halen, en dit op de profiel pagina te tonen. 

```typescript
    public async fillProfileContent(): Promise<void>
```

#### updateProfile
Deze methode wordt gebruikt om de informatie van een profiel te updaten, zodat incorrecte gegevens aangepast kunnen worden, en zo op juiste manier getoond kunnen worden op een profiel. 

```typescript
    public async updateProfile(): Promise<void>
```

### PostManager
De PostManager wordt gebruikt om alles met de antwoorden en vragen te beheren.
Voor de interactie met de database wordt gebruikt gemaakt van een API.
De PostManager kan:
* vragen en antwoorden aanmaken.
* een informatie van vragen en antwoorden van de server halen.

#### UML

![PostManager UML](../afbeeldingen/classes/Class%20PostManager.drawio.png)


<!-- code -->
####  addQuestion
Deze methode wordt gebruikt om een vraag in de database te stoppen.
Het valideert de ingevulde gegevens, laat error berichten zien, en stuurt de gebruiker naar de question detail pagina als alles succesvol is.

Parameter userID: is het id van de huidige gebruiker.
Return : is een questionID van de nieuwe vraag.
```typescript
    public async addQuestion(userID: number): Promise<Array<any>>
```
 
#### addAnswer
Deze methode wordt gebruikt om een antwoord in de database te stoppen.
Het valideert de ingevulde gegevens, laat error berichten zien, en stuurt de gebruiker naar de question detail pagina als alles succesvol is.

Parameter userID: is het id van de huidige gebruiker.
Parameter questionID: is het id van de vraag waar dit een antwoord op is.
```typescript 
    public async addAnswer(userID: number, questionID: number): Promise<void> 
```

#### createQuestionOrAnswerObject
Deze methode converteert de opgehaalde data van de database naar Question en Answer classes aan de hand van de boolean
Het pas ook de Date type aan naar string, en het bekijkt of de Question of Answer bewerkt was.

Parameter fetchedData: dit is een array van data, opgehaald van de database
Parameter isQuestion: dit is een boolean om aan te geven of het een vraag of antwoord is.
Return: is een array van Question of Anwer classes.
```typescript
    public createQuestionOrAnswerObject(fetchedData: Array<any>, isQuestion: boolean): Array<any>
```

#### fetchQuestionsPageQuestionsList
Deze methode haalt een lijst van vragen bij de database op. Hierin zit ook de filter verwerkt. 

Return: is een array van de Question class.
```typescript
    public async fetchQuestionsPageQuestionsList(): Promise<Question[] | undefined>
```

#### rebuildQuestionOverview
Deze methode zorgt ervoor dat een question overview wordt leeggegooid, zodat deze weer opnieuw kan worden opgebouwd.

```typescript
    public async rebuildQuestionOverview(): Promise<void>
```

#### fetchMyQuestionsPageQuestionsList
Deze methode haalt een lijst van vragen op voor My Question pagina. Hiervoor wordt de userID gebruikt om alleen vragen van de gebruiker te tonen.

Parameter userID: dit is de huidige gebruiker
Return: een array van de Question class.
```typescript
public async fetchMyQuestionsPageQuestionList(userID: number): Promise<Question[] | undefined>
```
#### fetchIndexPageQuestionList
Deze methode haalt een lijst van de drie laatst gestelde vragen op voor de hoofdpagina

Return: een array van de Question class
```typescript

    public async fetchIndexPageQuestionList(): Promise<Question[] | undefined> 

```

#### fetchQuestionDeatilPageQuestion
Deze methode haalt een specifieke vraag op voor de Question Detail pagina.

Parameter questionID: dit is de id op de pagina.
Return: een array van de Question class
```typescript
    public async fetchQuestionDeatilPageQuestion(questionID: number): Promise<Question[] | undefined> 
```

### Post
De Post class wordt als abstract gebruikt. Hierdoor hoeven de overeenkomende velden tussen Question class en de Answer class maar op een plek aangepast te worden.

#### UML

![Post UML](../afbeeldingen/classes/Class%20Post.drawio.png)

#### Attributes en Constructor
Dit wordt gebruikt om een instantie van Post class te initialiseren.
```typescript
    public constructor(
        protected _id: number,
        protected _userID: number,
        protected _content: string,
        protected _codeSnippet: string,
        protected _username: string,
        protected _expertise: string,
        protected _creationDate: string,
        protected _dateModified: string,
        protected _isModified: boolean
    ) {}
```

#### ToString
Deze methode wordt gebruik om een representatie van de Post class als string te krijgen.

```typescript
    public toString(): string 
```

#### Update
Deze methode is een tijdelijke aanduiding functie voor het updaten van de post in de database. Het print een error.

```typescript
    public async update(): Promise<void>
```

#### Delete
Deze methode is een tijdelijk aanduiding functie voor het verwijderen van de post in de database. Het print een error.        

```typescript
    public async delete(): Promise<void>
```


#### Question
Deze class gebruikt inheritance van de Post class. Deze class vertegenwoordigt een vraag.
Het kan question in de database updaten en verwijderen, door middel van een API.
Het kan de vraag op de pagina weergeven.

##### UML

![Question UML](../afbeeldingen/classes/Class%20Post%20Question.drawio.png)

#### Attributes en Constructor
De constructor initialiseert de instantie van de Question.

```typescript
    public constructor(
        id: number,
        userID: number,
        content: string,
        codeSnippet: string,
        creationDate: string,
        dateModified: string,
        private _title: string,
        private _tags: string,
        username: string,
        expertise: string,
        private _answers: number,
        isModified: boolean
    ) {
        super(id, userID, content, codeSnippet, username, expertise, creationDate, dateModified, isModified);
    }
```

#### ToString
Deze methode keert terug een representatie van de instantie van de vraag als een string.

Return: string wat een representatie van deze geïnitialiseerd Question class.
```typescript
    public toString(): string 
```

#### Update
Deze methode wordt gebruikt om de vraag in de database te updaten, door het gebruik van de API.
```typescript
    public async update(): Promise<void>
```

#### Delete
Deze methode wordt gebruikt om de vraag uit de database te verwijderen, door het gebruik van de API.
```typescript
    public async delete(): Promise<void> 
```

#### printQuestionsList
Deze methode wordt gebruikt om de vraag weer te geven op de pagina's: Questions, My Questions, en de hoofdpagina.
```typescript
    public printQuestionsList(): void 
```

#### printQuestionDetailPageQuestion
Deze methode wordt gebruikt voor het weergeven van de vraag op de Question Detail pagina. Als de userID hetzelfde is als van de maker van de vraag, dan worden de knoppen bewerken en verwijderen gemaakt. 

Parameter loggedinUserID: Dit is de userID van de huidige gebruiker. Als de gebruiker niet is ingelogd dan 0.
```typescript
    public printQuestionDetailPageQuestion(loggedinUserID: number): 
```


#### Answer
Deze class gebruikt inheritance op de Post class. Deze class vertegenwoordigt een antwoord.
Het kan de antwoordt van de database verwijderen en updaten, door middel van de API.
Het kan de antwoordt op de pagina weergeven. 

##### UML

![Answer UML](../afbeeldingen/classes/Class%20Post%20Answer.drawio.png)


#### Attributen en Constructor
De constructor initiliseert de instantie van het antwoord.
```typescript
    public constructor(
        id: number,
        userID: number,
        content: string,
        codeSnippet: string,
        creationDate: string,
        dateModified: string,
        private _questionID: number,
        private _isAnswerAccepted: boolean,
        username: string,
        expertise: string,
        isModified: boolean,
        private _hasVoted: boolean,
        private _userVoteScore: number,
        private _averageVoteScore: number,
        private _countVotes: number
    ) {
        super(id, userID, content, codeSnippet, username, expertise, creationDate, dateModified, isModified);
    }
```

#### ToString
Deze methode wordt gebruikt om de instantie als string te tonen.

Return: string dat een representatie van de geïnitialiseerd Answer class.
```typescript
    public toString(): string 
```

#### Update
Deze methode wordt gebruikt om het antwoord in de database te updaten, dit wordt gedaan met de API.
```typescript
    public async update(): Promise<void> 
```

#### Delete
Deze methode wordt gebruikt om de antwoordt uit de database te verwijderen, dit wordt gedaan met de API.
```typescript
    public async delete(): Promise<void> 
```

#### PrintAnswersList
Deze methode wordt gebruikt om de antwoordt en de gemiddelde score van het antwoord op de Question Detail pagina te weergeven.
Het maakt knoppen voor updaten en verwijderen, als deze gebruiker degene is die het antwoordt gepost had.
Maakt score op de pagina. Door de muis wel of niet over het element te houden wordt een andere type score getoond. Gemiddelde score, gestemde score, en score die je nu gaat opslaan door te klikken. 

Parameter loggedinUserID: gebruikers id van huidige gebruiker.
```typescript
    public printAnswersList(loggedinUserID: number): void
```






