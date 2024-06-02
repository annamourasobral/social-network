import { ExternalLink, Post, PrivateMessage } from "../types";
import { Time } from "./Time";

export class User {
  name: string;
  timeline: Post[] = [];
  followers: string[] = [];
  following: string[] = [];
  privateMessages: PrivateMessage[] = [];

  constructor(name: string, private time: Time) {
    this.name = name;
    this.time = time;
  }

  post(content: string, externalLink?: ExternalLink) {
    const now = this.getNow();

    if (externalLink) {
      content = content.replace(
        externalLink.name,
        `[${externalLink.name}](${externalLink.link})`
      );
    }

    // console.log(`${this.name} says:\n "${content}" on ${now}`);
    this.timeline = [
      ...this.timeline,
      { author: this.name, content: content, time: now },
    ];
  }

  private getNow() {
    return this.time.getTime();
  }

  getTimeline() {
    return this.timeline;
  }

  sendMessage(sender: string, message: string) {
    // console.log(
    //   `${this.name} received a message from ${sender}:\n "${message}"`
    // );

    this.privateMessages = [
      ...this.privateMessages,
      { message: message, sender: sender, time: this.getNow() },
    ];
  }

  follow(user: User) {
    // console.log(`${this.name} is now following ${user.name}`);

    this.following.push(user.name);
  }

  addFollower(user: User) {
    // console.log(`${this.name} has a new follower: ${user.name}`);

    this.followers.push(user.name);
  }
}
