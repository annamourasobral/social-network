import { User } from "./User";

export class Users {
  users: User[] = [];

  addUser(user: User): void {
    this.users = [...this.users, user];
  }

  findUser(name: string): User | undefined {
    return this.users.find((user) => user.name === name);
  }
}
