// @ts-nocheck
"use client"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserController } from '../controllers/user.controller';

const User = () => {
    const navigate = useNavigate();
    const [route, setRoute] = useState('');
    const [id, setId] = useState('');
    const [existingUserData, setExistingUserData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await UserController.get_all()
          console.log('Fetched Accounts:', data);
          setExistingUserData(data || []); // Set the data in state
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };

      fetchData();
    }, []);

    const handleSubmit = (event: { preventDefault: () => void; target: any; }) => {
      event.preventDefault();

      const target = event.target;

      // Your form processing logic goes here
      const enteredUsername = target.elements.user_name.value;
      const enteredPassword = target.elements.password.value;
      const enteredEmail = target.elements.email.value;

      // Ignore the fact that this isnt really safe or secure i pinky promise to fix it later
      existingUserData.forEach((user: any)=>{
          if(user.username === enteredUsername){
            if(user.password == enteredPassword && user.email === enteredEmail){
              setId(user._id);
              navigate(`/profile?id=${user._id}`);
            } else {
              // Handle incorrect credentials (show an error message, for example)
              console.log('Incorrect username or password');
            }
          }
      })
    };

    function BackButton() {
      return (
        <>
          <button onClick={() => navigate('/')} className='bg-blue-100 text-blue-800 border-2 border-blue-800 w-1/3 mb-6'>Back</button>
        </>
      )
    }

    return (
      <main className='Create-Profile w-1/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800'>
        <BackButton></BackButton>
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Log in</h2>
          <label htmlFor='username' className="text-lg text-blue-800"> User Name</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            className='user_name'
            required
            onChange={(event) => {
              setRoute(event.target.value);
            }}
          />
          <label htmlFor='email' className="text-lg text-blue-800"> Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className='email'
            required
            onChange={(event) => {
              setRoute(event.target.value);
            }}
          />
          <label htmlFor='password' className="text-lg text-blue-800">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className='password'
            required
            onChange={(event) => {
              setRoute(event.target.value);
            }}
          />

          <div className="mt-8 text-blue-800">
            <input type="reset" value="Reset" className="mb-2 border-blue-800 h-10 hover:bg-blue-50"/>
            <input type="submit" value="Submit" className="border-blue-800 h-10 hover:bg-blue-50"/>
          </div>
        </form>
      </main>
    )
}

export default User