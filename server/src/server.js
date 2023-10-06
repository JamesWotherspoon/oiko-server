require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 4000;

// Start server listening on port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
