export interface Story {
  id: string;
  name: string;
  role: string;
  location: string;
  title: string;
  content: string;
  category: string;
  date: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  task: string;
  icon: string;
  done: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  time: string;
}
