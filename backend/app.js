const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());

app.post('/api/posts', (request, response) => {
  const post = request.body;

  console.log(post);
  response.status(201).json();
});

app.get('/api/posts', (request, response) => {
  const posts = [
    {
      id: 'khdfklahsdla',
      title: 'tincidunt dui ut ornare lectus',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In nibh mauris cursus mattis molestie. Mi sit amet mauris commodo quis imperdiet massa. Id aliquet risus feugiat in. Malesuada fames ac turpis egestas.',
    },
    {
      id: 'sesdfsdfda',
      title: 'vitae congue eu consequat ac',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et netus et malesuada fames ac turpis egestas sed. Justo nec ultrices dui sapien. Sapien pellentesque habitant morbi tristique. Porttitor leo a diam sollicitudin tempor.',
    },
    {
      id: 'ffsbgsfgsd',
      title: 'euismod in pellentesque massa placerat',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitant morbi tristique senectus et. Sed velit dignissim sodales ut eu sem. Vel fringilla est ullamcorper eget. Urna duis convallis convallis tellus id.',
    },
    {
      id: 'awehdfbd',
      title: 'blandit massa enim nec dui',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida rutrum quisque non tellus orci ac. Id donec ultrices tincidunt arcu non sodales. Interdum velit laoreet id donec ultrices. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.',
    },
    {
      id: 'dfgsdges',
      title: 'faucibus purus in massa tempor',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A diam sollicitudin tempor id eu nisl nunc mi. Odio aenean sed adipiscing diam donec. Neque laoreet suspendisse interdum consectetur. Magna fermentum iaculis eu non diam phasellus.',
    },
  ];
  response.status(200).json({
    posts: posts,
  });
});

module.exports = app;
