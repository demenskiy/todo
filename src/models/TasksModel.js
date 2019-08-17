import store from '../assets/Store';
import EventEmitter from '../assets/EventEmitter';

export default class TasksModel extends EventEmitter {
  constructor() {
    super();

    this.tasks = store.get('tasks') || [];

    this.on('update', this.onUpdate);
  }

  onUpdate = tasks => store.add('tasks', tasks);

  addTask(task) {
    const id = this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1;
    task.id = id;

    this.tasks.push(task);

    this.emit('update', this.tasks);

    return task;
  }

  updateTask(data) {
    this.tasks = this.tasks.map(task =>
      task.id === data.id ? { ...task, ...data } : task
    );

    this.emit('update', this.tasks);

    return this.getTask(data.id);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);

    this.emit('update', this.tasks);
  }

  getTask(value, key = 'id') {
    return this.tasks.filter(task => task[key] === value)[0];
  }
}
