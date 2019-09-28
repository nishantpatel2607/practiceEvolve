export interface Task {
  id: string;
  state: string;
  title: string;
  type: string;
  duration: Date;
  hourlyRate: number;
  total: number;
}
