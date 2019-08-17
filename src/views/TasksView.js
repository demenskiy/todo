import EventEmitter from '../assets/EventEmitter';
import { findParent } from '../assets/helpers';

export default class TasksView extends EventEmitter {
  constructor() {
    super();

    this.render();
    this.setEventListeners();
  }

  setEventListeners() {
    let taskName = this.form.taskName;

    this.form.addEventListener('click', e => {
      e.preventDefault();

      e.target.name === 'taskAdd' && onAddTask();
    });

    this.list.addEventListener('click', e => {
      e.target.name === 'taskEdit' && onEditTask(e.target);
      e.target.name === 'taskDelete' && onDeleteTask(e.target);
      e.target.name === 'taskCheck' && onCheckTask(e.target);
    });

    const onAddTask = () => {
      if (!validate()) return;

      const task = { name: taskName.value };

      this.emit('add', task);

      taskName.value = '';
    };

    const onEditTask = target => {};

    const onDeleteTask = target => {
      const el = findParent(target, '[data-id]');
      const id = +el.dataset.id;

      this.emit('delete', id);
    };

    const onCheckTask = target => {
      const el = findParent(target, '[data-id]');

      const data = {
        id: +el.dataset.id,
        isCompleted: target.checked
      };

      this.emit('edit', data);
    };

    const validate = () => {
      const { value } = taskName;
      return value.length > 3 ? true : false;
    };
  }

  addTask(task) {
    this.renderTask(task);
  }

  editTask(data) {}

  deleteTask(id) {
    const task = this.getTask(id);
    task.parentElement.remove();
  }

  getTask(id) {
    return this.list.querySelector(`[data-id='${id}']`);
  }

  renderForm() {
    const markup = `
      <form id='form-add-task' class='form'>
        <input name='taskName' placeholder='Enter task'>      
        <button name='taskAdd'>Add Task</button>
      </form>
    `;

    return markup;
  }

  renderTask(task) {
    const markup = `
      <li class='list-item'>
        <div class='task' data-id='${task.id}'>

          <div class='task-check'>
            <input type='checkbox' name='taskCheck'>
          </div>  
        
          <div class='task-name'><h4>${task.name}</h4></div>

          <div class='action'>
            <button name='taskEdit'>Edit</button>
            <button name='taskDelete'>Delete</button>
          </div>

        </div>
      </li>
    `;

    this.list.insertAdjacentHTML('afterbegin', markup);
  }

  renderTasks(tasks) {
    tasks.forEach(task => this.renderTask(task));
  }

  render() {
    const markup = `
      <section id='tasks'>
        <div class='tasks-form'>${this.renderForm()}</div>
        <div class='tasks-list'>
          <ul class='list'></ul>
        </div>
      </section>
    `;

    const root = document.querySelector('#root');
    root.insertAdjacentHTML('beforeend', markup);

    this.form = root.querySelector('.tasks-form .form');
    this.list = root.querySelector('.tasks-list .list');
  }
}
