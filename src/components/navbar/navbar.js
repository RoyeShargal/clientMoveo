import React from 'react'
import {Link} from "react-router-dom";
import './navbar.css'
export default function Navbar(){
    return(
        <div className={"top"}>
            <div className={"topCenter"}>
                <ul className={"topList"}>
                    <li className="topListItem">
                        <Link to="/scores">Scores</Link>
                    </li>

                </ul>
            </div>

        </div>
    )
}