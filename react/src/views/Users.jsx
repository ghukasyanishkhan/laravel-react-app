import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        links: [],
        current_page: 1,
        last_page: 1
    });
    const { setNotification } = useStateContext();

    useEffect(() => {
        getUsers(pagination.current_page);
    }, [pagination.current_page]);

    const getUsers = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setPagination(data.meta);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onPageChange = (url) => {
        const page = new URL(url).searchParams.get('page');
        setPagination(prev => ({ ...prev, current_page: parseInt(page, 10) }));
    };

    const onDelete = (user) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        setLoading(true);
        axiosClient.delete(`/users/${user.id}`)
            .then(() => {
                setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
                setLoading(false);
                setNotification('User was successfully deleted');
            })
            .catch(error => {
                setLoading(false);
                alert("There was an error deleting the user!");
                console.error("There was an error deleting the user!", error);
            });
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Users</h1>
                <Link to="/users/new" className='btn-add'>Add new</Link>
            </div>
            <div className='card animated fadeInDown'>
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Create Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    {loading && (
                        <tbody>
                        <tr>
                            <td colSpan='5' className='text-center'>
                                <b style={{ fontSize: 22 }}> Loading...</b>
                            </td>
                        </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.created_at}</td>
                                    <td>
                                        <Link className='btn-edit' to={'/users/' + user.id}>Edit</Link>
                                        &nbsp;
                                        <button onClick={() => onDelete(user)} className='btn-delete'>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='5' className='text-center'>
                                    <b style={{ fontSize: 22 }}> No users found</b>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    )}
                </table>
                <Pagination pagination={pagination} onPageChange={onPageChange} />
            </div>
        </div>
    );
}
