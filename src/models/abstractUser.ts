/**
 * this is used as an abstraction, which User and Profile classes can use.
 * it provides getters and setters. and the functions update and delete which contain error messages for verification of working of classes.
 */
export class AbstractUser {
    //attributes and constructor
    public constructor(
        public id: number, 
        public username: string, 
        protected _email: string
        ) {}

    //getters en setters

    //this is used to return a string representing this instance
    public toString(): string {
        return `AbstractUser: id: ${this.id} username: ${this.username} email: ${this._email}`;
    }

    //database functions
    
    /**
     * is used to check correct version is used
     */
    public update(): void {
        const error: string = "This message for update from AbstractUser should not show";
        console.log(error);
    }

    /**
     * is used to check correct version is used
     */
    public delete(): void {
        const error: string = "This message for delete from AbstractUser should not show";
        console.log(error);
    }
}
