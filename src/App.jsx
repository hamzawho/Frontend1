import React, { useEffect, useState } from 'react';
import './App.css';


function App() {

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isSignupPage, setIsSignupPage] = useState(true);

  // Fetch users data
  const fetchData = () => {
    if (isLoggedIn) {
      fetch('http://api.thedemoapp.online/api/getusers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoggedIn, token]);

  // Sign Up form submission
  const handleSignup = () => {
    const signupData = { name: signupName, email: signupEmail, password: signupPassword };

    fetch('http://api.thedemoapp.online/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'User created successfully') {
          setIsSignedUp(true);
          setIsSignupPage(false);
        }
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
      })
      .catch((error) => {
        console.error('There was a problem with the signup operation:', error);
      });
  };

  // Login form submission
  const handleLogin = () => {
    const loginData = { email: loginEmail, password: loginPassword };

    fetch('http://api.thedemoapp.online/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          setIsLoggedIn(true);
          setLoginEmail('');
          setLoginPassword('');
          fetchData();
        } else {
          console.error('Login failed');
        }
      })
      .catch((error) => {
        console.error('There was a problem with the login operation:', error);
      });
  };

  const clearInputs = () => {
    setName('');
    setAge('');
    setDeathDate('');
  };
  const Header = ({ handleLogout }) => {
    return (
      <header className="header">
        <h1>Welcome to the Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
    );
  };
  
  // Update data
  const updateData = (id, updatedData) => {
    fetch(`http://api.thedemoapp.online/api/update?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchData();
      });
  };

  // Submit form
  const submitForm = () => {
    const userData = { name, age, Death: deathDate };

    fetch('http://api.thedemoapp.online/api/saveuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchData();
      });
  };

  // Handle edit
  const handleEdit = (id) => {
    const selectedRow = data.find((row) => row.id === id);
    if (selectedRow) {
      setSelectedRow(selectedRow);
      setName(selectedRow.name);
      setAge(selectedRow.age);
      setDeathDate(selectedRow.Death);
      setIsEditing(true);
    }
  };


  const handleUpdate = () => {
    const updatedData = { name, age, Death: deathDate };
    updateData(selectedRow.id, updatedData);
    setIsEditing(false);
    clearInputs();
  };

  const handleDelete = (id) => {
    fetch(`http://api.thedemoapp.online/api/delete?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchData();
      });
  };

  const sortTable = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortField === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortField === 'age') {
      return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
    }
    if (sortField === 'Death') {
      return sortOrder === 'asc' ? a.Death.localeCompare(b.Death) : b.Death.localeCompare(a.Death);
    }
    return 0;
  });

  const handleLogout = () => {
    setToken('');
    setIsLoggedIn(false);
    setIsSignupPage(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        isSignupPage ? (
          <div className="form-container">
            <h2>Sign Up</h2>
            <label htmlFor="signupName">Name:</label>
            <input
              type="text"
              id="signupName"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />
            <label htmlFor="signupEmail">Email:</label>
            <input
              type="email"
              id="signupEmail"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <label htmlFor="signupPassword">Password:</label>
            <input
              type="password"
              id="signupPassword"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
            <p>
              Already have an account?{' '}
              <a href="#!" onClick={() => setIsSignupPage(false)}>
                Sign In
              </a>
            </p>
          </div>
        ) : (
          <div className="form-container">
            <h2>Login</h2>
            <label htmlFor="loginEmail">Email:</label>
            <input
                          type="email"
                          id="loginEmail"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                        <label htmlFor="loginPassword">Password:</label>
                        <input
                          type="password"
                          id="loginPassword"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button onClick={handleLogin}>Login</button>
                        <p>
                          Don't have an account?{' '}
                          <a href="#!" onClick={() => setIsSignupPage(true)}>
                            Sign Up
                          </a>
                        </p>
                      </div>
                    )
                  ) : (
                    <>
                      <Header handleLogout={handleLogout} />
            
                      <div>
                        <label htmlFor="name">NAME:</label>{' '}
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />{' '}
                        <label htmlFor="age">AGE:</label>{' '}
                        <input
                          type="text"
                          id="age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />{' '}
                        <label htmlFor="deathDate">DEATH DATE:</label>{' '}
                        <input
                          type="text"
                          id="deathDate"
                          value={deathDate}
                          onChange={(e) => setDeathDate(e.target.value)}
                        />{' '}
                        {isEditing ? (
                          <button id="updateButton" onClick={handleUpdate}>
                            Update
                          </button>
                        ) : (
                          <>
                            <button onClick={clearInputs}>Clear</button>{' '}
                            <button type="submit" onClick={submitForm}>
                              Save
                            </button>
                          </>
                        )}
                      </div>
            
                      <br />
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th onClick={() => sortTable('name')}>
                              Name {sortField === 'name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th onClick={() => sortTable('age')}>
                              Age {sortField === 'age' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th onClick={() => sortTable('Death')}>
                              Death Date {sortField === 'Death' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedData.map((body) => (
                            <tr key={body.id}>
                              <td>{body.id}</td>
                              <td>{body.name}</td>
                              <td>{body.age}</td>
                              <td>{body.Death}</td>
                              <td>
                                <button onClick={() => handleEdit(body.id)}>Edit</button>
                                <button onClick={() => handleDelete(body.id)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              );
            }
            
            export default App;
            











