import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './profile-edit.scss';

function ProfileEdit() {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchData() {
        if (token) {
            const encodedEmail = encodeURIComponent(token).replace(/\./g, "%2E");
            const url = `http://localhost:8000/user/${encodedEmail}`;
            fetch(url, {
                headers: {
                'Content-Type': 'application/json'
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setEmail(data.email);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }
    
    fetchData();
  }, []);

  const handleDeleteClick = () => {
    const user = { email: token };
    if (token) {
      fetch("http://localhost:8000/user", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user })
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.removeItem('auth_token');
          navigate('/');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("auth_token");
    navigate('/exit');
  };

  const handleChangePasswordClick = () => {
    // Here you can add the code to handle changing the user's password
  };  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const user = { email: token, new_email: email }
    fetch('http://localhost:8000/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => {
        if (response.ok) {
          localStorage.setItem('auth_token', email)
        } else {
          throw new Error('Error saving changes')
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className='form-container'>
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="email">Email:</label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <button type="button" onClick={handleChangePasswordClick}>Change Password</button>
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleDeleteClick}>
            Delete User
        </button>
        <button type="button" onClick={handleLogoutClick}>
            Logout
        </button>
        </form>
    </div>
  );
}

export default ProfileEdit;