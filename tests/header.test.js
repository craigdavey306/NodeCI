const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

it('Should display application name in the header', async () => {
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

it('Should start OAuth flow when Login is clicked', async () => {
  await page.click('.right a');

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

it('Should show the logout button when signed in', async () => {
  await page.login();

  // const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual('Logout');
});
