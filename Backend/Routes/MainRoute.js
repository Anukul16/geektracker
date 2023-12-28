const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
// const { use } = require('./MainRoute');

async function launchBrowser() {
    return await puppeteer.launch({ headless: false });
}

async function navigateToProfilePage(page, userName) {
    await page.goto(`https://auth.geeksforgeeks.org/user/${userName}`);
}


// ================================ Profile Check =====================================
async function checkProfileValidity(page) {
    const profileNameSelector = '.profile_name';
    await page.waitForSelector(profileNameSelector);
    const profileName = await page.$eval(profileNameSelector, element => element.textContent.trim());
    return profileName;
}
// ================================ Overall Coding Score =================================
async function getOverallCodingScores(page) {
    const overallCodingScoreSelector = 'span.score_card_value';
    await page.waitForSelector(overallCodingScoreSelector);
    return await page.$$eval(overallCodingScoreSelector, elements =>
        elements.map(element => element.textContent.trim())
    );
}



// =================================== Maximum Streak ===========================================
async function getMaxStreak(page) {
    const maxStreakSelector = '.streakCnt';
    await page.waitForSelector(maxStreakSelector);
    let maxStreak = await page.$eval(maxStreakSelector, element => element.textContent.trim());
    maxStreak = maxStreak.split("/")[0];
    // console.log( maxStreak);
    return maxStreak.trim() >= "00" && maxStreak.trim() <= "09" ? maxStreak.trim()[1] : maxStreak.trim();
}


// ===================================== Univerysity Rank ======================================
async function getUniversityRank(page) {
    const universityRankSelector = '.rankNum';

    try {
        await page.waitForSelector(universityRankSelector, { timeout: 5000 });
        let universityRank = await page.$eval(universityRankSelector, element => element.textContent.trim());
        return (universityRank !== '') ? universityRank : "Not Found";
    } catch (error) {
        console.error('Error:', error);
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
    await page.waitForSelector(gSelector);

    const monthSelector = 'text.graph-label';
    await page.waitForSelector(monthSelector);

    const allMonths = await page.$$eval(monthSelector, elements =>
        elements.map(element => element.textContent.trim())
    );

    const allSubmissions = await page.$$eval(gSelector, elements =>
        elements.map(element => element.textContent.trim())
    );
    // console.log("ASL: ",allSubmissions[0]);
    const dataByMonth = {};

    allMonths.forEach((month, index) => {
        const submissions = allSubmissions[index].split("2023").map((str, idx) => {
            const partSubmission = str.split(' ');
            return partSubmission.length > 0 ? parseInt(partSubmission[0], 10) : null;
        });

        // dataByMonth[month] = submissions.filter(submission => submission !== null);
        dataByMonth[month] = submissions.filter(submission => !isNaN(submission) && submission !== null);
    });
    return dataByMonth
}


// ================================== Most Active Day In The Year ========================================
async function getMostActiveDayInYear( dataByMonth) {
    const maxValueOfMonth = {}
    for (const month in dataByMonth) {
        if (dataByMonth.hasOwnProperty(month)) {
            const maxValue = Math.max(...dataByMonth[month]);
            maxValueOfMonth[month] = maxValue;
        }
    }

    let mostSubmissionOnDayCount = -1
    let mostSubmissionOnDayOfMonth;
    let mostSubmissionOnDayIndex;
    for (const month in maxValueOfMonth) {
        if (maxValueOfMonth.hasOwnProperty(month)) {
            if (maxValueOfMonth[month] >= mostSubmissionOnDayCount) {
                mostSubmissionOnDayCount = maxValueOfMonth[month]
                mostSubmissionOnDayOfMonth = month
            }
        }
    }
    if(mostSubmissionOnDayCount===0)return "Not Active"
    console.log(mostSubmissionOnDayOfMonth + "->" + mostSubmissionOnDayCount);
    if (mostSubmissionOnDayOfMonth) {
        mostSubmissionOnDayIndex = dataByMonth[mostSubmissionOnDayOfMonth].lastIndexOf(mostSubmissionOnDayCount)
        // console.log(mostSubmissionOnDayIndex);
    }

    let mostActiveDayInYear = (mostSubmissionOnDayIndex + 1) + " " + mostSubmissionOnDayOfMonth;
    console.log(mostActiveDayInYear);
    return mostActiveDayInYear 
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

    let activeDays = 0;

    for (const month in dataByMonth) {
        const submissions = dataByMonth[month];
        const count = submissions.filter(submission => submission > 0).length;
        activeDays += count
    }

    // console.log('Total active days:', activeDays);
    return activeDays
}
// ================================== Most Active Month ===========================================
async function getMostActiveMonth(dataByMonth) {
    let maxCount = 0;
    let maxTotalSubmissions = 0;
    let mostActiveMonth = null;

    for (const month in dataByMonth) {
        const submissions = dataByMonth[month];
        const count = submissions.filter(submission => submission > 0).length;

        if (count > maxCount || (count === maxCount && submissions.reduce((acc, val) => acc + val, 0) >= maxTotalSubmissions)) {
            maxCount = count;
            maxTotalSubmissions = submissions.reduce((acc, val) => acc + val, 0);
            mostActiveMonth = month;
        }
    }
    if(maxCount===0)return "Not Active"
    return mostActiveMonth || "Not Active";
}


// =============================================== Favourite Language =======================================
async function getFavouriteLanguage(page) {
    const langSelector = '.basic_details_data';
    await page.waitForSelector(langSelector);
    
    const basicDetails = await page.$$eval(langSelector, elements => {
        return elements.map(element => element.textContent.trim());
    });

    const usedLanguages = basicDetails[1].split(',')
    const mixData = [basicDetails[0], ...usedLanguages]
    const languageArray = ['Java', 'C++', 'Javascript', 'Python'];

    const favLanguage = mixData.find(detail => languageArray.includes(detail));
    
    // const favLanguage = usedLanguages[0]
    
    console.log('Basic Details:', basicDetails);
    // console.log('Favorite Language:', array);


    return favLanguage || 'Not Found';
}



// ======================================== Most Solved Category ===========================================
async function getDominantCategory(page) {
    const tagSelector = 'div.solved_problem_section>ul.linksTypeProblem';
    await page.waitForSelector(tagSelector);

    const categories = await page.$$eval(tagSelector, elements => {
        return elements.map(element => element.textContent.trim());
    });

    // Extract categories from the formatted string
    const categoriesList = categories[0].split(/\s+/);

    let mostSolvedCategory;
    let mostSolveCategoryQuestionCount = -1;
    for (let idx = 1; idx < categoriesList.length; idx += 2) {
        let currCategory = categoriesList[idx - 1]
        let currCategorySolvedQuestion = categoriesList[idx]
        let match = currCategorySolvedQuestion.match(/\((\d+)\)/)

        if (match && match[1]) {
            const solvedQuestion = parseInt(match[1], 10)
            if (solvedQuestion >= mostSolveCategoryQuestionCount) {
                mostSolveCategoryQuestionCount = solvedQuestion
                mostSolvedCategory = currCategory
            }
        }
    }
    // return mostSolvedCategory.toLowerCase().charAt(0).toUpperCase() + mostSolvedCategory.slice(1)
    return mostSolvedCategory.charAt(0).toUpperCase() + mostSolvedCategory.toLowerCase().slice(1)


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
        const browser = await launchBrowser();
        const page = await browser.newPage();

        await navigateToProfilePage(page, userName);

        const profileName = await checkProfileValidity(page);
        console.log(profileName);
        if (!profileName) {
            await browser.close();
            return res.status(400).json({ error: "Invalid Username" });
        }

        console.log(profileName);
        const allOverallCodingScores = await getOverallCodingScores(page);
        const maxStreak = await getMaxStreak(page);
        const universityRank = await getUniversityRank(page);

        const dataByMonth = await getDataByMonth(page)
        const mostActiveDayInYear = await getMostActiveDayInYear(dataByMonth);

        // const sumByMonth = await getSumByMonth(dataByMonth)

        const totalActiveDays = await getTotalActiveDays(dataByMonth);
        const mostActiveMonth = await getMostActiveMonth(dataByMonth);

        const favLanguage = await getFavouriteLanguage(page)
        const dominantCategory = await getDominantCategory(page)
        const profileSrc = await getProfilePicLink(page)

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
            profileSrc: profileSrc
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
