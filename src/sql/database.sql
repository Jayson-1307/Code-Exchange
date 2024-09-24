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