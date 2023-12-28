import React, { useState } from 'react';
import '../Styles/user.css';
import Card from './Card';
import LoopIcon from '@mui/icons-material/Loop';

const User = () => {
    const [username, setUserName] = useState("");
    const [showCard, setShowCard] = useState(false);
    const [userData, setUserData] = useState(null);
    const [wrapButton, setWrapButton] = useState(true)
    const [loadIcon, setLoadIcon] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            setLoadIcon(true)
            const response = await fetch(`http://localhost:5000/api/username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            });
            if (!response.ok) {
                if (response.status === 400) {
                    const responseBody = await response.json();
                    alert(responseBody.error || 'An error occurred');
                }else if(response.status === 404){
                    const responseBody = await response.json();
                    alert(responseBody.error || 'An error occurred');
                }
                
                setLoadIcon(false)
                // // alert("Invalid UserName :(")
                // throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setLoadIcon(false)
            setUserData(data);
            setShowCard(true);
        } catch (err) {
            console.error('Error:', err)
        }
    };

    return (
        <>
            {showCard ? (
                <Card userData={userData} />
            ) : (
                <div className="container d-flex justify-content-center vh-90 mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="text-center mt-2">
                            <h1 className='mt-5 main-heading'>Geek Tracker</h1>
                            <h2 className='mt-4 lower-heading'>Explore Your 2023 GeeksforGeeks Stats</h2>
                            {!wrapButton ? (
                                <>
                                    <div className='inputdiv text-center mb-5'>
                                        <input
                                            type="text"
                                            className="inputbox mt-4 me-3"
                                            id="exampleInputEmail1"
                                            placeholder="Enter Your GFG Username"
                                            value={username}
                                            onChange={(e) => setUserName(e.target.value)}
                                            spellCheck="false"
                                            // disabled={loadIcon}
                                            
                                        />
                                        <button type="submit" className="btn-primary mt-3  submitBtn">
                                            Check
                                        </button>

                                    </div>
                                    {loadIcon ? (
                                        <LoopIcon style={{ fontSize: "3em", color: "whitesmoke", animation: "rotate 2s linear infinite" }} />
                                    ) 
                                    : null}
                                </>
                            ) : (

                                <button onClick={() => setWrapButton(false)} className='wrap-button mt-2 mb-5'>Let's Wrap 2023</button>

                            )}
                        </div>
                    </form>
                </div>

            )}
        </>
    );
};

export default User;
