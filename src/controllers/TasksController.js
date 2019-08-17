export default class TasksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.on('add', onAddTask);
    this.view.on('edit', onEditTask);
    this.view.on('delete', onDeleteTask);

    this.view.renderTasks();
  }

  onAddTask = task => this.view.addTask(this.model.addTask(task));

  onEditTask = data => this.view.editTask(this.model.editTask(data));

  onDeleteTask = id => {
    this.view.deleteTask(id);
    this.model.deleteTask(id);
  };
}
