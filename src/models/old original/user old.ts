import { api } from "@hboictcloud/api";

export class User {
    // private fields
    private _userID: number;
    private _username: string;
    private _email: string;
    private _firstname: string;
    private _preposition: string;
    private _lastname: string;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(userID: number, username: string, email: string, firstname: string, preposition: string, lastname: string) {
        this._userID = userID;
        this._username = username;
        this._email = email;
        this._firstname = firstname;
        this._preposition = preposition;
        this._lastname = lastname;
    }

    // Getters en setters
    public get userID(): number {
        return this._userID;
    }

    public get username(): string {
        return this._username;
    }

    public get email(): string {
        return this._email;
    }

    public get firstname(): string {
        return this._firstname;
    }

    public get preposition(): string {
        return this._preposition;
    }

    public get lastname(): string {
        return this._lastname;
    }

    public set username(value: string) {
        this._username = value;
    }

    public set email(value: string) {
        this._email = value;
    }

    public set firstname(value: string) {
        this._firstname = value;
    }

    public set preposition(value: string) {
        this._preposition = value;
    }

    public set lastname(value: string) {
        this._lastname = value;
    }

    public toString(): string {
        return `User: ${this._userID} ${this._username} ${this._email} ${this._firstname} ${this._preposition} ${this._lastname}`;
    }

    //database functions
    public async update(): Promise<void> {
        try {
            await api.queryDatabase(`
            UPDATE user
            SET username = ?, email = ?, firstname = ?, preposition = ?, lastname = ?
            WHERE userID = ?;
            `, this._username, this._email, this._firstname, this._preposition, this._lastname, this._userID);
        } catch (error) {
            console.error(error);
        }
    }

    public async delete(): Promise<void> {
        try {
            await api.queryDatabase(`
            DELETE FROM user
            WHERE userID = ?;
            `, this._userID);
        } catch (error) {
            console.log(error);
        }
    }






}
