import React, {useState} from 'react'
import './choose.css'
import Axios from "axios";

export default function Choose(){
    const randomWords = require('random-words');
    const [name,setName] = useState('');
    const [points,setPoints] = useState(0)
    let sampleWords = randomWords(300);
    sampleWords.sort(function(a,b){
        return a.length - b.length;
    })
    const words = [sampleWords[20],sampleWords[200],sampleWords[sampleWords.length-1]]

    const chosenWord = (name,points) => {
        Axios.post("https://moveoroye.herokuapp.com/choose", {
            name: name,
            points:points
        }).then((res) => {
            console.log(res)
            window.alert('You choose the word '+name+'!');
            window.location.href= "/draw";
            })
    }
    return(
        <div className="backg">
            <p className={"text"}>
                So, we are about to play!
            </p>
            <p className={"text"}>
                Please choose one of the following words:
            </p>
            <table className="wordsView">
                <thead>
                <tr>
                    <td className="words" onClick={(e) => {
                        chosenWord(words[0],1)
                    }}>
                        {words[0]}
                    </td>
                    <td className="words" onClick={() => {
                        chosenWord(words[1],3)
                    }}>
                        {words[1]}
                    </td>
                    <td className="words" onClick={() => {
                        chosenWord(words[2],5)
                    }}>
                        {words[2]}
                    </td>
                </tr>
                </thead>
            </table>
        </div>
    )
}