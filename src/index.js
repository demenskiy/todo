import TasksController from './controllers/TasksController';
import TasksModel from './models/TasksModel';
import TasksView from './views/TasksView';

import Layout from './Layout';

import './scss/style.scss';

const layout = new Layout();

const tasksModel = new TasksModel();
const tasksView = new TasksView();

const tasksController = new TasksController(tasksModel, tasksView);
