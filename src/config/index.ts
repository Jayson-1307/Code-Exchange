import { api } from "@hboictcloud/api";

try {
    //TODO: Pas het bestand .env en .env.production aan met de gegevens van HBO-ICT.Cloud
    api.configure({
        url: "https://api.hbo-ict.cloud",
        apiKey: "pb2d2324_joovuuzeefee27.myqjGiykvrPGOB2m",
        database: "pb2d2324_joovuuzeefee27_live",
        environment: "live",
    });
    const consoleMessage: string = "databse successful connected";
    console.log(consoleMessage);
} catch (reason) {
    console.error(reason);
}
