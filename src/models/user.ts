import { api } from "@hboictcloud/api";
import { AbstractUser } from "./abstractUser";

/**
 * This class is used to represent the logged in user.
 * it can update, delete the user from the database using the API
 */
export class User extends AbstractUser {
    //attributes and constructor
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

    //getters en setters

    public get userNames (): string {
        let nameMessage: string; 
        if (this._preposition) {
            nameMessage = `${this._firstname} ${this._preposition} ${this._lastname}`;
        } else {
            nameMessage = `${this._firstname} ${this._lastname}`;
        }
        return nameMessage
    }

    //this is used to return a string representing this instance and parent class
    public toString(): string {
        return `${super.toString()} User: firstname: ${this._firstname} proposition: ${
            this._preposition
        } lastname: ${this._lastname}`;
    }

    //database functions

    /**
     * this is used to update the user in the database, using the API
     */
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(
            `
            UPDATE user
            SET username = ?, email = ?, firstname = ?, preposition = ?, lastname = ?
            WHERE userID = ?;
            `,
                this.username,
                this._email,
                this._firstname,
                this._preposition,
                this._lastname,
                this.id
            );
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * this is used to delete the user from the database, using the API
     */
    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(
                `
            DELETE FROM user
            WHERE userID = ?;
            `,
                this.id
            );
        } catch (error) {
            console.log(error);
        }
    }
}
