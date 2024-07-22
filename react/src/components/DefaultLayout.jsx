import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useEffect} from "react";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
    const {user, token, setUser, setToken, notification} = useStateContext();
    if (!token) {
        return <Navigate to="/login"/>
    }
    const onLogout = (evt) => {
        evt.preventDefault();
        axiosClient.post("/logout")
            .then((response) => {
                // Handle successful response
                setUser({});
                setToken(null);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized response
                    console.log("Unauthorized: ", error.response.data.message);
                } else {
                    // Handle other errors
                    console.error("An error occurred: ", error);
                }
            });
    }


    useEffect(() => {
        axiosClient.get('/user')
            .then(({data}) => {
                setUser(data)
            })
    }, [])

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>header</div>
                    <div>
                        {user.name}
                        <a href="#" className="btn-logout" onClick={onLogout}>Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet/>
                </main>
            </div>
            {notification && <div className='notification'>
                {notification}
            </div>}
        </div>
    )
}
