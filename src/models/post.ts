/**
 * this is used as an abstraction, which Question and Answers classes can use.
 * it provides getters and setters. and the functions update and delete which contain error messages for verification of working of classes.
 */
export class Post {
    //attributes and constructor
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
    
    //getters and setters
    
    //this is used to return an string representation this instance
    public toString(): string {
        return `Post: id: ${this._id} userID: ${this._userID} content: ${this._content} codeSnippet: ${this._codeSnippet} username: ${this._username} expertise: ${this._expertise} creationDate: ${this._creationDate} dateModified: ${this._dateModified} isModified: ${this._isModified}`;
    }

    //database functions
    
    //placeholder function for updating the post in the database. prints an error message.
    public async update(): Promise<void> {
        const error: string = "This message for update from Post should not show";
        console.log(error);
    }

    //placeholder function for deleting the post in the database. prints an error message
    public async delete(): Promise<void> {
        const error: string = "This message for delete from Post should not show";
        console.log(error);
    }
}
