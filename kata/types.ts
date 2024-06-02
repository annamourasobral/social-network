export interface ExternalLink {
  name: string;
  link: string;
}

export interface PrivateMessage {
  message: string;
  sender: string;
  time: string;
}

export interface Post {
  author: string;
  content: string;
  time: string;
}
