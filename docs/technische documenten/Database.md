# Technische documentatie

## Inhoudsopgaven
1. [Wat willen wij met dit document laten zien](#wat-willen-wij-met-dit-document-laten-zien)
2. [Database](#database)  
    1. [Ontwerp gedachte](#ontwerp-gedachte)   
    2. [Database ERD, Entity Relationship Diagram](#database-erd-entity-relationship-diagram)
    3. [Database EERD, Extended Entitiy Relationship diagram](#database-erd-entity-relationship-diagram)
    4. [Creatie database](#creatie)



## Wat willen wij met dit document laten zien
Het doel van dit document is om andere uitleg te geven, over hoe ons project in elkaar zit en werkt.

Dit document is in andere documenten uitgespreid, zodat het overzichtelijk blijft zonder dat te veel onderdelen op één pagina staan en het onoverzichtelijk wordt.
Klik hieronder op de gewenste onderdeel.
* [Technische documentatie](../technische%20documentatie.md)
* [Database](./Database.md)
* [Classen](./Classen.md)
* [Front-End](./Front-End.md)

## Database
Hieronder komen de onderdelen: Het idee van het ontwerp, ERD (Entity Relationship Diagram), EERD (Extended Entitiy Relationship diagram), en daarna de individuele onderdelen aan orde.

De verdere interactie zal opgeroepen worden door andere onderdelen van het programma zoals een class User. De code zal dan dus bij de class staan.

### Ontwerp gedachte
De gedacht achter het ontwerp van onze database is:
De website moet bijhouden wat bij welke gebruiker hoort, dus een user
De user moet een gekoppelde profiel hebben om info van de gebruiker te kunnen delen, dus via userID
De user moet een vraag kunnen stellen, dus een question. Gekoppeld via userID
De user moet een antwoord op een vraag kunnen stellen, dus een answer. Gekoppeld via userID en question. Hierdoor is te achterhalen waar de antwoord hoort.
De user moet een beoordeling van de kwaliteit van het antwoord kunnen geven, dus een vote. Gekopppeld via userID en answerID.
 
Alle gebruikers zonder account:
Moeten kunnen: profiel bekijken en score zien, vragen zien, antwoorden zien, en scores voor elke antwoord kunnen zien.

### Database ERD, Entity Relationship Diagram 

![ERD Database](../afbeeldingen/database/ERD%20database.drawio.png)

### Database EERD, Extended Entitiy Relationship diagram

![EERD Database](../afbeeldingen/database/EERD%20database.png)


### Creatie database
De creatie staat opgeslagen in het database bestand onder src > sql.

Daarin staat de volgende SQL-code die gebruik is bij het maken van de database op HBO-iCT.Cloud omgeving dat gebruik maakt van phpMyAdmin. De code is toen direct in de SQL kopje gestopt en uitgevoerd.

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
