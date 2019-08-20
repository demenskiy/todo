export default class TasksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.on('update', this.onUpdate);

    this.view.on('add', this.onAddTask);
    this.view.on('edit', this.onEditTask);
    this.view.on('delete', this.onDeleteTask);
    this.view.on('toggle', this.onToggleTask);

    this.updateState();
    this.view.init();
    this.view.displayTasks(this.model.tasks);
  }

  onUpdate = () => this.updateState();

  onAddTask = task => this.view.addTask(this.model.addTask(task));

  onEditTask = data => this.view.editTask(this.model.editTask(data));

  onToggleTask = data => this.view.toggleTask(this.model.editTask(data));

  onDeleteTask = id => {
    this.view.deleteTask(id);
    this.model.deleteTask(id);
  };

  updateState() {
    const { tasks } = this.model;
    const state = {};

    state.tasksNumber = tasks.length;
    state.hasCurrentTasks = tasks.some(task => task.isChecked === false);
    state.hasCheckedTasks = tasks.some(task => task.isChecked);

    this.view.setState(state);
  }
}
