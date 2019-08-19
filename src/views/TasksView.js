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
      <section class='tasks-form'>
        <form id='form-add-task'>
          <input type='text' name='taskName' placeholder='Enter task'>      
          <button type='submit' name='taskAdd'>Add</button>
        </form>
      </section>
    `;

    this.root.insertAdjacentHTML('beforeend', markup);

    this.form = this.root.querySelector('#form-add-task');
    this.form.taskName.setAttribute('autocomplete', 'off');
  }

  renderList() {
    const markup = `
      <div class='tasks-list'>
        <ul></ul>
       </div>
    `;

    this.root.insertAdjacentHTML('beforeend', markup);

    this.list = this.root.querySelector('.tasks-list ul');
  }

  renderTask(task) {
    const isChecked = task.isChecked ? ' checked' : '';

    const markup = `
      <li>
        <div class='task${isChecked}' data-id='${task.id}'>

          <div class='task-check'>
            <label>
              <input type='checkbox' name='taskCheck'${isChecked}>
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

    this.list.insertAdjacentHTML('afterbegin', markup);
  }

  render() {
    this.renderForm();
    this.renderList();
  }

  setEventListeners() {
    this.form.addEventListener('click', event => {
      event.preventDefault();

      if (event.target.name === 'taskAdd') return onAddTask(event.target);
    });

    this.list.addEventListener('click', event => {
      if (event.target.name === 'taskEdit') return onEditTask(event.target);
      if (event.target.name === 'taskSave') return onSaveTask(event.target);
      if (event.target.name === 'taskDelete') return onDeleteTask(event.target);
      if (event.target.name === 'taskCheck') return onCheckTask(event.target);
    });

    const onAddTask = button => {
      const { taskName } = this.form;

      button.blur();

      if (!validate(taskName)) return;

      const task = { name: taskName.value.trim() };

      taskName.value = '';

      this.emit('add', task);
    };

    const onEditTask = button => {
      const task = findElementParent(button, '[data-id]');
      const taskName = task.querySelector('.title');

      button.name = 'taskSave';
      // button.textContent = 'Save';

      const markup = `
        <div class='edit-task'>  
          <input 
            name='taskNameNew'
            placeholder='Edit task name'
            value='${taskName.textContent}'
          >
        </div>
      `;

      taskName.insertAdjacentHTML('afterend', markup);

      const taskNameNew = task.querySelector('[name="taskNameNew"');
      taskNameNew.select();
    };

    const onSaveTask = button => {
      const task = findElementParent(button, '[data-id]');
      const id = +task.dataset.id;
      const taskNameNew = task.querySelector('[name="taskNameNew"');

      if (!validate(taskNameNew)) return;

      taskNameNew.remove();

      button.name = 'taskEdit';
      // button.textContent = 'Edit';

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

      task.classList.toggle('checked');

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
}
