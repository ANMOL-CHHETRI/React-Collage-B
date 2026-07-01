import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (msg) => console.log('CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', (err) => console.log('PAGEERROR:', err));
await page.goto('http://127.0.0.1:5173/');
await page.waitForLoadState('networkidle');
console.log('PAGE TITLE:', await page.title());
console.log('URL:', page.url());
console.log('ROOT HTML:', await page.$eval('#root', (el) => el.innerHTML));
const bodyText = await page.textContent('body');
console.log('BODY TEXT LENGTH:', bodyText?.length);
console.log('BODY TEXT:', bodyText?.slice(0, 1000));
console.log('LINKS:', JSON.stringify(await page.$$eval('a', (nodes) => nodes.map((n) => ({ text: n.textContent?.trim(), href: n.getAttribute('href') }))), null, 2));
console.log('BUTTONS:', JSON.stringify(await page.$$eval('button', (nodes) => nodes.map((n) => ({ text: n.textContent?.trim(), type: n.getAttribute('type') }))), null, 2));
await browser.close();
