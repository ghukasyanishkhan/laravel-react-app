import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserForm() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient(`/users/${id}`)
                .then(({data}) => {
                    setLoading(false);
                    setUser(data);
                })
                .catch(() => {
                    setLoading(false);
                })
        }, []);

    }

    function onSubmit(evt) {
        evt.preventDefault();

        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User was successfully updated:')
                    navigate('/users')
                })
                .catch(error => {

                    const response = error.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    }
                })
        } else {
            axiosClient.post(`/users`, user)
                .then(() => {
                    setNotification('User was successfully created:')
                    navigate('/users')
                })
                .catch(error => {
                    const response = error.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    }
                })
        }
    }

    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className='text-center'>Loading...</div>
                )}
                {
                    errors && <div className="alert">
                        {Object.keys(errors).map((key) => {
                            return <p key={key}> {errors[key][0]} </p>
                        })}
                    </div>
                }
                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input value={user.name} type='text' onChange={(evt) => {
                            setUser({...user, name: evt.target.value})
                        }} placeholder='Name'/>
                        <input value={user.email} type='email' onChange={(evt) => {
                            setUser({...user, email: evt.target.value})
                        }} placeholder='Email'/>
                        <input type='password' onChange={(evt) => {
                            setUser({...user, password: evt.target.value})
                        }} placeholder='Password'/>
                        <input type='password' onChange={(evt) => {
                            setUser({...user, password_confirmation: evt.target.value})
                        }} placeholder='Password Confirmation'/>
                        <button type='submit' className='btn'>Save</button>
                    </form>
                }

            </div>
        </>
    )
}
