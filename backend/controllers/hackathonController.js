// controllers/hackathonController.js
import puppeteer from "puppeteer";

// Simple sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const scrapeHackathons = async (req, res) => {
  try {
    console.log("🌐 Launching Puppeteer...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto("https://devfolio.co/hackathons/open", {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    // Scroll 4 times to load more hackathons
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      // Wait a bit for new cards to load
      await sleep(1500); // <-- replaced page.waitForTimeout
    }

    // ✅ Wait for hackathon cards
    await page.waitForSelector(".CompactHackathonCard__StyledCard-sc-174a161-0");

    // ✅ Extract data
    const hackathons = await page.$$eval(
      ".CompactHackathonCard__StyledCard-sc-174a161-0",
      (cards) =>
        cards.map((card) => {
          const title = card.querySelector("h3")?.innerText.trim() || "N/A";
          const link = card.querySelector("a")?.href || "N/A";

          // Theme tags
          const themes = Array.from(card.querySelectorAll(".krulKR")).map((el) =>
            el.innerText.trim()
          );

          // Status info (Online/Offline, Open, Start date, etc.)
          const status = Array.from(card.querySelectorAll(".cqgLqK")).map((el) =>
            el.innerText.trim()
          );

          return { title, link, themes, status };
        })
    );

    await browser.close();

    console.log("✅ Scraped", hackathons.length, "hackathons");
    return res.json(hackathons);
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    return res.status(500).json({ message: "Failed to scrape hackathons" });
  }
};