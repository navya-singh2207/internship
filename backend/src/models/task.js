const prisma = require('../config/db');

const TaskModel = {
  create: (data) => prisma.task.create({ data }),
  findAll: () => prisma.task.findMany({ orderBy: { createdAt: 'desc' } }),
  findByUserId: (userId) => prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  findById: (id) => prisma.task.findUnique({ where: { id } }),
  updateById: (id, data) => prisma.task.update({ where: { id }, data }),
  deleteById: (id) => prisma.task.delete({ where: { id } }),
};

module.exports = TaskModel;
