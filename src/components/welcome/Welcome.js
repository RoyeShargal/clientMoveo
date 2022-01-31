import React, {useState} from 'react'
import Axios from "axios";
import './welcome.css'

export default function Welcome(){
    const [username, setUsername] = useState('')
    // const [numPlayers, setNumPlayers] = useState(0)
    const register = (event) => {
        event.preventDefault()
        Axios.post("https://moveoroye.herokuapp.com/welcome",{
            username: username,
        }).then((res) => {
            console.log(res);
            window.alert("Welcome "+username)

            Axios.get("https://moveoroye.herokuapp.com/players").then(x =>{
                const numPlayers = ((x.data)[0])
                if ((Object.values(numPlayers)[0]) %2 == 0){
                    // init new game
                    Axios.post("https://moveoroye.herokuapp.com/newgame").then(x =>{
                        console.log('game created')
                    })
                    window.location.replace('https://moveoroye.herokuapp.com/choose')
                }
                else{
                    console.log('hello')
                    window.location.replace('https://moveoroye.herokuapp.com/guess')
                }
            })
        });
    }

    return(
            <div className={"backg"}>
        <span className={"text"}>
            Welcome mate!
        </span>
            <p/>

        <form onSubmit={register}>
            <label className={"text"}>Enter your name & press play</label>
                <p></p>
            <input className="textbox" type={"text"}

                   required
                   minLength={1}
                   maxLength={10}
                   onChange={(e) => {
                       setUsername(e.target.value);
                   }}
            />

            <p/>
            <button className="btn" >Play!</button>

            <div className="cen">
            </div>
        </form>
            </div>
    )
}