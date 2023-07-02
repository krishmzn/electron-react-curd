import React, { ChangeEvent, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './task.module.css';

import { useNavigate } from 'react-router-dom';

type Task = {
  id: number;
  title: string;
  description: string;
};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage: (
          channel:
            | 'ipc-example'
            | 'add-task'
            | 'update-task'
            | 'delete-task'
            | 'get-json-item',
          ...args: any[]
        ) => void;
        once: (
          channel: string,
          listener: (event: any, ...args: any[]) => void
        ) => void;
      };
    };
  }
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addItem, setAddItem] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // navigation
  const navigate = useNavigate();

  function handleBackClick() {
    navigate(-1);
  }
  // navigation

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // const handleClick = () => {
  //   console.log('handle click');
  //   window.electron.ipcRenderer.sendMessage('get-json-item', 'ping');
  // };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: addItem,
      description: addDescription,
    };
    console.log('added task!!!');
    window.electron.ipcRenderer.sendMessage('add-task', newTask);
    setTasks([...tasks, newTask]);
    setAddItem('');
    setAddDescription('');
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdateTask = () => {
    window.electron.ipcRenderer.sendMessage('update-task', {
      id: editTaskId,
      title: editTitle,
      description: editDescription,
    });
    setTasks(
      tasks.map((task) => {
        if (task.id === editTaskId) {
          return Object.assign({}, task, {
            title: editTitle,
            description: editDescription,
          });
        }
        return task;
      })
    );
    setEditTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDeleteTask = (taskId: number) => {
    console.log('delete clicked');
    window.electron.ipcRenderer.sendMessage('delete-task', taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  useEffect(() => {
    window.electron.ipcRenderer.once('json-item', async (arg: any) => {
      console.log('Listening');
      const data = await arg;
      console.log(data);
      setTasks(data);
    });

    window.electron.ipcRenderer.sendMessage('get-json-item', 'ping');
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <a onClick={handleBackClick} className="back">
        &larr;
      </a>

      {/* <button onClick={handleClick}>Send!</button> */}
      <div className={styles.sectionContainer}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search posts"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.aditm}>
          <h2>Add a post</h2>
          <div>
            <input
              type="text"
              placeholder="Enter title"
              value={addItem}
              onChange={(event) => {
                setAddItem(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Enter description"
              value={addDescription}
              onChange={(e) => {
                setAddDescription(e.target.value);
              }}
            />
            <button onClick={handleAddTask}>Add Post</button>
          </div>
        </div>

        {editTaskId && (
          <div className={styles.aditm}>
            <h2>Edit post</h2>
            <div>
              <input
                type="text"
                placeholder="Enter title"
                value={editTitle}
                onChange={(event) => {
                  setEditTitle(event.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Enter description"
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                }}
              />
              <button onClick={handleUpdateTask}>Update Post</button>
            </div>
          </div>
        )}
        <div className={styles.box}>
          {filteredTasks.map((task) => (
            <main className={styles.main} key={task.id}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <div>
                <button
                  onClick={() => handleEditTask(task)}
                  className={styles.edit}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className={styles.delete}
                >
                  Delete
                </button>
              </div>
            </main>
          ))}
        </div>
      </div>
    </section>
  );
}
