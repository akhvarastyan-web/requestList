export type RequestStatus = 'new' | 'in progress' | 'done';

export interface RequestItem {
  id: number;
  title: string;
  description: string;
  status: RequestStatus;
}
