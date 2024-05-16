import { User } from "./User";

export class Users {
  users: User[] = [];

  addUser(user): void {
    this.users = [...this.users, user];
  }

  findUser(name: string): User {
    return this.users.find((user) => user.name === name);
  }
}
