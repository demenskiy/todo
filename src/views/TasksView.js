import EventEmitter from '../lib/EventEmitter';
import { findElementParent } from '../lib/helpers';

export default class TasksView extends EventEmitter {
  constructor() {
    super();

    this.root = document.querySelector('#tasks');

    this.render();
    this.setEventListeners();
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

  renderForm() {
    const markup = `
      <div class='tasks-form'>
        <form id='form-add-task'>
          <input type='text' name='taskName' placeholder='Enter task'>      
          <button type='submit' name='taskAdd'>Add</button>
        </form>
      </div>
    `;

    this.root.insertAdjacentHTML('beforeend', markup);

    this.form = this.root.querySelector('#form-add-task');
    this.form.taskName.setAttribute('autocomplete', 'off');
  }

  renderList() {
    const markup = `
      <div class='tasks-lists'>

        <div class='tasks-current'>
          <div class='section-title'>
            <h3 class='title'>Current</h3>
          </div>
          <ul></ul>
        </div>

        <div class='tasks-completed'>
          <div class='section-title'>
            <h3 class='title'>Completed</h3>
          </div>
          <ul></ul>
        </div>
        
      </div>
    `;

    this.root.insertAdjacentHTML('beforeend', markup);

    this.list = this.root.querySelector('.tasks-lists');
    this.listCurrent = this.list.querySelector('.tasks-current ul');
    this.listCompleted = this.list.querySelector('.tasks-completed ul');
  }

  renderTask(task) {
    const className = task.isChecked ? ' checked' : '';

    const markup = `
      <li>
        <div class='task${className}' data-id='${task.id}'>

          <div class='task-check'>
            <label>
              <input type='checkbox' name='taskCheck'${className}>
              <span class='checkbox'></span>
            </label>
          </div>  
        
          <div class='task-name'>
            <h4 class='title'>${task.name}</h4>
          </div>

          <div class='task-actions'>
            <button type='button' class='btn-secondary' name='taskEdit'>
              <i class="far fa-edit"></i>
            </button>
            <button type='button' class='btn-secondary attention' name='taskDelete'>
              <i class="far fa-trash-alt"></i>
            </button>
          </div>

        </div>
      </li>
    `;

    const list = task.isChecked ? this.listCompleted : this.listCurrent;
    list.insertAdjacentHTML('afterbegin', markup);
  }

  render() {
    this.renderForm();
    this.renderList();
  }

  setEventListeners() {
    this.form.addEventListener('click', event => {
      event.preventDefault();
      const { target } = event;

      if (target.name === 'taskAdd') return onAddTask(target);
    });

    this.list.addEventListener('click', event => {
      const { target } = event;
      const { parentElement } = target;

      if (parentElement.name === 'taskEdit') return onEditTask(target);
      if (parentElement.name === 'taskSave') return onSaveTask(target);
      if (parentElement.name === 'taskDelete') return onDeleteTask(target);
      if (target.name === 'taskCheck') return onCheckTask(target);
    });

    const onAddTask = () => {
      const { taskName } = this.form;
      const name = taskName.value.trim();

      if (!validate(name)) return;

      taskName.value = '';

      const task = { name };

      this.emit('add', task);
    };

    const onEditTask = target => {
      const task = findElementParent(target, '[data-id]');
      const title = task.querySelector('.title');
      const button = target.parentElement;

      button.name = 'taskSave';
      button.removeChild(target);
      button.insertAdjacentHTML('beforeend', '<i class="far fa-save"></i>');

      const markup = `
        <div class='task-edit'>  
          <input 
            name='taskNameNew'
            placeholder='Edit task name'
            value='${title.textContent}'
          >
        </div>
      `;

      title.insertAdjacentHTML('afterend', markup);

      const taskNameNew = task.querySelector('[name="taskNameNew"');

      taskNameNew.select();
    };

    const onSaveTask = target => {
      const task = findElementParent(target, '[data-id]');
      const taskNameNew = task.querySelector('[name="taskNameNew"');
      const button = target.parentElement;

      const id = +task.dataset.id;
      const name = taskNameNew.value.trim();

      if (!validate(name)) return;

      taskNameNew.parentElement.remove();

      button.blur();
      button.name = 'taskEdit';
      button.removeChild(target);
      button.insertAdjacentHTML('beforeend', '<i class="far fa-edit"></i>');

      const data = { id, name };

      this.emit('edit', data);
    };

    const onDeleteTask = target => {
      const task = findElementParent(target, '[data-id]');
      const id = +task.dataset.id;

      this.emit('delete', id);
    };

    const onCheckTask = checkbox => {
      const task = findElementParent(checkbox, '[data-id]');

      task.classList.toggle('checked');

      const data = {
        id: +task.dataset.id,
        isChecked: checkbox.checked
      };

      this.emit('edit', data);
    };

    const validate = field => {
      return field.length > 3 ? true : false;
    };
  }
}
