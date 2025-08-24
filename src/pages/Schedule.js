import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FaCalendar, FaPlus, FaCheck, FaTrash, FaEdit, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import './Schedule.css';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time: '',
    location: '',
    priority: 'medium',
    assignedTo: [],
    completed: false
  });

  // Convex queries and mutations
  const tasks = useQuery(api.schedule.getTasks) || [];
  const addTask = useMutation(api.schedule.addTask);
  const updateTask = useMutation(api.schedule.updateTask);
  const deleteTask = useMutation(api.schedule.deleteTask);

  // Filter tasks by selected date
  const filteredTasks = tasks.filter(task => task.date === selectedDate);

  // Group tasks by time
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const time = task.time || 'No Time';
    if (!groups[time]) {
      groups[time] = [];
    }
    groups[time].push(task);
    return groups;
  }, {});

  // Sort time groups
  const sortedTimeGroups = Object.keys(groupedTasks).sort((a, b) => {
    if (a === 'No Time') return 1;
    if (b === 'No Time') return -1;
    return a.localeCompare(b);
  });

  const handleAddTask = async () => {
    if (newTask.title.trim()) {
      await addTask({
        ...newTask,
        date: selectedDate,
        createdAt: new Date().toISOString()
      });
      setNewTask({
        title: '',
        description: '',
        time: '',
        location: '',
        priority: 'medium',
        assignedTo: [],
        completed: false
      });
      setShowAddTask(false);
    }
  };

  const handleUpdateTask = async () => {
    if (editingTask && editingTask.title.trim()) {
      await updateTask({
        id: editingTask._id,
        ...editingTask
      });
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ id: taskId });
    }
  };

  const toggleTaskComplete = async (task) => {
    await updateTask({
      id: task._id,
      completed: !task.completed
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#ffa502';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  // Generate days until September 7th
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    const endDate = new Date('2024-09-07');
    
    let currentDate = new Date(today);
    while (currentDate <= endDate) {
      days.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const nextDays = getNextDays();

  return (
    <div className="page-container">
      <div className="container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaCalendar /> Trip Schedule
        </motion.h1>

        <div className="schedule-overview">
          <motion.div
            className="schedule-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p className="stat-number">{tasks.length}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-number">{tasks.filter(task => task.completed).length}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p className="stat-number">{tasks.filter(task => !task.completed).length}</p>
            </div>
          </motion.div>

          <motion.button
            className="btn add-task-btn"
            onClick={() => setShowAddTask(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Add Task
          </motion.button>
        </div>

        <motion.div
          className="date-selector"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {nextDays.map((date) => (
            <button
              key={date}
              className={`date-btn ${selectedDate === date ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="date-day">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="date-number">
                {new Date(date).getDate()}
              </div>
              <div className="date-month">
                {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </button>
          ))}
        </motion.div>

        <motion.div
          className="schedule-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="schedule-header">
            <h2>Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h2>
            <p>{filteredTasks.length} tasks scheduled</p>
          </div>

          {sortedTimeGroups.length === 0 ? (
            <div className="empty-schedule">
              <FaCalendar />
              <h3>No tasks scheduled for this day</h3>
              <p>Click "Add Task" to start planning your day</p>
            </div>
          ) : (
            <div className="time-groups">
              {sortedTimeGroups.map((time) => (
                <div key={time} className="time-group">
                  <div className="time-header">
                    <FaClock />
                    <h3>{time}</h3>
                    <span className="task-count">{groupedTasks[time].length} tasks</span>
                  </div>
                  <div className="tasks-list">
                    {groupedTasks[time].map((task) => (
                      <motion.div
                        key={task._id}
                        className={`task-card ${task.completed ? 'completed' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="task-checkbox">
                          <button
                            className={`checkbox ${task.completed ? 'checked' : ''}`}
                            onClick={() => toggleTaskComplete(task)}
                          >
                            {task.completed && <FaCheck />}
                          </button>
                        </div>
                        <div className="task-content">
                          <div className="task-header">
                            <h4 className={task.completed ? 'completed' : ''}>{task.title}</h4>
                            <span 
                              className="priority-badge"
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {getPriorityLabel(task.priority)}
                            </span>
                          </div>
                          {task.description && (
                            <p className="task-description">{task.description}</p>
                          )}
                          <div className="task-details">
                            {task.location && (
                              <div className="task-location">
                                <FaMapMarkerAlt />
                                <span>{task.location}</span>
                              </div>
                            )}
                            {task.assignedTo && task.assignedTo.length > 0 && (
                              <div className="task-assigned">
                                <FaUsers />
                                <span>{task.assignedTo.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="task-actions">
                          <button
                            className="action-btn edit"
                            onClick={() => setEditingTask(task)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add Task Modal */}
        {showAddTask && (
          <motion.div
            className="task-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2>Add New Task</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddTask(false)}
                >
                  ×
                </button>
              </div>
              <div className="task-form">
                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Enter task description"
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div className="form-group">
                  <label>Assigned To</label>
                  <input
                    type="text"
                    value={newTask.assignedTo.join(', ')}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                    placeholder="Enter names separated by commas"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAddTask(false)}>
                  Cancel
                </button>
                <button className="btn" onClick={handleAddTask}>
                  Add Task
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <motion.div
            className="task-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Task</h2>
                <button 
                  className="close-btn"
                  onClick={() => setEditingTask(null)}
                >
                  ×
                </button>
              </div>
              <div className="task-form">
                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    placeholder="Enter task description"
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={editingTask.time}
                      onChange={(e) => setEditingTask({...editingTask, time: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editingTask.location}
                    onChange={(e) => setEditingTask({...editingTask, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div className="form-group">
                  <label>Assigned To</label>
                  <input
                    type="text"
                    value={editingTask.assignedTo.join(', ')}
                    onChange={(e) => setEditingTask({...editingTask, assignedTo: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                    placeholder="Enter names separated by commas"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setEditingTask(null)}>
                  Cancel
                </button>
                <button className="btn" onClick={handleUpdateTask}>
                  Update Task
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
