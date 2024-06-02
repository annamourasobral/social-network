import { ExternalLink, Post } from "../types";
import { Time } from "./Time";
import { User } from "./User";
import { Users } from "./Users";

const mentionRegex = /(?<=@)([^ ,]+)/g;

export class SocialNetwork {
  users: Users;
  user?: User;
  time: Time;

  constructor(time: Time) {
    this.users = new Users();
    this.time = time ?? new Time();
  }

  signUp(name: string) {
    this.user = new User(name, this.time);
    this.users.addUser(this.user);
  }

  login(name: string) {
    this.user = this.users.findUser(name);
  }

  post(content: string, externalLink?: ExternalLink) {
    if (!this.user) {
      throw new Error("User must be logged in to post.");
    }
    this.user.post(content, externalLink);
    const mentions = content.match(mentionRegex);
    if (mentions) {
      mentions.map((mention: string) => {
        const otherUser = this.users.findUser(mention);
        if (!otherUser) {
          throw new Error("User not found.");
        }
        this.switchFollows(otherUser);
      });
    }
  }

  getOwnTimeline() {
    let usersPosts = [];
    if (!this.user) {
      throw new Error("User must be logged in to get their own timeline.");
    }
    usersPosts = this.user.getTimeline();

    this.user.following.map((follower) => {
      const otherUser = this.users.findUser(follower);
      if (!otherUser) {
        throw new Error("User not found.");
      }
      const timeline = otherUser.getTimeline();
      timeline.map((post) => {
        usersPosts.push(post);
      });
    });

    return usersPosts;
  }

  sendPrivateMessage(name: string, message: string) {
    if (!this.user) {
      throw new Error("User must be logged in to send private messages.");
    }
    const otherUser = this.users.findUser(name);
    if (!otherUser) {
      throw new Error("User not found.");
    }
    otherUser.sendMessage(this.user.name, message);
  }

  getPrivateMessages() {
    if (!this.user) {
      throw new Error("User must be logged in to receive private messages.");
    }
    return this.user.privateMessages;
  }

  seeTimeline(name: string) {
    const otherUser = this.users.findUser(name);
    if (!otherUser) {
      throw new Error("User not found.");
    }
    let usersPosts: Post[] = [];
    const userHasPosts = otherUser.timeline.length;
    let userTimeline = userHasPosts
      ? `${name} said:\n`
      : `${name} haven't posted yet\n`;

    otherUser.timeline.map((post) => {
      userTimeline += `${post.content} on ${post.time}\n`;

      usersPosts.push(post);
    });

    otherUser.following.map((follower) => {
      const otherUser = this.users.findUser(follower);
      if (!otherUser) {
        throw new Error("User not found.");
      }
      const timeline = otherUser.getTimeline();

      timeline.map((post) => {
        userTimeline += `${post.content} on ${post.time}\n`;
        usersPosts.push(post);
      });
    });

    return this.orderPostsByTime(usersPosts);
  }

  followUser(following: string) {
    const otherUser = this.users.findUser(following);
    if (!otherUser) {
      throw new Error("User not found.");
    }
    this.switchFollows(otherUser);
    return this.seeTimeline(following);
  }

  getFollowingList() {
    if (!this.user) {
      throw new Error("User must be logged in to see following list.");
    }
    return this.user.following;
  }

  private switchFollows(followed: User) {
    if (!this.user) {
      throw new Error("User must be logged in follow another user.");
    }
    this.user.follow(followed);
    followed.addFollower(this.user);
  }

  private orderPostsByTime(posts: Post[]): Post[] {
    const sortedPosts = [...posts];
    sortedPosts.sort((a, b) => {
      const dateA = new Date(a.time.split("/").reverse().join("-"));
      const dateB = new Date(b.time.split("/").reverse().join("-"));

      return dateA.getTime() - dateB.getTime();
    });
    return sortedPosts;
  }
}
