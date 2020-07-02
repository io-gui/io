import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5500/#path=tests');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();