const { faker } = require("@faker-js/faker");
const pt = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const UserAgent = require("user-agents");
const { WebClient } = require("@slack/web-api");
// const exec  = require("child_process").execFile;

let chalk;

(async () => {
  chalk = (await import("chalk")).default;
})();

var Fakerator = require("fakerator");
//var locales = ['','en-CA','en-AU',"",'pl-PL','de-DE',"",'fr-FR','nb-NO','pl-PL',"",""];
var blockedCountry = [
  "Russia",
  "China",
  "Iran",
  "Cuba",
  "Syria",
  "Afghanistan",
  "Bangladesh",
  "Belarus",
  "Iraq",
  "Yemen",
  "Venezuela",
  "Lebanon",
  "Libya",
  "Nigeria",
  "Canada",
  "Austria",
  "Argentina",
  "North Korea",
  "South Sudan",
];

// Function to check if a country is blocked
async function isCountryBlocked(country) {
  return blockedCountry.includes(country);
}

pt.use(StealthPlugin());

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
pt.use(
  AdblockerPlugin({
    interceptResolutionPriority: 0,
  })
);

const PASSWORD = "!@#QWE123qwe";
// const FILENAME = "accounts.txt";
const axios = require("axios");

// Function to get the public IP address
async function getPublicIP() {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error fetching the public IP address:", error);
    return null;
  }
}
function extractPrimaryLanguage(localeString) {
  // Split the string by commas
  const locales = localeString.split(",");

  // Filter out local codes that don't have a country code (i.e. codes that don't contain a '-')
  const primaryLocales = locales.filter((locale) => locale.includes("-"));

  // Return the first primary locale or fallback to null if none exists
  return primaryLocales.length > 0 ? primaryLocales[0] : null;
}

// Function to get location and locale by IP
async function getLocationByIP() {
  try {
    const response = await axios.get(`https://ipapi.co/json/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}
// Call the function

// // Proxy server details
// const PROXY_SERVER = '';
// const PROXY_USERNAME = '12341234';
// const PROXY_PASSWORD = 'Upwork123';

let SLACK_APP_TOKEN1 = "";

SLACK_APP_TOKEN1 += "xoxb-";
SLACK_APP_TOKEN1 += "7995635574930-802809";
SLACK_APP_TOKEN1 += "7375191-55MyRMWcM";
SLACK_APP_TOKEN1 += "CfvCblCwiOCJ3dl";

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN || SLACK_APP_TOKEN1;
const SLACK_CHANNEL_ID = "U081PCH08AY";

const web = new WebClient(SLACK_APP_TOKEN);

/**
 * Function for sending notification to the slack channel
 * @param {string} message
 */

async function sendSlackMessage(message) {
  try {
    // Post a message to the channel
    await web.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: message,
    });
  } catch (error) {
    console.log("send message error!");
  }
}

function convertToEnUS(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const emails = ["@outlook.com", "@yahoo.com", "@gmail.com"];
//"@runbox.com", "@posteo.de", "@gmx.com", "@outlook.com", "@yahoo.com", "@gmail.com"

// const COUNTRY = "Canada";

const getRandomEmail = () => {
  return emails[Math.floor(Math.random() * emails.length)];
};

const formatDateTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function updateStatus(newStatus) {
  process.stdout.clearLine(); // Clear the current line
  process.stdout.cursorTo(0); // Move the cursor to the beginning of the line
  process.stdout.write(newStatus);
}

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const signup = async (page, firstName, lastName, emailAddress) => {
  try {
    // Close the cookie consent popup if it appears
    try {
      await page.waitForSelector(
        'div#onetrust-close-btn-container button[aria-label="Close"]',
        { timeout: 10000 }
      );
      await page.$eval(
        'div#onetrust-close-btn-container button[aria-label="Close"]',
        (el) => el.click()
      );
      updateStatus("Cookie consent popup closed");
    } catch (error) {
      updateStatus("Cookie consent popup not found, proceeding...");
    }

    // Click on 'Work' button
    updateStatus("SignUp State2...");
    await page.screenshot({ path: "state2.png" }); // Add screenshot here
    await page.waitForSelector('[data-qa="work"]', { timeout: 10000 });
    await page.$eval('[data-qa="work"]', (el) => el.click());
    await page.$eval(`button[type="button"][data-qa="btn-apply"]`, (el) =>
      el.click()
    );

    // Get a random index from the array of names for the specified country
    // const randomIndex = Math.floor(Math.random() * nameArray[COUNTRY].length);
    // Extract the first name and last name from the selected country
    // const { firstName, lastName } = nameArray[COUNTRY][randomIndex];

    // Fill out the signup form
    updateStatus("SignUp State3...");
    await page.waitForSelector("#first-name-input", { timeout: 10000 });
    await page.type("#first-name-input", firstName);
    await page.type("#last-name-input", lastName);
    // await page.type('#first-name-input', 'Higgins');
    // await page.type('#last-name-input', 'Randy');
    await page.type("#redesigned-input-email", emailAddress);
    await page.type("#password-input", PASSWORD);

    // Wait for the country dropdown to appear and select country
    // updateStatus("SignUp State4-country...");
    // await page.waitForSelector('[aria-labelledby*="select-a-country"]', {
    //   timeout: 10000,
    // });
    // await delay(1500);
    // await page.$eval('[aria-labelledby*="select-a-country"]', (el) =>
    //   el.click()
    // );
    // await page.waitForSelector('[autocomplete="country-name"]');
    // await page.type('[autocomplete="country-name"]', COUNTRY);
    // await page.$eval('[aria-labelledby="select-a-country"] li', (el) =>
    //   el.click()
    // );
    // Accept terms and conditions
    await delay(2000);
    await page.waitForSelector("#checkbox-terms", { timeout: 10000 });
    await page.$eval("#checkbox-terms", (el) => el.click());
    await delay(5000);
    await page.waitForSelector("#button-submit-form", { timeout: 20000 });
    await page.$eval("#button-submit-form", (el) => el.click());
    updateStatus("Verify email...");
    try {
      const alert_div = await page.waitForSelector("div.air3-alert-content", {
        timeout: 50000,
      });
      const alertContent = await alert_div.evaluate((el) => el.textContent);
      let verificationFailed = alertContent.includes(
        "Verification failed. Please try again."
      );

      let serverError = alertContent.includes(
        "This almost never happens, but something went wrong."
      );
      if (verificationFailed || serverError) {
        updateStatus("Alert content found. Closing browser...");
        await delay(4000);
        return false;
      } else {
        return true;
      }
    } catch (error) {
      // If the alert content is not found after 30 seconds, continue with the original logic
      updateStatus("Alert content not found.");
      return true;
    }
  } catch (error) {
    updateStatus(`Error in signup: ${error.message}`);
    throw error;
  }
};

const checkConnect = async (page, emailAddress) => {
  try {
    await retry(() =>
      page.goto(
        "https://www.upwork.com/jobs/Python-engineer-with-knowledge-sqlaclhemy_~021853222477736450955/?referrer_url_path=%2Fnx%2Fsearch%2Fjobs%2F",
        {
          waitUntil: "domcontentloaded",
        }
      )
    );
    await page.waitForSelector("div.text-light-on-muted.mt-5 div.mt-2", {
      timeout: 20000,
    });
    await delay(1500);
    const availableConnects = await page.evaluate(() =>
      document
        .querySelector("div.text-light-on-muted.mt-5 div.mt-2")
        .textContent.trim()
    );
    console.log("test result========>", availableConnects);
    const suspended = await page.evaluate(() => {
      const elements = document.querySelectorAll("div.air3-alert-content");
      return Array.from(elements)
        .map((el) => el.textContent)
        .join(" ");
    });

    if (
      availableConnects === "Available Connects: 10" &&
      !suspended.includes(
        "You are unable to complete ID Verification due to a suspension on your account."
      )
    ) {
      const date = formatDateTime();

      async function main() {
        const { ip, country_name } = await getLocationByIP();
        const logEntry = `${date} ${emailAddress} : ${PASSWORD} ${ip} ${country_name}\n`;
        sendSlackMessage(`${logEntry}`);
        // console.log(country_name);
      }
      main();

      await delay(5000);
      return true;
    }
    return false;
  } catch (error) {
    updateStatus(`Error in checkConnect: ${error.message}`);
    await delay(4000);
    throw error;
  }
};

const readMail = async (page, emailAddress) => {
  try {
    await delay(10000);

    await page.goto(`https://generator.email/${emailAddress}`, {
      waitUntil: "domcontentloaded",
    });
    for (let i = 0; i < 5; i++) {
      const href = await page.evaluate(() => {
        const aTags = document.querySelectorAll(".button-holder a");
        return aTags.length > 0 ? aTags[0].href : "";
      });
      if (href) return href;
      else {
        updateStatus("Email not found. Retrying...");
        await delay(5000);
      }
    }

    throw new Error("Inbox is empty after multiple retries");
  } catch (error) {
    updateStatus(`Error in readMail: ${error.message}`);
    throw error;
  }
};

const randomNumber = () => Math.floor(Math.random() * 10000000);

// function killProcessByName(processName) {
//     const command = `taskkill /F /IM ${processName}`; // `/F` is for forcefully terminating the process, `/IM` specifies the image name

//     exec(command, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error occurred while trying to kill the process: ${error.message}`);
//             return;
//         }

//         if (stderr) {
//             console.error(`Error output: ${stderr}`);
//             return;
//         }

//         console.log(`Process terminated successfully: ${stdout}`);
//     });
// }
function terminateProtonVPN() {
  const { exec } = require("child_process");
  exec("killProton.exe", (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Error occurred while trying to kill the process: ${error.message}`
      );
      return;
    }
    console.log(stdout);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    } else {
      console.log("ProtonVPN process terminated successfully.");
    }
  });
}

function isProcessRunning(processName) {
  // Execute the tasklist command to get the list of running processes
  const { exec } = require("child_process");
  exec("tasklist", async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching process list: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }

    // Check if the processName is in the stdout (the list of processes)
    const processList = stdout.split("\n").map((line) => line.trim());
    const running = processList.some((line) => line.startsWith(processName));

    if (running) {
      console.log(`${processName} is running.`);
    } else {
      console.log(`Connecting ${processName}....`);
      await Connect();
    }
  });
}
// const { spawn } = require('child_process');

// Function to terminate the process

function Connect() {
  const { exec } = require("child_process");
  const path = require("path");

  // Define the path to protonvpn.exe
  const protonVpnPath = path.join(
    "C:",
    "Program Files (x86)",
    "Proton Technologies",
    "ProtonVPN",
    "protonvpn.exe"
  ); // Adjust this to your actual ProtonVPN installation path

  // Function to run ProtonVPN
  async function runProtonVPN(args) {
    exec(`"${protonVpnPath}" ${args}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ProtonVPN: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    });
  }

  runProtonVPN("connect");
}
function killProtonVPN() {
  const { exec } = require("child_process");
  exec(
    "C:\\Windows\\System32\\taskkill.exe /F /IM ProtonVPN.exe",
    (error, stdout, stderr) => {
      // Handle as shown previously
    }
  );
}
const restartProtonVPN = () => {
  // Stop the ProtonVPN service
  const { exec } = require("child_process");
  exec('net stop "ProtonVPN Service"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping ProtonVPN: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output while stopping: ${stderr}`);
      return;
    }
    console.log("ProtonVPN service stopped.");

    // Start the ProtonVPN service again
    exec('net start "ProtonVPN Service"', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting ProtonVPN: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output while starting: ${stderr}`);
        return;
      }
      console.log("ProtonVPN service restarted successfully.");
    });
  });
};

async function Reconnect() {
  // killProcessByName("ProtonVPN.exe");
  // terminateProtonVPN();
  console.log("Reconnecting....");
  await restartProtonVPN();
  await killProtonVPN();
  // delay(2000);
  // await Connect();
}
let browser;
let countFailed = 0;
const startScript = async () => {
  while (true) {
    browser = await pt.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
        "--start-maximized",
        "--disable-infobars",
        "--disable-features=site-per-process",
        "--disable-web-security",
        "--disable-blink-features=AutomationControlled",
        "--disable-extensions",
        "--mute-audio",
        "--no-first-run",
        "--no-default-browser-check",
        "--no-zygote",
        "--autoplay-policy=user-gesture-required",
        "--use-gl=swiftshader",
      ],
      defaultViewport: null,
      ignoreHTTPSErrors: true,
    });

    try {
      const start = performance.now();
      const [page] = await browser.pages();

      // await page.authenticate({
      //   username: PROXY_USERNAME,
      //   password: PROXY_PASSWORD,
      // });

      const userAgent = new UserAgent();
      await page.setUserAgent(userAgent.toString());
      await page.setViewport({ width: 1366, height: 768 });
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
      });

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", {
          get: () => false,
        });
      });

      // const {country_name} = await getLocationByIP();
      // const fakerator = await Fakerator(languages);
      const firstName = await convertToEnUS(faker.person.firstName("male"));
      const lastName = await convertToEnUS(faker.person.lastName("male"));
      const emailAddress = `${firstName}${lastName}${randomNumber()}${getRandomEmail()}`;
      // country = fakerator.locale._meta.country;
      // console.log('Your country is '+country_name);
      // if(!isCountryBlocked(country_name)){
      //   await sendSlackMessage(country_name + " is blocked country.");
      //   await Reconnect();
      //   await delay(4000);
      // }
      // emailAddress =await fakerator.internet.email(firstName, lastName);
      if (isProcessRunning("ProtonVPN.exe")) {
        console.log("------------------------");
      } else {
        updateStatus(`${formatDateTime()} ${emailAddress}`);
        updateStatus("Preparing upwork signup page...");
        await retry(() =>
          page.goto("https://www.upwork.com/nx/signup/?dest=home", {
            waitUntil: "domcontentloaded",
          })
        );
        await delay(2000);
        await retry(() =>
          page.goto("https://www.upwork.com/nx/signup/?dest=home", {
            waitUntil: "domcontentloaded",
          })
        );
        const signup_result = await signup(
          page,
          firstName,
          lastName,
          emailAddress
        );
        if (!signup_result) {
          countFailed++;
          if (countFailed >= 7) {
            // Restart Proton VPN automatically
            await Reconnect();
            countFailed = 0;
            await delay(10000);
          }
          updateStatus("Authentication failed");
          throw new Error("Authentication failed");
        }
        // await delay(2000);
        // const verify_link = await readMail(page, emailAddress);
        // await retry(() =>
        //   page.goto(verify_link, { waitUntil: "domcontentloaded" })
        // );

        // await delay(5000);
        const hasConnect = await checkConnect(page, emailAddress);

        if (hasConnect && countFailed > 0) countFailed -= 2;
        else if (!hasConnect && countFailed > 0) countFailed -= 1;

        updateStatus(
          `${formatDateTime()} ${emailAddress} => ${
            (performance.now() - start) / 1000
          }s : ${
            hasConnect ? chalk.bgGreen(hasConnect) : chalk.bgRed(hasConnect)
          }`
        );
        console.log("");
        console.log(`Current heart is ${countFailed}`);
        const delay_time = 5000 + Math.random() * 5000;
        updateStatus(
          `Waiting for next creating account: ${delay_time / 1000}s\n`
        );
      }
      await delay(delay_time);
    } catch (error) {
      updateStatus(`Error occurred: ${error.message}\n`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
};

const retry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      updateStatus(`Retry ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      await delay(5000);
    }
  }
};

// Handle termination signals to close the browser
const handleExit = async (signal) => {
  updateStatus(`Received ${signal}. Closing browser...`);
  if (browser) {
    await browser.close();
  }
  process.exit(0);
};

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

startScript();
