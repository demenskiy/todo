import EventEmitter from '../lib/EventEmitter';
import { findElementParent } from '../lib/helpers';

export default class TasksView extends EventEmitter {
  constructor() {
    super();

    this.state = {
      lists: {},
      tasksNumber: 0,
      hasCurrentTasks: false,
      hasCheckedTasks: false
    };

    this.root = document.querySelector('#tasks');
  }

  init() {
    this.render();
    this.setEventListeners();
  }

  setState(state) {
    this.state = { ...this.state, ...state };
    this.render();
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

  toggleTask(data) {
    const { current, completed } = this.state.lists;
    const task = this.getTask(data.id).parentElement;

    if (!data.isChecked) {
      return current.insertAdjacentElement('afterbegin', task);
    }

    return completed.insertAdjacentElement('afterbegin', task);
  }

  getTask(id) {
    const { all } = this.state.lists;
    const task = all.querySelector(`[data-id='${id}']`);

    return task;
  }

  displayTasks(tasks) {
    tasks.forEach(task => this.addTask(task));
  }

  displayList(listType, action) {
    const { lists } = this.state;
    const list = findElementParent(lists[listType], '.tasks-list');

    if (action === 'show') {
      return list.classList.remove('hidden');
    }

    return list.classList.add('hidden');
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

    this.state.form = this.root.querySelector('#form-add-task');
    this.state.form.taskName.setAttribute('autocomplete', 'off');
  }

  renderTask(task) {
    const { current, completed } = this.state.lists;

    const list = task.isChecked ? completed : current;
    const isChecked = task.isChecked ? ' checked' : '';

    const markup = `
      <li>
        <div class='task${isChecked}' data-id='${task.id}'>

          <div class='task-checkbox'>
            <label>
              <input type='checkbox' name='taskCheckbox'${isChecked}>
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

    list.insertAdjacentHTML('afterbegin', markup);
  }

  renderList(list) {
    const { lists } = this.state;

    if (lists[list]) return;

    const position = list === 'current' ? 'afterbegin' : 'beforeend';

    const markup = `
      <div class="tasks-list tasks-${list}">
        <div class="section-title">
          <h3 class="title">${list}</h3>
        </div>
        <ul></ul>
      </div>
    `;

    lists.all.insertAdjacentHTML(position, markup);
    lists[list] = lists.all.querySelector(`.tasks-${list} ul`);
  }

  renderLists() {
    const { lists, hasCurrentTasks, hasCheckedTasks } = this.state;

    if (!lists.all) {
      const markup = `<div class="tasks-lists"></div>`;

      this.root.insertAdjacentHTML('beforeend', markup);
      lists.all = this.root.querySelector('.tasks-lists');
    }

    const requiredLists = ['current', 'completed'];

    requiredLists.forEach(list => {
      !lists[list] && this.renderList(list);

      this.displayList(list, 'hide');

      const hasTasks = list === 'current' ? hasCurrentTasks : hasCheckedTasks;

      hasTasks && this.displayList(list, 'show');
    });
  }

  render() {
    !this.state.form && this.renderForm();
    this.renderLists();
  }

  setEventListeners() {
    const { form, lists } = this.state;

    form.addEventListener('click', event => {
      event.preventDefault();

      const { target } = event;

      if (target.name === 'taskAdd') return onAddTask();
    });

    lists.all.addEventListener('click', event => {
      let { target } = event;

      if (target.tagName === 'I') target = target.parentElement;

      if (target.name === 'taskEdit') return onEditTask(target);
      if (target.name === 'taskSave') return onSaveTask(target);
      if (target.name === 'taskDelete') return onDeleteTask(target);
      if (target.name === 'taskCheckbox') return onToggleTask(target);
    });

    const validate = name => {
      return name.length > 3 ? true : false;
    };

    const onAddTask = () => {
      const { taskName } = form;
      const name = taskName.value.trim();

      if (!validate(name)) return;

      taskName.value = '';

      const task = { name };

      this.emit('add', task);
    };

    const onEditTask = button => {
      const task = findElementParent(button, '[data-id]');
      const title = task.querySelector('.title');

      button.name = 'taskSave';
      button.removeChild(button.firstElementChild);
      button.insertAdjacentHTML('beforeend', '<i class="far fa-save"></i>');

      form.taskSave = button;

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

      form.taskNamaNew = task.querySelector('[name="taskNameNew"]');

      form.taskNamaNew.addEventListener('keypress', event => {
        event.key === 'Enter' && onSaveTask(event.target);
      });

      form.taskNamaNew.select();
    };

    const onSaveTask = target => {
      const task = findElementParent(target, '[data-id]');
      const button = form.taskSave;

      const name = form.taskNamaNew.value.trim();
      const id = +task.dataset.id;

      if (!validate(name)) return;

      form.taskNamaNew.parentElement.remove();

      button.blur();
      button.name = 'taskEdit';
      button.removeChild(button.firstElementChild);
      button.insertAdjacentHTML('beforeend', '<i class="far fa-edit"></i>');

      const data = { id, name };

      this.emit('edit', data);
    };

    const onDeleteTask = target => {
      const task = findElementParent(target, '[data-id]');
      const id = +task.dataset.id;

      this.emit('delete', id);
    };

    const onToggleTask = checkbox => {
      const task = findElementParent(checkbox, '[data-id]');

      task.classList.toggle('checked');

      const data = {
        id: +task.dataset.id,
        isChecked: checkbox.checked
      };

      this.emit('toggle', data);
    };
  }
}
