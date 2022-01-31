import React, { useState, useEffect, Component } from 'react';
import {Axios} from "axios";
import {render} from "react-dom";
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter
} from "react-router-dom"
import Choose from "./components/choose/Choose"
import Welcome from "./components/welcome/Welcome";
import Draw from "./components/draw/Draw";
import Guess from "./components/guess/Guess";
import Navbar from "./components/navbar/navbar";
import Scores from "./components/scores/Scores";

export default function App() {

        return (
            <BrowserRouter >

                <Navbar/>
                    <Routes>
                        <Route path='/' element={<Welcome/>} />
                    </Routes>
                    <Routes>
                        <Route path='/choose' element={<Choose/>} />
                    </Routes>
                    <Routes>
                        <Route path='/draw' element={<Draw/>}  />
                    </Routes>

                    <Routes>
                        <Route path='/guess' element={<Guess/>}  />
                    </Routes>
                <Routes>
                    <Route path='/scores' element={<Scores/>} />
                </Routes>

            </BrowserRouter>

        );

}

