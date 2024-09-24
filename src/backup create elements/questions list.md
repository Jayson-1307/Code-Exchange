# Question list with indents

function listItem(questionID: number, title: string, content: string, tags: string, creationDate: Date, username: string, answers= "", score = "", totalVotes= ""): void {
    const htmlId: HTMLElement = (<HTMLInputElement>document.getElementById("question-list"));
    const scoreInString: string = String(score); 
    const totalVotesInString: string = String(totalVotes);
    const creationDateInString: string = String(creationDate);

    //-----
    // const wrapper: HTMLDivElement = document.createElement("div");
    // wrapper.className = "wrapper question-overview";


        // const questions: HTMLElement = document.createElement("section");
        // questions.className = "questions";

            //question class article element
            const question: HTMLElement = document.createElement("article");
            question.className = "question";

                //votes class div element
                const votes: HTMLElement = document.createElement("votes");
                votes.className = "votes";

                    //votesScore class span element
                    // const votesScore: HTMLElement = document.createElement("span");
                    // votesScore.innerHTML = scoreInString + totalVotesInString;
                    // votes.appendChild(votesScore);

                    //votesName class span element
                    // const votesName: HTMLElement = document.createElement("span");
                    // votesName.innerHTML = "Votes";
                    // votes.appendChild(votesName);

                    //answerCount class 
                    const answerString: HTMLElement = document.createElement("span");
                    answerString.className = "answerCount";
                    answerString.innerHTML = "Answers: ";
                    votes.appendChild(answerString);

                    //answerCount class 
                    const answersCount: HTMLElement = document.createElement("span");
                    answersCount.className = "answerCount";
                    answersCount.innerHTML = String(answers);
                    votes.appendChild(answersCount);
            
                question.appendChild(votes);

                //question summary class div element
                const questionSummary: HTMLElement = document.createElement("div");
                questionSummary.className = "question-summary";

                    //questionTitle class H2 element, and event listener
                    const questionTitle: HTMLElement = document.createElement("H2");
                    questionTitle.className = "question-title";
                    questionTitle.innerHTML = title;
                    questionSummary.appendChild(questionTitle);
                    questionTitle.addEventListener("click", () => {
                        urlRedirect(questionID);
                    });

                    //questionConten class p element
                    const questionContent: HTMLElement = document.createElement("p");
                    questionContent.className = "question-content";
                    questionContent.innerHTML = content;
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
                                questionTagsContent.innerHTML = tags;
                                questionTags.appendChild(questionTagsContent);

                            sectionLeft.appendChild(questionTags);

                        questionDetails.appendChild(sectionLeft);

                        //sectionRight class div element
                        const sectionRight: HTMLElement = document.createElement("div");
                        sectionRight.className = "section-right";

                            //questionAuthor class span element
                            const questionAuthor: HTMLElement = document.createElement("span");
                            questionAuthor.className = "question-author";
                            questionAuthor.innerHTML = username;
                            sectionRight.appendChild(questionAuthor);

                            //questionDate class span element
                            const questionDate: HTMLElement = document.createElement("span");
                            questionDate.className = "question-date";
                            questionDate.innerHTML = creationDateInString;
                            sectionRight.appendChild(questionDate);

                        questionDetails.appendChild(sectionRight);

                    questionSummary.append(questionDetails);

                question.appendChild(questionSummary);
                
            // questions.appendChild(question);
        
        // wrapper.appendChild(questions);

//append all to unique id
htmlId.appendChild(question);
