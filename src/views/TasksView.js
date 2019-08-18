import EventEmitter from '../assets/EventEmitter';
import { findElementParent } from '../assets/helpers';

export default class TasksView extends EventEmitter {
  constructor() {
    super();

    this.render();
    this.setEventListeners();
  }

  setEventListeners() {
    this.form.addEventListener('click', event => {
      event.preventDefault();

      if (event.target.name === 'taskAdd') return onAddTask();
    });

    this.list.addEventListener('click', event => {
      if (event.target.name === 'taskEdit') return onEditTask(event.target);
      if (event.target.name === 'taskSave') return onSaveTask(event.target);
      if (event.target.name === 'taskDelete') return onDeleteTask(event.target);
      if (event.target.name === 'taskCheck') return onCheckTask(event.target);
    });

    const onAddTask = () => {
      const { taskName } = this.form;

      if (!validate(taskName)) return;

      const task = { name: taskName.value.trim() };

      taskName.value = '';

      this.emit('add', task);
    };

    const onEditTask = button => {
      const task = findElementParent(button, '[data-id]');
      const taskName = task.querySelector('.title');

      button.name = 'taskSave';
      button.textContent = 'Save';

      const input = `<input 
        name='taskNameNew'
        placeholder='Edit task name'
        value='${taskName.textContent}'>
      `;

      taskName.insertAdjacentHTML('afterend', input);
    };

    const onSaveTask = button => {
      const task = findElementParent(button, '[data-id]');
      const id = +task.dataset.id;
      const taskNameNew = task.querySelector('[name="taskNameNew"');

      if (!validate(taskNameNew)) return;

      taskNameNew.remove();

      button.name = 'taskEdit';
      button.textContent = 'Edit';

      const data = { id, name: taskNameNew.value.trim() };

      this.emit('edit', data);
    };

    const onDeleteTask = button => {
      const task = findElementParent(button, '[data-id]');
      const id = +task.dataset.id;

      this.emit('delete', id);
    };

    const onCheckTask = checkbox => {
      const task = findElementParent(checkbox, '[data-id]');

      const data = {
        id: +task.dataset.id,
        isChecked: checkbox.checked
      };

      this.emit('edit', data);
    };

    const validate = field => {
      return field.value.length > 3 ? true : false;
    };
  }

  addTask(task) {
    this.renderTask(task);
  }

  editTask(data) {
    const task = this.getTask(data.id);
    const taskName = task.querySelector('.title');

    taskName.textContent = data.name;
  }

  deleteTask(id) {
    const task = this.getTask(id);
    task.parentElement.remove();
  }

  getTask(id) {
    const task = this.list.querySelector(`[data-id='${id}']`);

    return task;
  }

  displayTasks(tasks) {
    tasks.forEach(task => this.renderTask(task));
  }

  renderTask(task) {
    const isChecked = task.isChecked ? ' checked' : '';

    const markup = `
      <li class='list-item'>
        <div class='task${isChecked}' data-id='${task.id}'>

          <div class='task-check'>
            <input type='checkbox' name='taskCheck'${isChecked}>
          </div>  
        
          <div class='task-name'>
            <h4 class='title'>${task.name}</h4>
          </div>

          <div class='task-actions'>
            <button name='taskEdit'>Edit</button>
            <button name='taskDelete'>Delete</button>
          </div>

        </div>
      </li>
    `;

    this.list.insertAdjacentHTML('afterbegin', markup);
  }

  renderForm() {
    const markup = `
      <div class='tasks-form'>
        <form id='form-add-task' class='form'>
          <input name='taskName' placeholder='Enter task'>      
          <button name='taskAdd'>Add Task</button>
        </form>
      </div>
    `;

    return markup;
  }

  renderList() {
    const markup = `
      <div class='tasks-list'>
        <ul class='list'></ul>
       </div>
    `;

    return markup;
  }

  render() {
    const markup = `
      <section class='tasks'>
        ${this.renderForm()}
        ${this.renderList()}
      </section>
    `;

    const root = document.querySelector('#root');
    root.insertAdjacentHTML('beforeend', markup);

    this.form = root.querySelector('.tasks-form .form');
    this.list = root.querySelector('.tasks-list .list');
  }
}
