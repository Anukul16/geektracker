// Card.js
import React, { useState } from 'react';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import '../Styles/card.css';
import '../Styles/user.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const Card = ({ userData }) => {

    const [downloadIcon,setDownloadIcon] = useState(true)
    const BASE_URL = process.env.BASE_URL;

    const takeSS = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/captureSS`, {
                method: 'POST',
            });
    
            if (response.ok) {
                console.log('Screenshot captured successfully');
                setDownloadIcon(false)
                // Convert the response to a blob (binary data)
                const blob = await response.blob();
    
                // Create a temporary link to trigger the download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'gfg_stats.png'; // Specify the desired filename
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to capture screenshot:', response.statusText);
            }
        } catch (error) {
            console.error('Error capturing screenshot:', error);
        }
    };
    


    return (

        <>
            {userData ? (
                <>

                    <div className="container main-div w-50 ">
                        <div className="row mt-2">
                            <div className="col-md-6 mt-2">
                                <h5 className='heading'>Hello {userData.profileName} </h5>
                                <h6 className='heading'>Let's explore your coding journey in  2023.....</h6>
                            </div>
                            <div className="col-md-6 mt-2 d-flex justify-content-end">
                                {
                                    downloadIcon ? (
                                        <DownloadForOfflineIcon style={{ fontSize: "3em", cursor: "pointer", color: "#00FAE9" }} className='downloadIcon' onClick={ takeSS } />
                                    ):(
                                        <CheckCircleIcon style={{ fontSize: "3em", cursor: "pointer", color: "#00FAE9" }} />
                                    )
                                }
                                
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.overallCodingScore[0]}</h2>
                                <p className='ptag'>Overall Coding Score</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.activeDays}</h2>
                                <p className='ptag'>Active Days</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.maxStreak}</h2>
                                <p className='ptag'>Maximum Streak</p>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.activeMonth}</h2>
                                <p className='ptag'>Most Active Month</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.mostActiveDayInYear}</h2>
                                <p className='ptag'>Most Active Day</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.overallCodingScore[1]}</h2>
                                <p className='ptag'>Problem Solved</p>
                            </div>
                        </div>
                        <div className="row mt-4 mb-5">
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.universityRank}</h2>
                                <p className='ptag'>University Rank</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.favoriteLanguage}</h2>
                                <p className='ptag'>Favourite Language</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h2 className='candara-font'>{userData.mostSolveCategory}</h2>
                                <p className='ptag'>Dominant Category</p>
                            </div>
                        </div>
                    </div>

                    {/* <Footer /> */}
                </>
            )

                : (
                    <p className='ptag'>Loading...</p>
                )}
        </>
    );
};

export default Card;
