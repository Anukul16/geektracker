const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
// const { use } = require('./MainRoute');

async function launchBrowser() {
    return await puppeteer.launch({ headless: true });
}

async function navigateToProfilePage(page, userName) {
    await page.goto(`https://auth.geeksforgeeks.org/user/${userName}`);
}


// ================================ Profile Check =====================================
async function checkProfileValidity(page) {
    try {
        const profileNameSelector = '.profile_name';
        await page.waitForSelector(profileNameSelector, { timeout: 3000 }); // Adjust timeout as needed

        const profileNameElement = await page.$(profileNameSelector);

        if (profileNameElement) {
            const profileName = await page.evaluate(element => element.textContent.trim(), profileNameElement); 

            if (profileName) {
                console.log('Profile Name:', profileName);
                return profileName;
            } else {
                console.log('Profile name is empty.');
                return null; // or handle appropriately based on your use case
            }
        } else {
            console.log('Profile name element not found.');
            return null; // or handle appropriately based on your use case
        }
    } catch (error) {
        console.error('Error checking profile validity:', error.message);
        return null; // or handle appropriately based on your use case
    }
}

// ================================ Overall Coding Score =================================
async function getOverallCodingScores(page) {
    try {
        const overallCodingScoreSelector = 'span.score_card_value';
        await page.waitForSelector(overallCodingScoreSelector, { timeout: 3000 });

        const overallCodingScores = await page.$$eval(overallCodingScoreSelector, elements =>
            elements.map(element => {
                const score = element.textContent.trim();
                return score === "_ _" ? "0" : score;
            })
        );

        return overallCodingScores;
    } catch (error) {
        console.error('Error in getOverallCodingScores:', error);
        return ['Not Found']; // Return a default value or handle the error accordingly
    }
}





// =================================== Maximum Streak ===========================================
async function getMaxStreak(page) {
    try {
        const maxStreakSelector = '.streakCnt';
        await page.waitForSelector(maxStreakSelector, { timeout: 3000 }); // Adjust timeout as needed

        const maxStreakElement = await page.$(maxStreakSelector);

        if (maxStreakElement) {
            let maxStreak = await page.$eval(maxStreakSelector, element => element.textContent.trim());
            maxStreak = maxStreak.split("/")[0];

            if (maxStreak.trim() >= "00" && maxStreak.trim() <= "09") {
                console.log('Max Streak:', maxStreak.trim()[1]);
                return maxStreak.trim()[1];
            } else {
                console.log('Max Streak:', maxStreak.trim());
                return maxStreak.trim();
            }
        } else {
            console.log('Max streak element not found.');
            return 'Not Found'; // or handle appropriately based on your use case
        }
    } catch (error) {
        console.error('Error getting max streak:', error.message);
        return 'Not Found'; // or handle appropriately based on your use case
    }
}



// ===================================== Univerysity Rank ======================================
async function getUniversityRank(page) {
    const universityRankSelector = '.rankNum';

    try {
        await page.waitForSelector(universityRankSelector, { timeout: 3000 });
        const universityRankElement = await page.$(universityRankSelector);

        if (universityRankElement) {
            let universityRank = await page.$eval(universityRankSelector, element => element.textContent.trim());
            return (universityRank !== '') ? universityRank : "Not Found";
        } else {
            console.log('University rank element not found.');
            return "Not Found"; // or handle appropriately based on your use case
        }
    } catch (error) {
        console.error('Error getting university rank:', error.message);

        if (error.name === 'TimeoutError') {
            console.log('University rank selector not found within the timeout. Using default value.');
            return "Not Found";
        } else {
            throw error;
        }
    }
}



// =================================== Get Data By Month ======================================
async function getDataByMonth(page) {
    const gSelector = 'div#cal-heatmap>svg.cal-heatmap-container>svg.graph>svg.graph-domain';
    const monthSelector = 'text.graph-label';

    try {
        await page.waitForSelector(gSelector, { timeout: 3000 });
        await page.waitForSelector(monthSelector, { timeout: 3000 });

        const allMonths = await page.$$eval(monthSelector, elements =>
            elements.map(element => element.textContent.trim())
        );

        const allSubmissions = await page.$$eval(gSelector, elements =>
            elements.map(element => element.textContent.trim())
        );

        const dataByMonth = {};

        allMonths.forEach((month, index) => {
            const submissions = allSubmissions[index].split("2023").map((str, idx) => {
                const partSubmission = str.split(' ');
                return partSubmission.length > 0 ? parseInt(partSubmission[0], 10) : null;
            });

            dataByMonth[month] = submissions.filter(submission => !isNaN(submission) && submission !== null);
        });

        return dataByMonth;
    } catch (error) {
        console.error('Error getting data by month:', error.message);

        if (error.name === 'TimeoutError') {
            console.log('Selectors not found within the timeout. Returning an empty data object.');
            return {};
        } else {
            throw error;
        }
    }
}


// ================================== Most Active Day In The Year ========================================
async function getMostActiveDayInYear(dataByMonth) {
    try {
        if (!dataByMonth || Object.keys(dataByMonth).length === 0) {
            console.log('No data available. Returning "Not Active".');
            return "Not Active";
        }

        const maxValueOfMonth = {};

        for (const month in dataByMonth) {
            if (dataByMonth.hasOwnProperty(month)) {
                const maxValue = Math.max(...dataByMonth[month]);
                maxValueOfMonth[month] = maxValue;
            }
        }

        let mostSubmissionOnDayCount = -1;
        let mostSubmissionOnDayOfMonth;
        let mostSubmissionOnDayIndex;

        for (const month in maxValueOfMonth) {
            if (maxValueOfMonth.hasOwnProperty(month)) {
                if (maxValueOfMonth[month] >= mostSubmissionOnDayCount) {
                    mostSubmissionOnDayCount = maxValueOfMonth[month];
                    mostSubmissionOnDayOfMonth = month;
                }
            }
        }

        if (mostSubmissionOnDayCount === 0) {
            console.log('No active days found. Returning "Not Active".');
            return "Not Active";
        }

        console.log(`${mostSubmissionOnDayOfMonth} -> ${mostSubmissionOnDayCount}`);

        if (mostSubmissionOnDayOfMonth) {
            mostSubmissionOnDayIndex = dataByMonth[mostSubmissionOnDayOfMonth].lastIndexOf(mostSubmissionOnDayCount);
        }

        const mostActiveDayInYear = mostSubmissionOnDayOfMonth
            ? `${mostSubmissionOnDayIndex + 1} ${mostSubmissionOnDayOfMonth}`
            : null;

        console.log(mostActiveDayInYear);
        return mostActiveDayInYear;
    } catch (error) {
        console.error('Error getting most active day in the year:', error.message);
        return "Not Active";
    }
}


// =================================== Sum By Month =========================================
// async function getSumByMonth(dataByMonth) {
//     const sumByMonth = {};

//     for (const month in dataByMonth) {
//         const sum = dataByMonth[month].reduce((acc, value) => acc + value, 0);
//         sumByMonth[month] = sum;
//     }
//     return sumByMonth
// }
// =================================== Total Active Days ==========================================
async function getTotalActiveDays(dataByMonth) {
    try {
        if (!dataByMonth || Object.keys(dataByMonth).length === 0) {
            console.log('No data available. Returning 0 active days.');
            return 0;
        }

        let activeDays = 0;

        for (const month in dataByMonth) {
            if (dataByMonth.hasOwnProperty(month)) {
                const submissions = dataByMonth[month];
                if (Array.isArray(submissions) && submissions.length > 0) {
                    const count = submissions.filter(submission => submission > 0).length;
                    activeDays += count;
                } else {
                    console.log(`Invalid data for ${month}. Skipping.`);
                }
            }
        }

        console.log('Total active days:', activeDays);
        return activeDays;
    } catch (error) {
        console.error('Error getting total active days:', error.message);
        return 0;
    }
}

// ================================== Most Active Month ===========================================
async function getMostActiveMonth(dataByMonth) {
    try {
        if (!dataByMonth || Object.keys(dataByMonth).length === 0) {
            console.log('No data available. Returning "Not Active" for most active month.');
            return "Not Active";
        }

        let maxCount = 0;
        let maxTotalSubmissions = 0;
        let mostActiveMonth = null;

        for (const month in dataByMonth) {
            if (dataByMonth.hasOwnProperty(month)) {
                const submissions = dataByMonth[month];

                if (Array.isArray(submissions) && submissions.length > 0) {
                    const count = submissions.filter(submission => submission > 0).length;

                    if (count > maxCount || (count === maxCount && submissions.reduce((acc, val) => acc + val, 0) >= maxTotalSubmissions)) {
                        maxCount = count;
                        maxTotalSubmissions = submissions.reduce((acc, val) => acc + val, 0);
                        mostActiveMonth = month;
                    }
                } else {
                    console.log(`Invalid data for ${month}. Skipping.`);
                }
            }
        }

        if (maxCount === 0) {
            console.log('No active days found. Returning "Not Active" for most active month.');
            return "Not Active";
        }

        console.log('Most Active Month:', mostActiveMonth);
        return mostActiveMonth;
    } catch (error) {
        console.error('Error getting most active month:', error.message);
        return "Not Active";
    }
}


// =============================================== Favourite Language =======================================
async function getFavouriteLanguage(page) {
    try {
        const langSelector = '.basic_details_data';
        await page.waitForSelector(langSelector);

        const basicDetails = await page.$$eval(langSelector, elements => {
            return elements.map(element => element.textContent.trim());
        });

        if (!basicDetails || basicDetails.length < 2) {
            console.log('Insufficient basic details. Returning "Not Found" for favorite language.');
            return 'Not Found';
        }

        const usedLanguages = basicDetails[1].split(',');
        const mixData = [basicDetails[0], ...usedLanguages];
        const languageArray = ['Java', 'C++', 'Javascript', 'Python'];

        const favLanguage = mixData.find(detail => languageArray.includes(detail));

        if (!favLanguage) {
            console.log('No favorite language found in the given language array.');
            return 'Not Found';
        }

        console.log('Basic Details:', basicDetails);
        console.log('Favorite Language:', favLanguage);
        
        return favLanguage;
    } catch (error) {
        console.error('Error getting favorite language:', error.message);
        return 'Not Found';
    }
}



// ======================================== Most Solved Category ===========================================
async function getDominantCategory(page) {
    try {
        const tagSelector = 'div.solved_problem_section>ul.linksTypeProblem';
        await page.waitForSelector(tagSelector, {timeout : 3000});

        const categories = await page.$$eval(tagSelector, elements => {
            return elements.map(element => element.textContent.trim());
        });

        if (!categories || categories.length === 0) {
            console.log('No categories found. Returning "Not Found" for dominant category.');
            return 'Not Found';
        }

        // Extract categories from the formatted string
        const categoriesList = categories[0].split(/\s+/);

        let mostSolvedCategory;
        let mostSolveCategoryQuestionCount = -1;

        for (let idx = 1; idx < categoriesList.length; idx += 2) {
            let currCategory = categoriesList[idx - 1];
            let currCategorySolvedQuestion = categoriesList[idx];
            let match = currCategorySolvedQuestion.match(/\((\d+)\)/);

            if (match && match[1]) {
                const solvedQuestion = parseInt(match[1], 10);
                if (solvedQuestion >= mostSolveCategoryQuestionCount) {
                    mostSolveCategoryQuestionCount = solvedQuestion;
                    mostSolvedCategory = currCategory;
                }
            }
        }

        if (!mostSolvedCategory) {
            console.log('No dominant category found.');
            return 'Not Found';
        }

        // Capitalize the first letter of the category
        return mostSolvedCategory.charAt(0).toUpperCase() + mostSolvedCategory.toLowerCase().slice(1);
    } catch (error) {
        console.error('Error getting dominant category:', error.message);
        return 'Not Found';
    }
}

// ======================== Profile Pic Getting =================
// async function getProfilePicLink(page) {
//     const picSelector = '.profile_pic';

//     await page.waitForSelector(picSelector);

//     const picLink = await page.$eval(picSelector, (element) => element.getAttribute('src'));

//     return picLink;
// }




// ===================================== Routing =================================
router.post('/username', async (req, res) => {
    const userName = req.body.username;

    try {
        if (!userName) {
            return res.status(400).json({ error: "Username is required" });
        }

        const browser = await launchBrowser();
        const page = await browser.newPage();

        try {
            await navigateToProfilePage(page, userName);

            const profileName = await checkProfileValidity(page);

            if (!profileName) {
                return res.status(404).json({ error: "Invalid Username or Profile Not Found" });
            }

            const allOverallCodingScores = await getOverallCodingScores(page);
            const maxStreak = await getMaxStreak(page);
            const universityRank = await getUniversityRank(page);

            const dataByMonth = await getDataByMonth(page);
            const mostActiveDayInYear = await getMostActiveDayInYear(dataByMonth);

            const totalActiveDays = await getTotalActiveDays(dataByMonth);
            const mostActiveMonth = await getMostActiveMonth(dataByMonth);

            const favLanguage = await getFavouriteLanguage(page);
            const dominantCategory = await getDominantCategory(page);

            await browser.close();

            res.status(200).json({
                profileName,
                overallCodingScore: allOverallCodingScores,
                maximumStreak: maxStreak,
                universityRank: universityRank,
                activeDays: totalActiveDays,
                activeMonth: mostActiveMonth,
                maxStreak: maxStreak,
                mostActiveDayInYear: mostActiveDayInYear,
                favoriteLanguage: favLanguage,
                mostSolveCategory: dominantCategory,
            });
        } catch (error) {
            console.error('Error during scraping:', error);
            res.status(500).json({ error: 'Internal Server Error during scraping' });
        } finally {
            await browser.close();
        }
    } catch (err) {
        console.error('Error initializing Puppeteer:', err);
        res.status(500).json({ error: 'Internal Server Error during Puppeteer initialization' });
    }
});

module.exports = router;
