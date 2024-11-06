import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  taskService = inject(TaskService);
  users: any[] = [];
  categories: any[] = [];
  selectedUserId !: number;
  selectedCategoryId !: number;
  inprogressTasks: any[] = [];
  completedTasks: any[] = [];
  selectedTask: any;
  updateTaskForm: FormGroup;
  newTaskForm: FormGroup;
  newUserForm: FormGroup;
  newCategoryForm: FormGroup;

  constructor(private builder: FormBuilder) {
    this.updateTaskForm = builder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [''],
      dueDate: [''],
      userId: [''],
      categoryId: ['']
    });

    this.newTaskForm = builder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      dueDate: [''],
      userId: [''],
      categoryId: ['']
    });

    this.newUserForm = builder.group({
      id: [''],
      name: ['', Validators.required],
    });

    this.newCategoryForm = builder.group({
      id: [''],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllCategories();
  }

  getAllUsers() {
    this.taskService.getAllUsers().subscribe((res: any) => {
      this.users = res;
    })
  }

  getAllCategories() {
    this.taskService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
    })
  }

  getAllTasks() {
    if (this.selectedUserId !== undefined && this.selectedCategoryId !== undefined) {
      this.taskService.getAllTasksForUser(this.selectedUserId, this.selectedCategoryId).subscribe((res: any) => {

        this.filterResults(res);
      })
    } else {
      alert("Please select user and category!")
    }
  }

  filterResults(res: any) {
    this.inprogressTasks = [];
    this.completedTasks = [];

    res.forEach((task: any) => {
      if (task.completed) {
        this.completedTasks.push(task);
      } else {
        this.inprogressTasks.push(task);
      }
    });
  }

  selectTask(task: any) {
    this.selectedTask = task;
    this.updateTaskForm.setValue(this.selectedTask);
  }

  updateTask() {
    this.taskService.updatetask(this.updateTaskForm.value).subscribe((res: any) => {
      this.getAllTasks();
    })
  }

  deleteTask(task: any) {
    if (confirm("Are you sure you want to delete task: " + task.title)) {
      this.taskService.deleteTask(task.id).subscribe((res: any) => {
        this.getAllTasks();
      })
    }
  }

  addNewTask() {
    this.taskService.createNewTask(this.newTaskForm.value).then((data: any) => {
      this.selectedUserId = data.userId;
      this.selectedCategoryId = data.categoryId;
      this.getAllTasks();
    })
  }

  addNewUser() {
    if (this.users.some(user => user.name === this.newUserForm.value.name)) {
      alert('User with same name already exists');
      return;
    }

    const userId = (this.users.length === 0) ? "1" : (Math.max(...this.users.map((user: any) => user.id)) + 1).toString()

    this.taskService.createNewUser(this.newUserForm.value, userId).subscribe((res: any) => {
      this.ngOnInit();
    });
  }

  addNewCategory() {
    if (this.categories.some(categories => categories.name === this.newCategoryForm.value.name)) {
      alert('Category with same name already exists');
      return;
    }

    const categoryId = (this.categories.length === 0) ? "1" : (Math.max(...this.categories.map((category: any) => category.id)) + 1).toString()

    this.taskService.createNewCategory(this.newCategoryForm.value, categoryId).subscribe((res: any) => {
      this.ngOnInit();
    });
  }

  setStatus(task: any) {
    task.completed = !task.completed;

    this.taskService.updatetask(task).subscribe((res: any) => {
      this.getAllTasks();
    })
  }
}
