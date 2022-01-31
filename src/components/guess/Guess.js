import React, {useEffect, useRef, useState} from 'react'
import './guess.css'
import Axios from "axios";
import {wait} from "@testing-library/user-event/dist/utils";


export default function Guess(props){
    let drawings = []
    const [message, setMessage] = useState('')
    const [correctWord,setCorrectWord] = useState('')
    const [guessedWord,setGuessedWord] = useState('')
    const [isDrawUp, setIsDrawUp] = useState(false)
    const [points,setPoints] = useState(0);
    Axios.defaults.withCredentials = true;
    const [currPoints,setCurrPoints] = useState(0)

    useEffect(()=>{

        Axios.post('https://moveoroye.herokuapp.com/deletepaths',
            {} // don't need to send data
        ).then((res) =>{
            console.log('paths deleted')
        })
        const canvas = canvasRef.current;
        canvas.width  = 800;
        canvas.height = 600;
        canvas.style.width  = '400px';
        canvas.style.height = '300px';
        const context = canvas.getContext("2d")
        context.scale(2,2);
        context.lineCap = "round"
        context.strokeStyle="black"
        context.lineWidth = 5;
        contextRef.current = context;

        getPoints()

        const interval = setInterval(() => {
            if(!isDrawUp) draw()
            Axios.get("https://moveoroye.herokuapp.com/getword").then(res => {
                setCorrectWord(Object.values(res.data[0])[1])
                setPoints(Object.values(res.data[0])[2])
            })

        }, 1000)

    },[])

    const getPoints = () =>{
        Axios.get("https://moveoroye.herokuapp.com/getallpoints").then((response)=>{
                // console.log('hello' + response.data.points)
                // setCurrPoints(response.data.points)
            setCurrPoints(parseInt(Object.values(response.data[0])))
            }
        )
    }

    //create api call to get correctWord chosen by user drawing
    const guess = () =>{
            if(correctWord === guessedWord){
                Axios.post('https://moveoroye.herokuapp.com/setpoints', {points:points}).then(()=>{
                    console.log('reached guess to change points')

                })
                endGameDeletePathsDeleteWords()
            }
            else{
                console.log('False! the correct word is: '+correctWord+' with '+ points+' points')
                setMessage('Oops, try again!')
            }
    }
    const endGameDeletePathsDeleteWords = () =>{

        Axios.post("https://moveoroye.herokuapp.com/deleteallwords").then(()=>{
            console.log('deleted words')
        })
        Axios.post("https://moveoroye.herokuapp.com/endgame",
            {done:1, points:points}).then(()=>{
            console.log('clearing draw')
            window.alert('Well done!')
            window.location.replace('https://moveoroye.herokuapp.com/choose')
            // DROP columns in drawings table.
            Axios.post('https://moveoroye.herokuapp.com/deletepaths',
                {} // don't need to send data
            ).then((res) =>{
                console.log('paths deleted')
            })
        })
    }
    const getDrawings = () =>{
        Axios.get("https://moveoroye.herokuapp.com/getdraw").then((x)=>{
            const pathLength = (x.data).length
            for(let iterator=0; iterator<pathLength; iterator++){
                drawings[iterator] = [Object.values(x.data[iterator])[1],Object.values(x.data[iterator])[2],Object.values(x.data[iterator])[3]]
            }
        })

    }
    const endGame = () =>{
        console.log('ending game')

        Axios.post("https://moveoroye.herokuapp.com/newscore",{score:currPoints}).then((x) =>{
            console.log(x.data)

        }).then(()=>{
            setCurrPoints(0)
            Axios.post("https://moveoroye.herokuapp.com/deletegames").then(()=>{
                console.log('deleted games')
            })
            endGameDeletePathsDeleteWords()

            window.location.replace('https://moveoroye.herokuapp.com/scores')
        })
    }
    const canvasRef = useRef(null)
    const contextRef = useRef(null)


    const draw = () => {
        getDrawings();
        var i = 0
        var currentpath = 0
        wait(1000).then(r => {
                // console.log(drawings.length)
                contextRef.current.beginPath();
                contextRef.current.moveTo(drawings[i][1], drawings[1][2]);
                while(i < drawings.length) {

                    while(currentpath === drawings[i][0]){
                        //console.log(drawings[i][0])
                        contextRef.current.lineTo(drawings[i][1], drawings[i][2]);
                        contextRef.current.stroke();
                    i++
                }
                contextRef.current.closePath()
                contextRef.current.moveTo(drawings[i][1], drawings[1][2]);
                contextRef.current.beginPath();
                currentpath++;
                }
        })
        setIsDrawUp(true)
    }


    return(
        <div className={"guess"}>
            {!isNaN(currPoints) ?            <p>Current game points {currPoints}</p>
: <p/>            }

            <p/>
            <canvas className={"canvas"}
                    ref={canvasRef}/>
            <p/>
            <p>The word worth {points} Points!</p>
                <label>Enter your guess</label>
                <p></p>
                <input className="guessedWord" type={"text"}
                       required
                       minLength={1}
                       maxLength={20}
                       onChange={(e) => {
                           setGuessedWord(e.target.value);
                       }}
                />
                <p/>
                <button className="btn" onClick={guess}>Submit</button>
            {/*</form>*/}
            {message.toString()!=='' ? <p>{message}</p> : <p/>}
            {/*create hints as a feature i.e. number of letters,...*/}
            <button className={"btn"} onClick={endGame}>End Game</button>

        </div>
    )
}