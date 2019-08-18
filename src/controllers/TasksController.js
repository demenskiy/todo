export default class TasksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.on('add', this.onAddTask);
    this.view.on('edit', this.onEditTask);
    this.view.on('delete', this.onDeleteTask);

    this.view.displayTasks(this.model.tasks);
  }

  onAddTask = task => this.view.addTask(this.model.addTask(task));

  onEditTask = data => this.view.editTask(this.model.editTask(data));

  onDeleteTask = id => {
    this.view.deleteTask(id);
    this.model.deleteTask(id);
  };
}
