import { api, url } from "@hboictcloud/api";
import { Post } from "./post";

/**
 * this class extends the Post class, this is used to represent questions.
 * it can update, delete, using the APi,
 * it can render the question on the page
 */
export class Question extends Post {
    //attributes and constructor
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

    //getters and setters


    //this is used to return an string representation this instance, including the parent class
    public toString(): string {
        return `Post: ${super.toString()} 
        Question: title: ${this._title} 
        tags: ${this._tags} 
        answers: ${this._answers}`;
    }

    //database functions

    /**
     * this is used to update the question in the database, by using the API
     */
    public async update(): Promise<void> {
        //sending to server
        try {
            await api.queryDatabase(
                `
            UPDATE question
            SET content = ?, codeSnippet = ?
            WHERE questionID = ?;
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
     * this is used to delete the question from the database, by using the API
     */
    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(
                `
                DELETE FROM question
                WHERE questionID = ?
                `,
                this._id
            );
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
     * this is used for rendering on the Questions, My Question, and Index pages
     */
    public printQuestionsList(): void {
        //beginner, Intermediate, advanced, expert, master or
        //Junior, Medior, Senior, Principal, Architect
        const htmlId: HTMLElement = <HTMLInputElement>document.getElementById("question-list");
        const creationDateInString: string = String(this._creationDate);

        //question class article element
        const question: HTMLElement = document.createElement("article");
        question.className = "question";

        //votes class div element
        const votes: HTMLElement = document.createElement("div");
        votes.className = "votes";

        if (this._answers === 0) {
            //amountAnswers
            const answerElement: HTMLElement = document.createElement("div");
            answerElement.className = "noAnswers";

            //answerCount class
            const answerString: HTMLElement = document.createElement("span");
            answerString.className = "answerCount";
            answerString.innerHTML = "Answers: ";
            answerElement.appendChild(answerString);

            //answerCount class
            const answersCount: HTMLElement = document.createElement("span");
            answersCount.className = "answerCount";
            answersCount.innerHTML = String(this._answers);
            answerElement.appendChild(answersCount);

            votes.appendChild(answerElement);
        }
        if (this._answers > 0) {
            //amountAnswers
            const answerElement: HTMLElement = document.createElement("div");
            answerElement.className = "hasAnswers";

            //answerCount class
            const answerString: HTMLElement = document.createElement("span");
            answerString.className = "answerCount";
            answerString.innerHTML = "Answers: ";
            answerElement.appendChild(answerString);

            //answerCount class
            const answersCount: HTMLElement = document.createElement("span");
            answersCount.className = "answerCount";
            answersCount.innerHTML = String(this._answers);
            answerElement.appendChild(answersCount);

            votes.appendChild(answerElement);
        }

        question.appendChild(votes);

        //question summary class div element
        const questionSummary: HTMLElement = document.createElement("div");
        questionSummary.className = "question-summary";

        //questionTitle class H2 element, and event listener
        const questionTitle: HTMLElement = document.createElement("H2");
        questionTitle.className = "question-title";
        questionTitle.innerHTML = this._title;
        questionSummary.appendChild(questionTitle);
        questionTitle.addEventListener("click", () => {
            url.redirect("/question-detail.html", { id: this._id });
        });

        //questionConten class p element
        const questionContent: HTMLElement = document.createElement("p");
        questionContent.className = "question-content";
        questionContent.innerHTML = this._content;
        questionSummary.appendChild(questionContent);

        //questionDetails class div element
        const questionDetails: HTMLElement = document.createElement("div");
        questionDetails.className = "question-details";

        //sectionLeft class div element
        const sectionLeft: HTMLElement = document.createElement("div");
        sectionLeft.className = "section-left";

        //questionTags class div element
        const questionTags: HTMLElement = document.createElement("div");
        questionTags.className = "question-tags";

        //questionTagsContent class span element
        const questionTagsContent: HTMLElement = document.createElement("span");
        questionTagsContent.className = "tag";
        questionTagsContent.innerHTML = this._tags;
        questionTags.appendChild(questionTagsContent);

        sectionLeft.appendChild(questionTags);
        questionDetails.appendChild(sectionLeft);

        //sectionRight class div element
        const sectionRight: HTMLElement = document.createElement("div");
        sectionRight.className = "section-right";

        //questionAuthor class span element
        const questionAuthor: HTMLElement = document.createElement("span");
        questionAuthor.className = "question-author";
        questionAuthor.innerHTML = this._username;
        sectionRight.appendChild(questionAuthor);

        //questionExpertise class span element
        const questionExpertise: HTMLElement = document.createElement("span");
        questionExpertise.className = "question-expertise";
        questionExpertise.innerHTML = this._expertise;
        sectionRight.appendChild(questionExpertise);

        //questionDate class span element
        const questionDate: HTMLElement = document.createElement("span");
        questionDate.className = "question-date";
        questionDate.innerHTML = creationDateInString;
        sectionRight.appendChild(questionDate);

        questionDetails.appendChild(sectionRight);
        questionSummary.append(questionDetails);
        question.appendChild(questionSummary);

        //append all to unique id
        htmlId.appendChild(question);
    }

    /**
     * this is used to render the question on the Question detail page
     * also checks if user is same as user who posted the question. if it is activate update and delete button.
     * @param loggedinUserID current user
     */
    public printQuestionDetailPageQuestion(loggedinUserID: number): void {
        //change answer count in h2
        const answersCount: string = "answers-count";
        const count: HTMLElement = document.getElementById(answersCount)!;
        count.innerHTML += ": " + String(this._answers);

        //parent id
        const parentHtmlId: string = "question";
        const parent: HTMLElement = document.getElementById(parentHtmlId)!;

        //create question part on the page
        //h2 question-title class
        const titleElement: HTMLElement = document.createElement("h2");
        titleElement.className = "question-title";
        titleElement.innerHTML = this._title;
        parent.appendChild(titleElement);

        if (loggedinUserID === this._userID) {
            const buttonContainer: HTMLElement = document.createElement("div");
            buttonContainer.className = "buttonContainer";

            const editButton: HTMLElement = document.createElement("button");
            editButton.className = "edit-button btn button";
            editButton.innerHTML = "edit question";
            editButton.addEventListener("click", () => {
                const contentBlock: HTMLElement = document.getElementById("questionContentBlock" + this._id)!;
                const codeBlock: HTMLElement | null = document.getElementById("questionCodeBlock" + this._id);
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
                            editButton.innerHTML = "edit question";
                            alert("Your question is saved");
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
                    editButton.innerHTML = "save question";
                    alert("You can now edit your question");
                }
            });

            buttonContainer.appendChild(editButton);

            const deleteButton: HTMLElement = document.createElement("button");
            deleteButton.className = "delete-button btn button";
            deleteButton.innerHTML = "delete question";
            deleteButton.addEventListener("click", () => {
                if (confirm("Are you sure, you want to delete your question?") === true) {
                    this.delete();
                    alert("Your answer is deleted");
                    location.href= "./questions.html"
                }
            });
            buttonContainer.appendChild(deleteButton);
            parent.appendChild(buttonContainer);
        }

        //div question-body class
        const contentElement: HTMLElement = document.createElement("div");
        contentElement.className = "question-body";
        contentElement.id = "questionContentBlock" + this._id;
        contentElement.innerHTML = this._content;
        parent.appendChild(contentElement);

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
            // const preElement: HTMLElement = document.createElement("pre");
            const preElement: HTMLElement = document.createElement("pre");
            preElement.id = "questionCodeBlock" + this._id;
            const codeContentElement: HTMLElement = document.createElement("code");
            codeContentElement.className = "language-javascript";
            codeContentElement.innerHTML = this._codeSnippet;
            // codeContentElement.appendChild(preElement);
            preElement.appendChild(codeContentElement);

            codeSnippetElement.appendChild(preElement);
            parent.appendChild(codeSnippetElement);
        }
        //div information class
        const informationElement: HTMLElement = document.createElement("div");

        //div question-author class, questionDetailAuthor id
        const questionAuthorElement: HTMLElement = document.createElement("div");
        questionAuthorElement.className = "question-author";

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
        parent.appendChild(informationElement);
    }
    //#endregion Question-details
}
