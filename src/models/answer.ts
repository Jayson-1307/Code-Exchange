import { api } from "@hboictcloud/api";
import { Post } from "./post";

/**
 * this extends Post, this is used to represent an answer to an question.
 * it can update, delete answers, using the API
 * it can render answers on the detail page.
 */
export class Answer extends Post {
    //attributes and constructor
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

    //getters and setters

    //this is used to return an string representation this instance, including the parent class
    public toString(): string {
        return `Post: ${super.toString()} 
        Answer: questionID: ${this._questionID} 
        isAnswerAccepted: ${this._isAnswerAccepted}`;
    }

    //database functions

    /**
     * this is used to create a not yet existing vote in the database
     * @param score the score given by the user
     * @param currentUserID the id of the loggedin user
     */
    private async createVote(score: number, currentUserID: number): Promise<void> {
        try {
            const query: string = `
            INSERT INTO vote (answerID, userID, voteScore)
            VALUES (?, ?, ?);
            `;
            console.log(query);
            console.log(this._id);
            console.log(currentUserID);
            console.log(score);
            await api.queryDatabase(query, this._id, currentUserID, score);
            alert("Vote is saved");
            location.reload();
        } catch (error) {
            console.error(error);
            alert("Error vote is not saved");
        }
    }

    /**
     * this is used to update an existing vote
     * @param score the score given by the user
     * @param currentUserID the is of the loggedin user
     */
    private async updateVote(score: number, currentUserID: number): Promise<void> {
        try {
            const query: string = `
            UPDATE vote
            SET voteScore = ?
            WHERE answerID = ?
            AND userID = ?
            `;
            await api.queryDatabase(query, score, this._id, currentUserID);
            alert("Vote is saved");
            location.reload();
        } catch (error) {
            console.error(error);
            alert("Error vote is not saved");
        }
    }

    /**
     * this is used to update the answer in the database
     */
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(
                `
            UPDATE answer
            SET content = ?, codeSnippet = ?
            WHERE answerID = ?;
            `,
                this._content,
                this._codeSnippet,
                this._id
            );
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * this is used to delete the answer from the database
     */
    public async delete(): Promise<void> {
        console.log(this.toString());
        console.log(this._id);
        try {
            const query: string = `
            DELETE FROM answer
            WHERE answerID = ?;
            `;
            await api.queryDatabase(query, this._id);
        } catch (error) {
            console.error(error);
        }
    }

    //check functions

    /**
     * check if content is not empty
     * @returns boolean if not empty true else false
     */
    private checkContent(): boolean {
        if (this._content === "" || this._content === "undefined") {
            return false;
        }
        return true;
    }

    //print functions

    /**
     * this is used to render the answer and score on the page.
     * add options of update and deletion. depending if this is the user who posted the answer.
     * render averageVote, if user has voted render while hovering just outside the stars the user voted score.
     * render amount of votes.
     * @param loggedinUserID current user
     */
    public printAnswersList(loggedinUserID: number): void {
        //parent id
        const parentHtmlId: string = "answers";
        const parent: HTMLElement = document.getElementById(parentHtmlId)!;

        //create container, easier to seperate
        const containerElement: HTMLElement = document.createElement("div");
        containerElement.className = "answer";

        //create container to seperate voting
        const votingContainer: HTMLElement = document.createElement("div");
        votingContainer.className = "votingContainer";

        const currentScoreContainer: HTMLElement = document.createElement("div");
        const listContainer: HTMLElement = document.createElement("ul");
        listContainer.className = "star-rating";

        //checking if this already has a vote, if not give a 3 score
        if (this._averageVoteScore === undefined || this._averageVoteScore === null) {
            for (let i: number = 0; i < 5; i++) {
                const star: HTMLElement = document.createElement("i");
                if (i < 3) {
                    star.className = "bi bi-star-fill null";
                } else {
                    star.className = "bi bi-star null";
                }
                //for first voter
                if (loggedinUserID !== 0) {
                    star.addEventListener("click", () => {
                        const score: number = i + 1;
                        this.createVote(score, loggedinUserID);
                    });
                }
                listContainer.appendChild(star);
            }
        } else {
            //if score exists show with icons
            for (let i: number = 0; i < 5; i++) {
                const star: HTMLElement = document.createElement("i");
                if (this._averageVoteScore > i) {
                    star.className = "bi bi-star-fill";
                } else {
                    star.className = "bi bi-star";
                }
                //give class to show your existing vote
                if (this._userVoteScore !== null) {
                    if (this._userVoteScore > i) {
                        star.className += " filledVoted";
                    } else {
                        star.className += " emptyVoted";
                    }
                }
                //if you didnt vote create vote, else update vote after clicking
                if (loggedinUserID !== 0) {
                    star.addEventListener("click", () => {
                        const score: number = i + 1;
                        if (this._userVoteScore === null || this._userVoteScore === undefined) {
                            this.createVote(score, loggedinUserID);
                        } else {
                            this.updateVote(score, loggedinUserID);
                        }
                    });
                }
                listContainer.appendChild(star);
            }
        }
        currentScoreContainer.appendChild(listContainer);
        votingContainer.appendChild(currentScoreContainer);

        //counter votes
        const countVotes: HTMLElement = document.createElement("div");
        countVotes.className = "countVotes";

        const printVotes: HTMLElement = document.createElement("p");
        printVotes.innerHTML = `(${this._countVotes})`;

        countVotes.appendChild(printVotes);
        votingContainer.appendChild(countVotes);

        //create container for answer part
        const mainContainer: HTMLElement = document.createElement("div");
        mainContainer.className = "mainContainer";
        //create question part on the page
        if (loggedinUserID === this._userID) {
            const buttonContainer: HTMLElement = document.createElement("div");
            buttonContainer.className = "buttonContainer";
            const editButton: HTMLElement = document.createElement("button");
            editButton.className = "edit-button btn button";
            editButton.innerHTML = "edit answer";
            editButton.addEventListener("click", () => {
                const contentBlock: HTMLElement = document.getElementById("answerContentBlock" + this._id)!;
                const codeBlock: HTMLElement | null = document.getElementById("answerCodeBlock" + this._id);
                //content is already changed and button is set to save
                if (contentBlock.contentEditable === "true") {
                    if (confirm("Do you want to save the changes?")) {
                        //store this.content, this makes checking possible
                        this._content = contentBlock.innerText;
                        if (codeBlock !== null) {
                            this._codeSnippet = codeBlock.innerText;
                            if (this.checkContent()) {
                                codeBlock.contentEditable = "false";
                            }
                        }
                        if (this.checkContent()) {
                            contentBlock.contentEditable = "false";
                            this.update();
                            editButton.innerHTML = "edit answer";
                            alert("Your answer is saved");
                        } else {
                            alert("Can't leave content empty");
                        }
                    }
                } else {
                    //click edit button
                    if (codeBlock !== null) {
                        codeBlock.contentEditable = "true";
                    }
                    contentBlock.contentEditable = "true";
                    editButton.innerHTML = "save answer";
                    alert("You can now edit your answer");
                }
            });

            buttonContainer.appendChild(editButton);

            const deleteButton: HTMLElement = document.createElement("button");
            deleteButton.className = "delete-button btn button";
            deleteButton.innerHTML = "delete answer";
            deleteButton.addEventListener("click", () => {
                if (confirm("Are you sure, you want to delete your answer?") === true) {
                    this.delete();
                    alert("Your answer is deleted");
                    location.reload();
                }
            });
            buttonContainer.appendChild(deleteButton);
            mainContainer.appendChild(buttonContainer);
        }

        //div question-body class
        const contentElement: HTMLElement = document.createElement("div");
        contentElement.id = "answerContentBlock" + this._id;
        contentElement.className = "answer-body";
        contentElement.innerHTML = this._content;
        mainContainer.appendChild(contentElement);

        //check if snipped exists
        if (this._codeSnippet !== undefined && this._codeSnippet !== "") {
            //div code-snippet class
            const codeSnippetElement: HTMLElement = document.createElement("div");
            codeSnippetElement.className = "code-snippet";

            //h3 (example code)
            const codeTitleElement: HTMLElement = document.createElement("h3");
            codeTitleElement.innerHTML = "Code: ";
            codeSnippetElement.appendChild(codeTitleElement);

            //code language-javascript class
            const preElement: HTMLElement = document.createElement("pre");
            preElement.id = "answerCodeBlock" + this._id;
            const codeContentElement: HTMLElement = document.createElement("code");
            codeContentElement.className = "language-javascript";
            codeContentElement.innerHTML = this._codeSnippet;
            preElement.appendChild(codeContentElement);
            codeSnippetElement.appendChild(preElement);

            mainContainer.appendChild(codeSnippetElement);
        }

        //div information class
        const informationElement: HTMLElement = document.createElement("div");

        //div question-author class, questionDetailAuthor id
        const questionAuthorElement: HTMLElement = document.createElement("div");
        questionAuthorElement.className = "answer-author";

        //span (author)
        const usernameElement: HTMLElement = document.createElement("span");
        usernameElement.innerHTML = "Author: " + this._username;
        questionAuthorElement.appendChild(usernameElement);

        //span (expertise)
        const expertiseElement: HTMLElement = document.createElement("span");
        expertiseElement.innerHTML = "Expertise: " + this._expertise;
        questionAuthorElement.appendChild(expertiseElement);

        informationElement.appendChild(questionAuthorElement);

        //div question-date class, questionDetailDate
        const questionDateElement: HTMLElement = document.createElement("div");
        questionDateElement.className = "question-date";

        //span (date)
        const creationDateElement: HTMLElement = document.createElement("span");
        creationDateElement.innerHTML = "Posted date: " + this._creationDate;
        questionDateElement.appendChild(creationDateElement);

        if (this._isModified) {
            //span (edited)
            const modifiedElement: HTMLElement = document.createElement("span");
            modifiedElement.innerHTML = " editied: ";
            questionDateElement.appendChild(modifiedElement);

            //span (date)
            const modifiedDateElement: HTMLElement = document.createElement("span");
            modifiedDateElement.innerHTML = this._dateModified;
            questionDateElement.appendChild(modifiedDateElement);
        }

        informationElement.appendChild(questionDateElement);
        mainContainer.appendChild(informationElement);

        containerElement.appendChild(votingContainer);

        containerElement.appendChild(mainContainer);
        parent.appendChild(containerElement);
    }
}
