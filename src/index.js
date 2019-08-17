import TasksController from './controllers/TasksController';
import TasksModel from './models/TasksModel';
import TasksView from './views/TasksView';

const tasksModel = new TasksModel();
const tasksView = new TasksView();

const tasksController = new TasksController(tasksModel, tasksView);
