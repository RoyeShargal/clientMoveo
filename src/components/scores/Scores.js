import React, {useEffect, useState} from "react";
import './scores.css'
import Axios from "axios";
import {render} from "react-dom";
export default function Scores(){
    const [scoresArr,setScoresArr] = useState([])
    const [refresh,setRefresh] = useState(0)
    useEffect(()=> {
        if(scoresArr.length===0) {
            viewScores()
        }

    },[])
    const viewScores = () =>{
            Axios.get('/getallscores').then(r => {
                const scores = Object.values(r.data)
                scores.forEach((x) => {
                    scoresArr.push(x)
                })
                setRefresh(1)
                console.log(scoresArr)

            })

    }

        return (
            <div>
                <div className={"backg"}>
                    <p className="title">Best Scores</p>

                    {
                        scoresArr.map((item) => (
                                <div key={item.idscore}>
                                    Game Number: {item.idscore}  Points: {item.points}
                                    <p/>
                                </div>
                            )
                        )
                    }
                    {/*{scoresArr.toString()}*/}
                </div>
            </div>
        )

}