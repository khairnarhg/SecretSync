import React, {useState, useEffect} from 'react';
import './SearchUser.css';
import {Link, Navigate} from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import axios from 'axios';
import humanlogo from '../../assets/logos/blankhuman.jpg'
import { useNavigate } from 'react-router-dom';


const SearchUser =()=>{
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser]= useState(null);
    const handleUserClick =(user)=>{
        setSelectedUser(user);
        const confirmStartConversation= window.confirm(`would you like to start a conversation with ${user.unum}?`);
        if(confirmStartConversation){
            console.log(`Starting conversation with ${user.unum}`);
            navigate(`/ChatScreen?unum=${user.unum}`);
            
        }
    }
    const [users, setUsers]= useState([]);

    useEffect(()=>{
        const fetchUsers= async()=>{
            try{
                const response= await axios({
                    method: "get",
                    baseURL:"http://localhost:5000/api",
                    url:"users"
                });
                setUsers(response.data);
                console.log(response.data);
            }catch(err){
                console.error(err);
            }
        };
        fetchUsers();
    }, []);
    return(


        <div className='User-Search-Page'>
            <nav className='Navbar'>
                <div className='Navbar-Content'>
                    <div className='Navbar-logo'>
                    SecretSync
                    </div>
                    <div className='Navbar-Menu'>
                        <Link className='Navbar-button'>
                            LOGOUT
                        </Link>
                    </div>
                </div>
            </nav>
            <div className='Page-Content'>
                <div className='Search-Bar'>
                    <button className="Search-button">
                    <BsSearch />
                    </button>
                    <input type="text" placeholder="SEARCH" className="Search-input" /> 
                </div>
                <div className='User-list'>
                    <ul>
                        {users.map(user=>(
                            <li key={user._id} className='User-Contact'  onClick={()=> handleUserClick(user)}>
                                <img src={humanlogo} alt=""  className='user-logo'/>
                                <span className='user-unum'>{user.unum}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default SearchUser;