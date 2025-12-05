import React, { useState, useEffect } from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const Register = () => {

    const { auth, createUserWithEmailAndPassword, updateProfile, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/profile";

    const [registerError, setRegisterError] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Redirect if user is already logged in
    useEffect(() => {
        if (user?.email) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const onSubmit = data => {
        registerNewUser(data.name, data.email, data.password);
    }

    const registerNewUser = (name, email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const newUser = result.user;

                // Clear error
                setRegisterError('');

                // Update profile with display name
                updateProfile(newUser, {
                    displayName: name,
                    photoURL: ""
                }).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful',
                        text: `Welcome, ${name}!`,
                    });
                    reset(); // clear form
                }).catch(error => {
                    console.log("Profile update error:", error.message);
                });
            })
            .catch(error => {
                if (error.message.includes('email-already-in-use')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Email already in use',
                        text: 'You have already registered with this email address.',
                    });
                } else {
                    setRegisterError(error.message);
                }
                reset({ email: '', password: '' });
            });
    }

    return (
        <section className='bg-brand bg-brand-container'>
            <Navbar />
            <div className="container">
                <h1 className='fs-4 mt-5 text-center'>Sign Up</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-6 col-sm-8 mx-auto d-block">

                        <div className="form-group mt-2">
                            <label htmlFor='name' className='form-label p-1'>Name</label>
                            <input type='text' className="form-control p-2" {...register("name", { required: true })} />
                            {errors.name && <span className='text-danger'>This field is required</span>}
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor='email' className='p-1'>Email</label>
                            <input id='email' type='email' className="form-control p-2" {...register("email", { required: true })} />
                            {errors.email && <span className='text-danger'>This field is required</span>}
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor='password' className='p-1'>Password</label>
                            <input id='password' type='password' className="form-control p-2" {...register("password", { required: true, minLength: 6 })} />
                            {errors.password && <span className='text-danger'>Password must be at least 6 characters</span>}
                        </div>

                        <p><small className="form-text text-muted">We'll never share your information with anyone else.</small></p>

                        <p className='text-danger fw-bold mt-3 text-center'>{registerError}</p>

                        <input type="submit" className="btn btn-dark p-2" value="Register" />

                        <div className="mt-3">
                            <Link to='/login' className='text-black text-decoration-none'>
                                Already have an Account? <span className='text-primary text-decoration-underline'>Sign In</span>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Register;
