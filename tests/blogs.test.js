const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating.btn-large.red');
  });

  it('Should see blog create form', async () => {
    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('And using VALID inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    it('Should take user to the review screen', async () => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    it('Should add block to index page when submitting', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('And using INVALID inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    it('Should show an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('When a user is not logged in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'My Title',
        content: 'My Content',
      },
    },
  ];

  it('Should prohibit blog-related actions', async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });

  // it('User cannot create a blog post', async () => {
  //   const result = await page.post('/api/blogs', {
  //     title: 'My Title',
  //     content: 'My Content',
  //   });

  //   expect(result).toEqual({ error: 'You must log in!' });
  // });

  // it('User cannot get a list of posts', async () => {
  //   const result = await page.get('/api/blogs');

  //   expect(result).toEqual({ error: 'You must log in!' });
  // });
});
