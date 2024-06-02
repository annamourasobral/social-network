import { SocialNetwork } from "./socialNetwork";
import { Time } from "./Time";

describe("Social Network", () => {
  const time = new Time();
  const sn = new SocialNetwork(time);

  const day1 = "01/04/2024";
  const day4 = "04/04/2024";
  const day5 = "05/04/2024";
  const day6 = "06/04/2024";
  const day7 = "07/04/2024";

  it("Alice can publish messages to a personal timeline", () => {
    spyOn(time, "getTime").and.returnValues(day1, day4);
    sn.signUp("Alice");

    sn.post("Hello, World");
    sn.post("I'm new in here :)");

    expect(sn.getOwnTimeline()).toEqual([
      { author: "Alice", content: "Hello, World", time: day1 },
      { author: "Alice", content: "I'm new in here :)", time: day4 },
    ]);
  });

  it("Bob can view Alice's timeline", () => {
    spyOn(time, "getTime").and.returnValue(day5);
    sn.signUp("Bob");

    expect(sn.seeTimeline("Alice")).toEqual([
      {
        author: "Alice",
        content: "Hello, World",
        time: day1,
      },
      {
        author: "Alice",
        content: "I'm new in here :)",
        time: day4,
      },
    ]);
  });

  it("Charlie can subscribe to Alice’s and Bob’s timelines, and view an aggregated list of all subscriptions", () => {
    spyOn(time, "getTime").and.returnValue(day6);
    sn.signUp("Charlie");

    const subscribeToAlice = sn.followUser("Alice");
    const subscribeToBob = sn.followUser("Bob");

    const subscriptions = sn.getFollowingList();

    expect(subscribeToAlice).toEqual([
      {
        author: "Alice",
        content: "Hello, World",
        time: day1,
      },
      {
        author: "Alice",
        content: "I'm new in here :)",
        time: day4,
      },
    ]);
    expect(subscribeToBob).toEqual([]);
    expect(subscriptions).toEqual(["Alice", "Bob"]);
  });

  it("Bob can link to Charlie in a message using “@”", () => {
    spyOn(time, "getTime").and.returnValue(day7);

    sn.login("Bob");
    sn.post("Hi @Charlie, how are you?");

    expect(sn.seeTimeline("Charlie")).toEqual([
      {
        author: "Alice",
        content: "Hello, World",
        time: day1,
      },
      {
        author: "Alice",
        content: "I'm new in here :)",
        time: day4,
      },
      { author: "Bob", content: "Hi @Charlie, how are you?", time: day7 },
    ]);
  });

  it("Alice can link to a clickable web resource in a message", () => {
    spyOn(time, "getTime").and.returnValue(day7);

    sn.login("Alice");
    sn.post("Check out this song: Shape of You", {
      name: "Shape of You",
      link: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    });

    expect(sn.getOwnTimeline()).toEqual([
      {
        author: "Alice",
        content: "Hello, World",
        time: day1,
      },
      {
        author: "Alice",
        content: "I'm new in here :)",
        time: day4,
      },
      {
        author: "Alice",
        content:
          "Check out this song: [Shape of You](https://www.youtube.com/watch?v=JGwWNGJdvx8)",
        time: day7,
      },
    ]);
  });

  it("Mallory can send a private message to Alice", () => {
    spyOn(time, "getTime").and.returnValue(day7);

    sn.signUp("Mallory");
    sn.sendPrivateMessage("Alice", "Hello Alice, how are you?");

    sn.login("Alice");
    expect(sn.getPrivateMessages()).toEqual([
      {
        message: "Hello Alice, how are you?",
        sender: "Mallory",
        time: day7,
      },
    ]);
  });
});
