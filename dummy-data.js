const mongoose = require('mongoose');
const Post = require('./backend/models/post');
const faker = require('faker');

mongoose
  .connect(
    'mongodb+srv://bberg:X04Wh2ltjsT45RHV@cluster0-qgg9v.mongodb.net/mean-machine?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Successfully connected to DB');
  })
  .catch(() => {
    console.log('There was an error connecting to DB');
  });

[...Array(25)].map(() => {
  const post = new Post({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    imagePath: faker.image.image(),
  });

  post.save();
});
