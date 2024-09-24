# Code conventions

## inhoudsopgaven

1. [Inleiding](#inleiding)
2. [Je code voldoet aan de Google code conventions](#je-code-voldoet-aan-de-google-code-conventions)
    1. [Gebruikte code conventions](#gebruikte-code-conventions)
    1. [Niet gebruikte code conventions](#niet-gebruikte-code-conventions)
    2. [Code conventions die verbeterd moeten worden](#code-conventions-die-verbeterd-moeten-worden)
3. [Bronnen](#bronnen)

## Inleiding
Via deze document wil ik op een overzichtelijke manier de Code Conventions aantonen.

## Je code voldoet aan de Google code conventions
Hieronder laten we code snippets zien en de code conventies waar ze aan voldoen volgens de [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html). De code snippets zijn aanzienlijke ingekort door *** neer te zetten waar regels code zijn weggelaten. Dit zorgt voor een beter overzicht.

#### Gebruikte code conventions
In de code block hieronder wordt voldaan aan de volgende code conventies:

* 2.1 File encoding: UTF-8  
![bewijs UTF-8](./images/Wesley%20google%20code%20conventions%20UTF-8.png)  
* 2.1.1 Whitespace characters
* 2.1.2 Special escape sequences
* 2.1.3 Non-ASCII characters
* 3 Source file structure
* 3.3 Imports
* 3.3.1 Import paths
* 3.3.2 NameSpace versus named imports
* 3.4 Exports
* 3.4.1 Export visibility
* 3.4.2 Mutable exports
* 3.5.1 Import type
* 3.5.3 Use modules not namespaces <!-- dont use namespace, and require for imports -->
* 4.1.1 Use const and let
* 4.1.2 One variable per declaration
* 4.2.1 Do not use the Array constructor
* 4.3.1 Do not use the Object constructor
* 4.3.2 Iterating objects
* 4.4.1 Class declarations
* 4.4.4 Constructor  <!-- check parameters naming with private and public -->
* 4.4.5 Class members <!-- check readonly modifier, if Getters and setters, only change the attribute directly without logic change attribute to public -->
* 4.4.6 Visibility
* 4.4.7 Disallowed class patterns
* 4.5.1 Terminology
* 4.5.2 Prefer function declarations for named functions
* 4.5.3 Nested functions
* 4.5.4 Do not use function expressions
* 4.5.5 Arrow function bodies
* 4.5.6 Rebinding this
* 4.5.12 Formatting functions
* 4.6 this
* 4.8.2 Number literals
* 4.8.3 Type coercion
* 4.9.1 Control flow statements and blocks
* 4.9.2 Grouping parentheses
* 4.9.5 Equality checks
* 4.9.6 Type and non-nullability assertions
* 4.9.7 Keep try blocks focused <!-- try blocks of database -->
* 4.11.1 Wrapper objects for primitive types
* 4.11.2 Automatic Semicolon Insertion
* 4.11.5 with
* 4.11.7 Non-standard features
* 4.11.8 Modifying builtin objects
* 5.1 Identifiers
* 5.1.1 Naming style
* 5.1.2 Descriptive names
* 5.1.3 Camel case
* 5.1.4 Dollar sign
* 5.2 Rules by identifier type
* 5.2.4 Imports
* 6.1 Type inference
* 6.1.1 Return types <!-- return class example -->
* 6.2 Undefined and null
* 6.8 any Type <!-- use unknown instead of any -->
* 6.8.2 Using unknown over any <!-- use unknow instead of any -->
* 6.11 Wrapper types
* 7.1 TypeScript compiler
* 7.1.1 @ts-ignore
* 7.2 Conformance
* 8.0.1 JSDoc versus comments <!-- always use /** ... */ for documentation use // for implementation commments -->
* 8.0.2 Multi-line comments <!-- dont use /** */ if its not documentation -->
* 8.1 JSDoc general form
* 8.3 JSDoc tags
* 8.4 Line wrapping <!-- between /** ... */ use 4 spaces to show text is wrapping -->
* 8.6 Class comments
* 8.7 Method and function comments
* 8.8 Parameter property comments
* 8.9 JSDoc type annotations
* 8.10 Make comments that actually add information
* 9.1 Consistency
* 9.1.1 Reformatting existing code
* 9.3.1 Style guide goals

```typescript
import { api, url } from "@hboictcloud/api";
import { Post } from "./post";

/**
 * this class extends the Post class, this is used to represent questions.
 * it can update, delete, using the APi, 
 * it can render the question on the page
 */
export class Question extends Post {

    //constructor
    public constructor(id: number, userID: number, content: string, codeSnippet: string, creationDate: string, dateModified: string, private _title: string, private _tags: string, username: string, expertise: string, private _answers: number, isModified: boolean) {
        super(id, userID, content, codeSnippet, username, expertise, creationDate, dateModified, isModified);
    }


    //getters and setters
    ***

    //this is used to return an string representation this instance, including the parent class
    public toString(): string {
        return `${super.toString()} Question: ${this.title} ${this.tags} ${this.answers}`;
    }

    //database functions
    /**
     * this is used to update the question in the database, by using the API
     */
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(`
            UPDATE question
            SET title = ?, content = ?, codeSnippet = ?, tags = ?)
            WHERE questionID = ?;
            `, this.title, this.content, this.codeSnippet, this.tags, this.id);
        } catch (error) {
            console.error(error);
        }
    }

    ***

    /**
     * this is used for rendering on the Questions, My Question, and Index pages
     */
    public printQuestionsList(): void {

        //beginner, Intermediate, advanced, expert, master or
        //Junior, Medior, Senior, Principal, Architect
        const htmlId: HTMLElement = (<HTMLInputElement>document.getElementById("question-list"));
        const creationDateInString: string = String(this.creationDate);
        ***

        questionTitle.addEventListener("click", () => {
            url.redirect("/question-detail.html", { id: this.id });
        });



    /**
     * this is used to render the question on the Question detail page
     * also checks if user is same as user who posted the question. if it is activate update and delete button. 
     * @param loggedinUserID current user
     */
    public printQuestionDetailPageQuestion(loggedinUserID: number): void {
        //change answer count in h2
        const answersCount: string = "answers-count";
        const count: HTMLElement = document.getElementById(answersCount)!;
        count.innerHTML += ": " + String(this.answers);
        ***

    }
    //#endregion Question-details
}
```

De code hieronder voldoet aan de volgende code conventies:
6.5 Array<T> Type <!-- short like string[] instead of Array<string> -->

```typescript
export class PostManager {
    public async fetchMyQuestionsPageQuestionList(userID: number): Promise<Question[] | undefined> {
        ***
            const questions: Question[] = this.createQuestionOrAnswerObject(data, true);
            return questions;
        } catch (error) {
            ***
        }
    }
```

#### Niet gebruikte code conventions
Deze onderdelen worden niet gebruikt in deze project, dus kan niet bewijzen dat op deze manier gewerkt wordt. Maar is tevens ook bewijs dat deze onderdelen tenminste niet op de verkeerde manier gebruikt worden.
* 3.1 Copyright information
* 3.2 @fileoverview JSDoc
* 3.3.3 Renaming imports
* 3.4.3 Container classes
* 3.5.2 Export type
* 4.2.3 Using spread syntax
* 4.2.4 Array destructuring
* 4.3.3 Using spread syntax
* 4.3.4 Computed property names
* 4.3.5 Object destructuring
* 4.4.3 Static methods
* 4.5.7 Prefer passing arrow functions as callbacks
* 4.5.8 Arrow functions as properties
* 4.5.9 Event handlers <!-- this is using arrow function for event handling, inside a class -->
* 4.5.10 Parameter initializers
* 4.5.11 Prefer rest and spread when appropriate
* 4.9.3 Exception handling
* 4.9.4 Switch statements
* 4.10 Decorators
* 4.11.3 Const enums
* 4.11.4 Debugger statements
* 4.11.6 Dynamic code evaluation
* 5.2.1 Type parameters
* 5.2.2 Test names
* 5.2.3 _ prefix/suffix
* 5.2.5 Constants
* 5.2.6 Aliases
* 6.2.1 Nullable/undefined type aliases
* 6.2.2 Prefer optional over |undefined
* 6.3 Use structural types <!-- user interfaces as types instead of classes -->
* 6.4 Prefer interfaces over type literal aliases
* 6.6 Indexable types / index signatures ({[key: string]: T})
* 6.7 Mapped and conditional types
* 6.8.1 Providing a more specific type
* 6.8.3 Suppressing any lint warnings
* 6.9 {} Type <!-- instead use unknown, Record<string, T>, object  -->
* 6.10 Tuple types
* 6.11 Return type only generics
* 8.2 Markdown <!-- between /** ... */ everithing is in markdown -->
* 8.5 Document all top-level exports of modules
* 8.10.1 Comments when calling a function
* 8.11 Place documentation prior to decorators
* 9.2 Deprecation
* 9.3 Generated code: mostly exempt


#### Code conventions die verbeterd moeten worden
Deze onderdelen konden niet vanwege de aangeraden plug-in van de HBO-ICT opleiding.
* 4.8.1 String literals
Door Eslint is het niet toegestaan om ' ' te gebruiken. Eslint verplicht bij strings " " te gebruiken. Dit kunnen we verhelpen door naar een andere code formatter over te stappen. Template literals door gebruik van \` \` worden wel gehanteerd.


## Bronnen
Externe bronnen
* [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
