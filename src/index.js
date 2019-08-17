import TasksController from './controllers/TasksController';
import TasksModel from './models/TasksModel';
import TasksView from './views/TasksView';

import './scss/style.scss';

const tasksModel = new TasksModel();
const tasksView = new TasksView();

const tasksController = new TasksController(tasksModel, tasksView);
