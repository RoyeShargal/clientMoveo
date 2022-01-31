import React, {useEffect, useRef, useState} from 'react'
import Axios from "axios";
import './draw.css'
import {render} from "react-dom";
import {wait} from "@testing-library/user-event/dist/utils";

import Guess from '../guess/Guess'
export default function Draw(props){
    let drawings = []
    const [isDrawUp, setIsDrawUp] = useState(false)
    const [message, setMessage] = useState('')

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [sent,setSent] = useState(false)
    const [isDrawing,setIsDrawing] = useState(false)
    const [drawList, setDrawList] = useState([])
    const[paths,setPaths] = useState(0)
    const [choosedWord,setChoosenWord] = useState('')
    const [prefix,setPrefix] = useState('')
    const [correctWord,setCorrectWord] = useState('')
    const [guessedWord,setGuessedWord] = useState('')
    const [game,setGame] = useState(0)

    useEffect(() =>{

        const canvas = canvasRef.current;
        // canvas.width = (window.innerWidth*2);
        // canvas.height = (window.innerHeight*2);
        // canvas.style.height = `${window.innerHeight}px`;
        // canvas.style.width = `${window.innerWidth}px`;
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

        Axios.get("https://moveoroye.herokuapp.com/getword").then(res =>{
            setChoosenWord(Object.values(res.data[0])[1])
        })

        const interval = setInterval(() => {
            {
                Axios.get("https://moveoroye.herokuapp.com/getgame").then(res =>{
                    setGame(Object.values(res.data[0])[2])
                    console.log('status is='+Object.values(res.data[0])[2])
                    if (Object.values(res.data[0])[2]===1){
                        //game finished
                        //reset game to undone, i.e. 0
                        Axios.post("https://moveoroye.herokuapp.com/endgame",
                            {done:0}).then(()=>{
                            Axios.post("https://moveoroye.herokuapp.com/newgame").then(x =>{
                                console.log('game created')
                                clear()
                                window.location.replace('https://moveoroye.herokuapp.com/guess')
                            })

                        })
                    }
                })
            }

        }, 1000)





    },[])

    const startDrawing = ({nativeEvent}) => {
        const{offsetX,offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX,offsetY)
        setIsDrawing(true)
    }

     const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
        setPaths(paths+1)
        console.log(paths)
        console.log(drawList)
    }

    const send = () =>{
        setSent(true)
        console.log('sending draw')
        Axios.post("https://moveoroye.herokuapp.com/draw",{
            drawings: drawList,
            paths: paths
        }).then((res) => {
        });

    }

    const clear = () =>{
        console.log('clearing draw')
                // DROP columns in drawings table.
                Axios.post('https://moveoroye.herokuapp.com/deletepaths',
                    {} // don't need to send data
                ).then((res) =>{
                    console.log('paths deleted')
                })
        window.location.replace('https://moveoroye.herokuapp.com/draw')


    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing){
            return
        }
        const {offsetX,offsetY} = nativeEvent;
        drawList.push([paths,offsetX,offsetY]);
        contextRef.current.lineTo(offsetX,offsetY);
        contextRef.current.stroke();
    }

    return(
        <div className={"draw"}>
            <p className={"draw"}>Draw {prefix} {choosedWord}!</p>
            <canvas className={"canvas"}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}/>
            <p/>
                <div >
                    {!sent ? <button className={"btn"} type="text" onClick={send}>Send</button>
                    :<p/>}
                <button type="text"  className={"btn"} onClick={clear}>Clear</button>
                </div>

        </div>
    )
}
