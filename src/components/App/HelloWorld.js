import React, { useEffect, useState } from 'react';
import electron, { ipcRenderer } from 'electron';
import './task.css'

export default function HelloWorld() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addItem, setAddItem] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // const handleClick = () => {
  //   console.log('handle click');
  //   ipcRenderer.send('get-json-item', 'ping');
  // };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: addItem,
      description: addDescription,
    };
    console.log('added task!!!');
    ipcRenderer.send('add-task', newTask);
    setTasks([...tasks, newTask]);
    setAddItem('');
    setAddDescription('');
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdateTask = () => {
    ipcRenderer.send('update-task', { id: editTaskId, title: editTitle, description: editDescription });
    setTasks(tasks.map(task => {
      if (task.id === editTaskId) {
        return Object.assign({}, task, {
          title: editTitle,
          description: editDescription,
        });
      }
      return task;
    }));
    setEditTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDeleteTask = (taskId) => {
    ipcRenderer.send('delete-task', taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  useEffect(() => {
    ipcRenderer.on('json-item', (event, data) => {
      console.log('Listening');
      console.log(data);
      setTasks(data);
    });

    ipcRenderer.send('get-json-item', 'ping');
  }, []);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <h1>Posts</h1>

      {/* <button onClick={handleClick}>Send!</button> */}

      <div className="">
        <div className="search">
          <input
            type="text"
            placeholder="Search posts"
            value={searchTerm}
            onChange={handleInputChange} />
        </div>
      </div>

      <div className="aditm">
        <h2>Add a post</h2>
        <div>
          <input
            type="text"
            placeholder="Enter title"
            value={addItem}
            onChange={(event) => { setAddItem(event.target.value); }}
          />
          <input
            type="text"
            placeholder="Enter description"
            value={addDescription}
            onChange={(e) => { setAddDescription(e.target.value); }}
          />
          <button onClick={handleAddTask}>Add Post</button>
        </div>
      </div>

      {editTaskId && (
        <div className="aditm">
          <h2>Edit post</h2>
          <div>
            <input
              type="text"
              placeholder="Enter title"
              value={editTitle}
              onChange={(event) => { setEditTitle(event.target.value); }}
            />
            <input
              type="text"
              placeholder="Enter description"
              value={editDescription}
              onChange={(e) => { setEditDescription(e.target.value); }}
            />
            <button onClick={handleUpdateTask}>Update Post</button>
          </div>
        </div>
      )}
      <div className="box">
        {filteredTasks.map(task => (
          <main key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <div>
              <button onClick={() => handleEditTask(task)} className='edit'>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)} className='delete'>Delete</button>
            </div>
          </main>
        ))}
      </div>
    </section>
  );
}