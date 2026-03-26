import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Dynamically finds Chrome path in Render
 */
const getChromePath = () => {
  try {
    const base = "/opt/render/.cache/puppeteer/chrome";

    if (!fs.existsSync(base)) {
      console.error("Chrome base path does not exist");
      return null;
    }

    const dirs = fs.readdirSync(base);
    const chromeDir = dirs.find((d) => d.includes("linux"));

    if (!chromeDir) {
      console.error("No Chrome directory found");
      return null;
    }

    const fullPath = path.join(base, chromeDir, "chrome-linux64", "chrome");

    console.log("✅ Chrome path:", fullPath);
    return fullPath;
  } catch (err) {
    console.error("Error finding Chrome path:", err);
    return null;
  }
};

export const getInternships = async (req, res) => {
  const { skill } = req.query;
  let browser;

  try {
    const chromePath = getChromePath();

    browser = await puppeteer.launch({
      headless: "new",
      executablePath: chromePath || undefined, // fallback if null
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );

    await page.setViewport({ width: 1366, height: 768 });

    let url = "https://internshala.com/internships/";
    if (skill) {
      url = `https://internshala.com/internships/keywords-${encodeURIComponent(
        skill
      )}/`;
    }

    console.log("🌐 Scraping URL:", url);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForSelector(".individual_internship", {
      timeout: 20000,
    });

    // Scroll to load more
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await sleep(800);
    }

    const internships = await page.evaluate(() => {
      const cards = Array.from(
        document.querySelectorAll(".individual_internship")
      );

      return cards
        .map((card) => {
          const titleEl = card.querySelector(".job-internship-name a");
          const companyEl = card.querySelector(".company-name");
          const locationEl = card.querySelector(".locations a");
          const stipendEl = card.querySelector(".stipend");
          const durationEl = card.querySelector(
            ".row-1-item:nth-child(3) span"
          );
          const postedEl = card.querySelector(".status-success span");

          return {
            title: titleEl?.innerText.trim() || "",
            company: companyEl?.innerText.trim() || "",
            location: locationEl?.innerText.trim() || "",
            stipend: stipendEl?.innerText.trim() || "",
            duration: durationEl?.innerText.trim() || "",
            posted: postedEl?.innerText.trim() || "",
            link: titleEl
              ? "https://internshala.com" +
                titleEl.getAttribute("href")
              : "",
          };
        })
        .filter(
          (i) =>
            i.title ||
            i.company ||
            i.location ||
            i.stipend ||
            i.duration ||
            i.posted ||
            i.link
        );
    });

    return res.json({ internships });
  } catch (error) {
    console.error("❌ Internship scraping error:", error);
    return res
      .status(500)
      .json({ internships: [], error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};