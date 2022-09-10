/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import loadable from "@loadable/component";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Login, Profile, Test, Description, Question, History, Report, Identity } from "../pages";

const LoginFor24 = loadable(()=> import(/** webpackChunkName: "LoginFor24" */"../pages/24/Login"));
const DescriptionFor24 = loadable(()=> import(/** webpackChunkName: "LoginFor24" */"../pages/24/Description"));
const TestFor24 = loadable(()=> import(/** webpackChunkName: "TestFor24" */"../pages/24/Test"));
const HistoryFor24 = loadable(()=> import(/** webpackChunkName: "TestFor24" */"../pages/24/History"));
const ReportFor24 = loadable(()=> import(/** webpackChunkName: "TestFor24" */"../pages/24/Report"));

export default (props: any): any=> {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/test" element={<Test />}/>
                <Route path="/description" element={<Description />}/>
                <Route path="/question" element={<Question />}/>
                <Route path="/history" element={<History />}/>
                <Route path="/report" element={<Report />}/>
                <Route path="/identity" element={<Identity />} />
                <Route path="/loginFor24" element={<LoginFor24 />} />
                <Route path="/testDesc" element={<DescriptionFor24 />} />
                <Route path="/testFor24" element={<TestFor24 />} />
                <Route path="/historyFor24" element={<HistoryFor24 />} />
                <Route path="/reportFor24" element={<ReportFor24 />} />
                <Route path="/" element={<Identity />}/>
            </Routes>
            { props.children }
        </HashRouter>
    );
};