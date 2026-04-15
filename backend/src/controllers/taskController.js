const Task = require('../models/task');

const canAccessTask = (user, task) => user.role === 'ADMIN' || task.userId === user.id;

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = req.user.role === 'ADMIN' ? await Task.findAll() : await Task.findByUserId(req.user.id);
    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (!canAccessTask(req.user, task)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({
      title,
      description,
      status: status || 'TODO',
      userId: req.user.id,
    });
    res.status(201).json({
      success: true,
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (!canAccessTask(req.user, existingTask)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }

    const task = await Task.updateById(taskId, req.body);
    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    await Task.deleteById(taskId);
    res.status(200).json({
      success: true,
      data: { message: 'Task deleted successfully' },
    });
  } catch (err) {
    next(err);
  }
};
