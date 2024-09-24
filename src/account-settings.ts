import "./config";
import { api, url, session } from "@hboictcloud/api";
import { UserManager } from "./models/userManager";
import { PostManager } from "./models/postManager";
import { User } from "./models/user";
import { Question } from "./models/question";

//create classes to use functions from classes
const userManager: UserManager = new UserManager;
const postManager: PostManager = new PostManager;

userManager.loggedIn();
