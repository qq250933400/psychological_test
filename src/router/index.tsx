/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Profile, Test, Description } from "../pages";

export default (): any=> {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/test" element={<Test />}/>
                <Route path="/description" element={<Description />}/>
                <Route path="/" element={<span>Name</span>}/>
            </Routes>
        </BrowserRouter>
    );
};