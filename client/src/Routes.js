import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchUser from './pages/UserSearch/SearchUser';
import ChatScreen from './pages/ChatScreen/ChatScreen';
import Auth from './pages/Authentication/Auth';

function AppRoutes(){
    return(
        <Router>
            <Routes>
                <Route path="/SearchUser" element={<SearchUser/>}/>
                <Route path="/ChatScreen" element={<ChatScreen/>}/>
                <Route path="/auth" element={<Auth/>}/>
            </Routes>
        </Router>
    );
}

export default AppRoutes;