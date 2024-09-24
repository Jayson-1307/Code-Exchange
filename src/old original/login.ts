import "./config";
import { api, session, url } from "@hboictcloud/api";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurt helemaal onderin!
 */
function setup(): void {
    // Maak een actie aan voor de login knop. Als je hier op drukt wordt de code tussen de { } aangeroepen
    document.querySelector(".login-btn")?.addEventListener("click", async () => {
        // Haal de waarden uit de inputvelden met het userID username en password
        const username: string = (<HTMLInputElement>document.getElementById("username")).value;
        const password: string = (<HTMLInputElement>document.getElementById("password")).value;

        // Roep de loginFromDatabase functie aan (op regel 50) en geef username en password mee
        try {
            const data: any = await loginFromDatabase(username, password);

            if (data.length > 0) {
                // Maak user object aan met de waarden uit de database
                // Sla de gebruikersgegevens op in een sessie
                session.set("user", data[0].userID);

                // Stuur de gebruiker door naar de homepagina
                url.redirect("/index.html");
            } else {
                // Als de gebruiker niet bestaat, geef melding aan gebruiker door in de css (bootstrap) de display op block te zetten
                document.getElementsByClassName("alert-danger")[0].setAttribute("style", "display: block");

                // Maak de inputvelden weer leeg
                (<HTMLInputElement>document.getElementById("username")).value = "";
                (<HTMLInputElement>document.getElementById("password")).value = "";
            }
        } catch (error) {
            // als het niet lukt de data op te halen, geef de gebruiker een foutmelding
            console.log("Fout bij inloggen");
        }
    });
}

/**
 * if password and username match,will return the fetched data from the database in an array, else return empty array
 * @param username entered username on login
 * @param password entered password on login
 * @returns Array with the user data
 */
async function loginFromDatabase(username: string, password: string): Promise<Array<any> | undefined> {
    try {
        const data: any = await api.queryDatabase(
            "SELECT userID FROM user WHERE username = ? AND password = ?",
            username,
            password
        );

        return data;
    } catch (error) {
        return [];
    }
}

// Roep de setup functie aan als de pagina is geladen
setup();
