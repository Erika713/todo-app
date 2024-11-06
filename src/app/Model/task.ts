export interface ITask {
  itemId: number;
  taskName: string;
  taskDescription: string;
  dueDate: Date;
  createdOn: Date;
  isCompleted: boolean;
  tags: string;
  completedOn: Date;
}

export interface ApiResponseModel {
  messasge: string;
  result: string;
  data: any;
}
