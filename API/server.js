const express = require('express');

const app = express();


// Body parser for API parameters
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});