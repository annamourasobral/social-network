export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  timeline: Post[];
  createdAt?: string;
  // followers: string[];
  // following: string[];
  // privateMessages: PrivateMessage[];
}

export interface Post {
  author: string;
  content: string;
  time: string;
}

export interface PrivateMessage {
  from: string;
  to: string;
  content: string;
  time: string;
}
