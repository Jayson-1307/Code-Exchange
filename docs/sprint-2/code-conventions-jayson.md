# Code conventions Jayson van Olffen

## Voorbeeld 1
```typescript
    public async fillProfileContent(): Promise<void> {
        // const userID : number = session.get("user");
        const query : string = `
        SELECT p.userID, p.birthdate, p.experience, p.expertise, p.title, p.about, p.gitlab, p.profilePicture, u.username
        FROM profile AS p
        INNER JOIN user AS u 
        ON p.userID = u.userID
        WHERE p.userID = "${this.userID}"`;
    
        const data : any = await api.queryDatabase(query);
        const birthdate:Date = data[0]["birthdate"];
        const experience:number = data[0]["experience"];
        const expertise:string = data[0]["expertise"];
        const title:string = data[0]["title"];
        const about:string = data[0]["about"];
        const gitlab:string = data[0]["gitlab"];
        const profilePicture:any = data[0]["profilePicture"];
        const username:string = data[0]["username"];
        
        const birthdateElement: HTMLElement | any = document.getElementById("birthdate");
    
        const experienceElement: HTMLElement | any = document.getElementById("experience");
    
        const expertiseElement: HTMLElement | any = document.getElementById("expertise");
    
        const titleElement: HTMLElement | any = document.getElementById("title");
    
        const aboutElement: HTMLElement | any = document.getElementById("about");

        const profilePictureElement: HTMLElement | any = document.getElementById("profilePicture");
    
        const usernameElement: HTMLElement | any = document.getElementById("display-name");
        usernameElement.innerHTML+= username;
    
        const usernameTopElement: HTMLElement | any = document.getElementById("usernameTop");
        usernameTopElement.innerHTML+= username;
    
        if (birthdate !== null && birthdate !== undefined) {
            birthdateElement.innerHTML += birthdate;
        } else {
            birthdateElement.innerHTML += "Not available";
        }
    
        if (experience !== null && experience !== undefined) {
            experienceElement.innerHTML += experience;
        } else {
            experienceElement.innerHTML += "Not available";
        }
    
        if (expertise !== null && expertise !== undefined) {
            expertiseElement.innerHTML += expertise;
        } else {
            expertiseElement.innerHTML += "Not available";
        }
    
        if (title !== null && title !== undefined) {
            titleElement.innerHTML += title;
        } else {
            titleElement.innerHTML += "Not available";
        }
    
        if (about !== null && about !== undefined) {
            aboutElement.innerHTML += about;
        } else {
            aboutElement.innerHTML += "Not available";
        }

        if (profilePicture !== null && profilePicture !== undefined ) {
            profilePictureElement.innerHTML += profilePicture; 
        } else {
            profilePictureElement.src = "./assets/img/pfp.png";
        }
    }
```   
### Welke conventies worden hierin getoond:
- Source File Structure (Section 3):
    - Imports (Section 3.3):

- Types (Section 4):
    - Use const and let (Section 4.1.1):      

- Asynchronous Programming (Section 5):
    - Async/Await Usage (Section 5.1):

- Functions (Section 8):
    - Function Structure (Section 8.2):

- Code Formatting and Readability:
    - Indentation:
    - Vertical Spacing:

<br>

## Voorbeeld 2
```typescript
    import "./config";
    import { api, url, session } from "@hboictcloud/api";
    import { UserManager } from "./models/userManager";
    import { PostManager } from "./models/postManager";
    import { User } from "./models/user";
    import { Profile } from "./models/profile";
    import { Question } from "./models/question";

    //create classes to use functions from classes
    const userManager: UserManager = new UserManager;
    const postManager: PostManager = new PostManager;
    const userID: number = session.get("user");
    const userIDForProfile: number = url.getFromQueryString("id");
    let profile: Profile = await userManager.createProfileObject(userIDForProfile); 

    userManager.loggedIn();

    function test():Promise<void> | any{
        profile.toString();

        profile.fillProfileContent();
    }
    test();
```

### Welke conventies worden hierin getoond:
- Source File Structure (Section 3):
    - Imports (Section 3.3):
    - Use Modules, Not Namespaces (Section 3.5.3):

- Coding Practices (Section 4):
    - Use const and let (Section 4.1.1):
    - One Variable per Declaration (Section 4.1.2):
    - Class Declarations (Section 4.4.1):

- Asynchronous Programming (Section 3.5):
    - Async/Await Usage (Section 3.5.1):

- Functions (Section 8):
    - Function Naming (Section 8.1):
    - Function Structure (Section 8.2):

- Class Members (Section 4.4.5):

- Code Formatting and Readability: 
    - Indentations
    - vertical spacing

<br>

## Voorbeeld 3
```typescript
    public async fetchProfileData(userID: number): Promise<Array<any>> {
        const consoleMessage: string = "fetchProfileData";
        console.log(consoleMessage);
        try {
            const query: string = `
            SELECT profileID, userID, birthdate, experience, expertise, title, about, gitlab, profilePicture
            FROM profile
            WHERE userID = ${userID};
            `;
            console.log(query);
            const data: any = await api.queryDatabase(query);
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
```

### welke conventies worden hierin getoond:
- Source File Structure (Section 3):
    - Imports (Section 3.3):

- Types (Section 4):
    - Use const and let (Section 4.1.1):

- Asynchronous Programming (Section 5):
    - Async/Await Usage (Section 5.1):

- Functions (Section 8):
    - Function Naming (Section 8.1):
    - Function Structure (Section 8.2):

- Error Handling (Section 6):
    - Handling Exceptions (Section 6.1):

- Code Formatting and Readability:
    - Indentation:
    - Comments:
    - vertical spacing