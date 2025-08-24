import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FaCalculator, FaReceipt, FaCamera, FaTrash } from 'react-icons/fa';
import './ExpenseSplitter.css';

const ExpenseSplitter = () => {
  // Convex queries and mutations
  const expenses = useQuery(api.expenses.getExpenses) || [];
  const addExpenseMutation = useMutation(api.expenses.addExpense);
  const deleteExpenseMutation = useMutation(api.expenses.deleteExpense);

  const [friends] = useState(["Vijay", "Arya", "Vedang", "Paranshu", "Eshanch", "Shahad", "Rithanya", "Athrav"]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    paidBy: "",
    splitBetween: [],
    category: "Food",
    description: ""
  });

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewExpense(prev => ({
          ...prev,
          billImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const addExpense = async () => {
    if (newExpense.title && newExpense.amount && newExpense.paidBy) {
      await addExpenseMutation({
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
        splitBetween: newExpense.splitBetween,
        category: newExpense.category,
        description: newExpense.description,
        billImage: newExpense.billImage,
        date: new Date().toISOString().split('T')[0]
      });
      
      setNewExpense({
        title: "",
        amount: "",
        paidBy: "",
        splitBetween: [],
        category: "Food",
        description: ""
      });
      setShowAddExpense(false);
    }
  };

  const deleteExpense = async (id) => {
    await deleteExpenseMutation({ id: id });
  };

  const toggleFriendInSplit = (friendName) => {
    setNewExpense(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(friendName)
        ? prev.splitBetween.filter(name => name !== friendName)
        : [...prev.splitBetween, friendName]
    }));
  };

  const calculateSplits = () => {
    const splits = {};
    friends.forEach(friend => {
      splits[friend] = 0;
    });

    expenses.forEach(expense => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      expense.splitBetween.forEach(friend => {
        splits[friend] += splitAmount;
      });
    });

    return splits;
  };

  const splits = calculateSplits();

  return (
    <div className="page-container">
      <div className="container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaCalculator /> Expense Splitter
        </motion.h1>

        <div className="expense-overview">
          <motion.div
            className="summary-cards"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="summary-card">
              <h3>Total Expenses</h3>
              <p className="amount">₹{expenses.reduce((sum, exp) => sum + exp.amount, 0)}</p>
            </div>
            <div className="summary-card">
              <h3>Per Person</h3>
              <p className="amount">₹{Math.max(...Object.values(splits)).toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Bills</h3>
              <p className="amount">{expenses.length}</p>
            </div>
          </motion.div>

          <motion.button
            className="btn add-expense-btn"
            onClick={() => setShowAddExpense(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaReceipt /> Add New Expense
          </motion.button>
        </div>

        {showAddExpense && (
          <motion.div
            className="add-expense-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <h2>Add New Expense</h2>
              
              <div className="form-group">
                <label>Expense Title</label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  placeholder="e.g., Lunch at Restaurant"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Activities">Activities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Paid By</label>
                <select
                  value={newExpense.paidBy}
                  onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
                >
                  <option value="">Select who paid</option>
                  {friends.map(friend => (
                    <option key={friend} value={friend}>{friend}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Split Between</label>
                <div className="friends-checkboxes">
                  {friends.map(friend => (
                    <label key={friend} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newExpense.splitBetween.includes(friend)}
                        onChange={() => toggleFriendInSplit(friend)}
                      />
                      {friend}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Optional description..."
                />
              </div>

              <div className="form-group">
                <label>Upload Bill (Optional)</label>
                <div {...getRootProps()} className={`upload-area ${isDragActive ? 'drag-active' : ''}`}>
                  <input {...getInputProps()} />
                  {newExpense.billImage ? (
                    <div className="uploaded-image">
                      <img src={newExpense.billImage} alt="Bill" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewExpense({...newExpense, billImage: null});
                        }}
                        className="remove-image"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <FaCamera />
                      <p>{isDragActive ? 'Drop the bill here' : 'Click or drag to upload bill'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn" onClick={addExpense}>Add Expense</button>
                <button className="btn btn-secondary" onClick={() => setShowAddExpense(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="expenses-list"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="section-title">📋 Expense History</h2>
          {expenses.map((expense) => (
            <motion.div
              key={expense.id}
              className="expense-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="expense-header">
                <div className="expense-info">
                  <h3>{expense.title}</h3>
                  <p className="expense-category">{expense.category}</p>
                  <p className="expense-date">{expense.date}</p>
                </div>
                <div className="expense-amount">
                  <span className="amount">₹{expense.amount}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteExpense(expense._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="expense-details">
                <p><strong>Paid by:</strong> {expense.paidBy}</p>
                <p><strong>Split between:</strong> {expense.splitBetween.join(', ')}</p>
                <p><strong>Per person:</strong> ₹{(expense.amount / expense.splitBetween.length).toFixed(2)}</p>
                {expense.description && <p><strong>Description:</strong> {expense.description}</p>}
              </div>

              {expense.billImage && (
                <div className="bill-image">
                  <img src={expense.billImage} alt="Bill" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="split-summary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="section-title">💰 Split Summary</h2>
          <div className="split-grid">
            {friends.map((friend) => (
              <div key={friend} className="split-card">
                <h3>{friend}</h3>
                <p className="split-amount">₹{splits[friend].toFixed(2)}</p>
                <div className="split-bar">
                  <div 
                    className="split-fill"
                    style={{ width: `${(splits[friend] / Math.max(...Object.values(splits))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpenseSplitter;
