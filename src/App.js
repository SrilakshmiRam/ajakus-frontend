import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const jsonPlaceholderUrl = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    department: 'Engineering',
  });

  useEffect(() => {
    // Fetch data from API
    const fetchUsers = async () => {
      try {
        const response = await axios.get(jsonPlaceholderUrl);
        const usersData = response.data;

        // Map the data to match the desired structure
        const transformedUsers = usersData.map(user => {
          const [firstname, lastname] = user.name.split(' ');
          return {
            id: user.id, // Using the id from JSONPlaceholder for fetched users
            firstname,
            lastname,
            email: user.email,
            department: 'Engineering',
          };
        });
        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle input changes for new user and edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add a new user
  const handleAddUser = async () => {
    try {
      // Generate a new unique ID for the new user
      const newId = users.length ? users[users.length - 1].id + 1 : 1; // Increment the id based on the existing users
      
      const newUser = { ...formData, id: newId };
      setUsers([...users, newUser]);
      setFormData({ firstname: '', lastname: '', email: '', department: 'Engineering' });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Edit an existing user
  const handleEditUser = (user) => {
    setIsEdit(true);
    setEditUser(user);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      department: user.department,
    });
  };

  // Save edited user details
  const handleSaveEdit = () => {
    const updatedUsers = users.map(user =>
      user.id === editUser.id
        ? { ...user, ...formData }
        : user
    );
    setUsers(updatedUsers);
    setIsEdit(false);
    setFormData({ firstname: '', lastname: '', email: '', department: 'Engineering' });
  };

  // Delete a user
  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <div className="container">
      <h1>User Management</h1>

      {/* Display User List */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit User Form */}
      <div className="form-container">
        <h2>{isEdit ? 'Edit User' : 'Add New User'}</h2>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleInputChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleInputChange}
          placeholder="Last Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          placeholder="Department"
        />
        <button
          className="submit-btn"
          onClick={isEdit ? handleSaveEdit : handleAddUser}
        >
          {isEdit ? 'Save Changes' : 'Add User'}
        </button>
      </div>
    </div>
  );
};

export default App;


