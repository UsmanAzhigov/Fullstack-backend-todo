import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import TodoModel from './model/todo.js';

mongoose
  .connect(
    'mongodb+srv://azigovali153:qwerty321@cluster0.ofl53rr.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB Ok'))
  .catch((err) => console.log('DB error', err));

const app = express(); // Создание веб-сервера
app.use(express.json()); // Чтобы можно было использовать JSON
app.use(cors()); // Чтобы перенаправлять свой порт localhost на другой порт

app.get('/tasks', async (req, res) => {
  const task = await TodoModel.find();
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const createTask = new TodoModel({ title: req.body.title, status: req.body.status });
  const task = await createTask.save();
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const changeStatus = await TodoModel.findById(taskId);
    changeStatus.status = 'deleted';
    await changeStatus.save();
    const deleteTask = await TodoModel.findByIdAndDelete(taskId);
    res.json(deleteTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/tasks', async (req, res) => {
  try {
    await TodoModel.deleteMany({});
    res.json({ message: 'All tasks removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tasks/:status', async (req, res) => {
  try {
    const filterTasks = await TodoModel.find({ status: req.params.status });
    res.json(filterTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const changeTask = await TodoModel.updateOne(
      { _id: taskId },
      {
        title: req.body.title,
      },
    );
    res.json(changeTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(1111, (error) => {
  if (error) {
    return console.error(error);
  }
  console.log('Сервер запущен');
});
// Запускает app.listen сервер
