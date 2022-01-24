
//import React, { useState, useEffect } from "react";
export default function Timer(props) {







    return (
        <>
            <p className="text-timer-sect">
                Let's see your best time. Click the button to set the timer:
            </p>
            <div className='timer-section'>
                <button className="Go-btn" onClick={props.handleClick} disabled={props.disableButton}>
                    Go!
                </button>
                <div className="timer-counter">
                    {props.Timer}
                </div>
            </div></>

    )
} 