import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl: string = "http://localhost:3000/";

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "users");
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "categories");
  }

  getAllTasksForUser(userId: number, categoryId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "todos?userId=" + userId + "&categoryId=" + categoryId);
  }

  updatetask(task: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'todos/' + task.id, task)
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "todos/" + id)
  }

  getAllTasks(): Promise<any> {
    return firstValueFrom(this.http.get<any>(this.apiUrl + "todos"))
  }

  async createNewTask(task: any) {
    const tasks = await this.getAllTasks();
    task.id = (tasks.length === 0) ? "1" : (Math.max(...tasks.map((task: any) => task.id)) + 1).toString();

    return await firstValueFrom(this.http.post(this.apiUrl + "todos", task))
  }

  createNewUser(user: any, userId: string) {
    user.id = userId;

    return this.http.post<any>(this.apiUrl + "users", user);
  }

  createNewCategory(category: any, categoryId: string){
    category.id = categoryId;

    return this.http.post<any>(this.apiUrl + "categories", category);
  }
}
