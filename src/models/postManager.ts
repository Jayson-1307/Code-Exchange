import { api, url } from "@hboictcloud/api";
import { Question } from "./question";
import { Answer } from "./answer";

/**
 * this is used for managing of post, these include questions and answers.
 * this uses the API to interact with the database.
 * with this it can add questions and answers, fetch lists of questions, and retrieving information for specific question for specific pages.
 */
export class PostManager {
    /**
     * this adds a question to the database.
     * it validates input, display error messages, and redirect the user if succesful.
     * @param userID the id of the logged in user
     * @returns questionID if succesful, else empty array
     */
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
            VALUES (?, ?, ?, ?, ?);
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query, userID, title, content, codeSnippet, tags);
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
     * this adds an anwer to the database.
     * it validates input, if succesful redirect to the question-detail page
     * @param userID the id of the user
     * @param questionID the id of the question this is an answer to
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
                VALUES (?, ?, ?, ?);
                `;
            console.log(query);
            const databaseCommand: any = await api.queryDatabase(
                query,
                questionID,
                userID,
                content,
                codeSnippet
            );
            const answerID: number = databaseCommand.insertId;
            //show data for debug
            console.log(answerID);
            //add answerID to session
            url.redirect("/question-detail.html", { id: questionID });
        } catch (error) {
            document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");
            console.error(error);
        }
    }

    /**
     * this converts fetched data from the database into Question and Answer classes depending on the boolean.
     * it also modifies the Date to a string, and checks if the question or answer was modified.
     * @param fetchedData an array of data fetched from the database
     * @param isQuestion a boolean to indicate if data is an question or answer
     * @returns an array of Answer or Question class
     */
    public createQuestionOrAnswerObject(fetchedData: Array<any>, isQuestion: boolean): Array<any> {
        const consoleMessage: string = "createQuestionObject";
        console.log(consoleMessage);

        const modifyDate: Array<any> = fetchedData.map((item: any) => {
            const isModified: boolean = item.creationDate !== item.dateModified;
            item.creationDate = new Intl.DateTimeFormat("nl-NL", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hourCycle: "h23",
                timeZone: "UTC",
            }).format(new Date(item.creationDate));
            item.dateModified = new Intl.DateTimeFormat("nl-NL", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hourCycle: "h23",
                timeZone: "UTC",
            }).format(new Date(item.dateModified));
            return {
                ...item,
                isModified,
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
                    item.answerID,
                    item.userID,
                    item.content,
                    item.codeSnippet,
                    item.creationDate,
                    item.dateModified,
                    item.questionID,
                    item.isAnswerAccepted,
                    item.username,
                    item.expertise,
                    item.isModified,
                    item.hasVoted,
                    item.userVoteScore,
                    item.averageVoteScore,
                    item.countVotes
                );
            });
            return answers;
        }
    }

    /**
     * fetches an list of questions for the questions page.
     * @returns an array of Question class
     * @param currentPage
     * @param offset
     */
    public async fetchQuestionsPageQuestionsList(currentPage:number, offset:number ): Promise<Question[] | undefined> {
        const consoleMessage: string = "fetchAllQuestionsWithLinkedUserData";
        console.log(consoleMessage);

        try {
            const sortSelect: HTMLSelectElement | null = document.getElementById(
                "sortSelect"
            ) as HTMLSelectElement;

            const selectedOption: string = sortSelect.value;

            let sortBy: string = "creationDate DESC";
            let answers: string = "";

            switch (selectedOption) {
                case "unanswered":
                    sortBy = "creationDate DESC";
                    answers = "HAVING answers = 0";
                    break;
                case "answered":
                    sortBy = "creationDate DESC";
                    answers = "HAVING answers > 0";
                    break;
                // Handle other cases if needed
                default:
                    sortBy = "creationDate";
                    answers = "";
                    break;
            }

            const selectExpertise: HTMLSelectElement | null = document.getElementById(
                "sortSelect-expertise"
            ) as HTMLSelectElement;

            const selectedExpertise: string = selectExpertise.value;

            let expertiseFilter: string = "";

            switch (selectedExpertise) {
                case "None":
                    expertiseFilter = "WHERE p.expertise = 'None'";
                    break;
                case "Junior":
                    expertiseFilter = "WHERE p.expertise = 'Junior'";
                    break;
                case "Medior":
                    expertiseFilter = "WHERE p.expertise = 'Medior'";
                    break;
                case "Senior":
                    expertiseFilter = "WHERE p.expertise = 'Senior'";
                    break;
                case "Principal":
                    expertiseFilter = "WHERE p.expertise = 'Principal'";
                    break;
                case "Architect":
                    expertiseFilter = "WHERE p.expertise = 'Architect'";
                    break;
                // Handle other cases if needed
                default:
                    expertiseFilter = "";
                    break;
            }

            const dateSelect: HTMLSelectElement | null = document.getElementById(
                "dateselect"
            ) as HTMLSelectElement;

            const dateSelectedOption: string = dateSelect.value;

            let selectedDate: string = "creationDate DESC";

            switch (dateSelectedOption) {
                case "descending":
                    selectedDate = "creationDate DESC";
                    break;
                case "ascending":
                    selectedDate = "creationDate";
                    break;
                // Handle other cases if needed
                default:
                    selectedDate = "creationDate DESC";
                    break;
            }

            const query: string = `
                SELECT q.questionID, q.userID, q.title, q.content, q.codeSnippet, q.tags, q.creationDate, q.dateModified, u.username, u.email, u.firstname, u.preposition, u.lastname, p.expertise, COUNT(a.answerID) AS answers
                FROM question AS q
                INNER JOIN user AS u
                ON q.userID = u.userID
                LEFT JOIN profile AS p
                on q.userID = p.userID
                LEFT JOIN answer AS a
                ON q.questionID = a.questionID
                ${expertiseFilter}
                GROUP BY q.questionID
                ${answers}
                ORDER BY ${selectedDate}
                LIMIT 10 OFFSET ${(currentPage - 1) * offset};
                
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

    /**
     * This deletes all question items off the page, so it can be rebuilt
     */
    public async rebuildQuestionOverview(): Promise<void> {
        const parent: any = document.getElementById("question-list");
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    /**
     * it fetches an list of questions for the my question page, using the userID to indentify the logged in user.
     * @param userID used to specify the content for this user
     * @returns an array of Question class
     */
    public async fetchMyQuestionsPageQuestionList(userID: number): Promise<Question[] | undefined> {
        const consoleMessage: string = "fetchMyQuestionsQuestionList";
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
            WHERE q.userID = ?
            GROUP BY q.questionID
            ORDER BY creationDate DESC;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query, userID);
            console.log(data);
            const questions: Question[] = this.createQuestionOrAnswerObject(data, true);
            return questions;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    /**
     * it fetches an list of 3 latest questions for the index page
     * @returns an array of Question class
     */
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

    /**
     * it fetches a specific question for the question detail page.
     * @param questionID specific id on the page
     * @returns an array of Question class
     */
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
        WHERE q.questionID = ?
        GROUP BY q.questionID
        ORDER BY creationDate DESC;
        `;
            console.log(query);
            const data: any = await api.queryDatabase(query, questionID);
            console.log(data);
            const questions: Question[] = this.createQuestionOrAnswerObject(data, true);
            return questions;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    /**
     * it fetches the answers for the specified question on the question detail page.
     * @param questionID specific id on the page
     * @returns an array of the Question class
     */
    public async fetchQuestionDetailPageAnswers(
        questionID: number,
        currentUserID: number
    ): Promise<Answer[] | undefined> {
        const consoleMessage: string = "fetchAnswerData";
        console.log(consoleMessage);

        try {
            const query: string = `
            SELECT 
                a.answerID, 
                a.questionID, 
                a.userID, 
                a.content, 
                a.codeSnippet, 
                a.creationDate, 
                a.dateModified, 
                u.username, 
                u.email, 
                u.firstname, 
                u.preposition, 
                u.lastname, 
                p.expertise,
                MAX(CASE WHEN v.userID = ? THEN true ELSE false END) AS hasVoted,
                MAX(CASE WHEN v.userID = ? THEN v.voteScore END) AS userVoteScore,
                ROUND(AVG(v.voteScore), 0) AS averageVoteScore,
                COUNT(v.voteScore) as countVotes  
            FROM 
                answer AS a 
            LEFT JOIN 
                user AS u ON a.userID = u.userID
            LEFT JOIN 
                profile AS p ON a.userID = p.userID
            LEFT JOIN
                vote AS v ON a.answerID = v.answerID
            WHERE 
                a.questionID = ?
            GROUP BY
                a.answerID
            ORDER BY 
                a.creationDate DESC;
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query, currentUserID, currentUserID, questionID);
            const answers: Answer[] = this.createQuestionOrAnswerObject(data, false);
            return answers;
        } catch (error) {
            console.error(error);
            return;
        }
    }
}
