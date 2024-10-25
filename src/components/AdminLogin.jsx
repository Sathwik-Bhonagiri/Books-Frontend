import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import getBaseURL from '../utils/baseURL';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [message, setMessage] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log('Form Data:', data);  // Debugging form data
        try {
            const response = await axios.post(`${getBaseURL()}/api/auth/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Response:', response);  // Debugging response
            const auth = response.data;
            if (auth.token) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                    localStorage.removeItem('token');
                    alert("Token has expired, please login again.");
                    navigate("/admin");
                }, 3600 * 1000);  // Token expires after 1 hour
            }

            alert("Admin login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.log('Login Error:', error.response);  // Debugging error response
            if (error.response && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Please provide a valid username and password");
            }
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Admin Dashboard Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                        <input
                            {...register("username", { required: true })}
                            type="text"
                            id='username'
                            placeholder='Username'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                        {errors.username && <span className='text-red-500 text-xs italic'>Username is required</span>}
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                        <input
                            {...register("password", { required: true })}
                            type="password"
                            id='password'
                            placeholder='Password'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                        {errors.password && <span className='text-red-500 text-xs italic'>Password is required</span>}
                    </div>
                    {
                        message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
                    }
                    <div className='w-full'>
                        <button type="submit" className='bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none'>
                            Login
                        </button>
                    </div>
                </form>
                <p className='mt-5 text-center text-gray-500 text-xs'>@2025 Book Store. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AdminLogin;
