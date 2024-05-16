import { Time } from "./Time";
import { ExternalLink, Post, User } from "./User";
import { Users } from "./Users";

const mentionRegex = /(?<=@)([^ ,]+)/g;

export class SocialNetwork {
  users: Users;
  user: User;
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
    this.user.post(content, externalLink);
    const mentions = content.match(mentionRegex);
    if (mentions) {
      mentions.map((mention: string) => {
        const followed = this.users.findUser(mention);
        this.switchFollows(followed);
      });
    }
  }

  getOwnTimeline() {
    let usersPosts = [];
    usersPosts = this.user.getTimeline();

    this.user.following.map((follower) => {
      const timeline = this.users.findUser(follower).getTimeline();
      timeline.map((post) => {
        usersPosts.push(post);
      });
    });

    return usersPosts;
  }

  sendPrivateMessage(name: string, message: string) {
    const otherUser = this.users.findUser(name);
    otherUser.sendMessage(this.user.name, message);
  }

  getPrivateMessages() {
    return this.user.privateMessages;
  }

  seeTimeline(name: string) {
    const otherUser = this.users.findUser(name);
    let usersPosts = [];
    const userHasPosts = otherUser.timeline.length;
    let userTimeline = userHasPosts
      ? `${name} said:\n`
      : `${name} haven't posted yet\n`;

    otherUser.timeline.map((post) => {
      userTimeline += `${post.content} on ${post.time}\n`;

      usersPosts.push(post);
    });

    otherUser.following.map((follower) => {
      const timeline = this.users.findUser(follower).getTimeline();
      timeline.map((post) => {
        userTimeline += `${post.content} on ${post.time}\n`;
        usersPosts.push(post);
      });
    });

    return this.orderPostsByTime(usersPosts);
  }

  followUser(following: string) {
    const otherUser = this.users.findUser(following);
    this.switchFollows(otherUser);
    return this.seeTimeline(following);
  }

  getFollowingList() {
    return this.user.following;
  }

  private switchFollows(followed: User) {
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
