const prodServer = "https://codenames-server-capstone.herokuapp.com/";
const devServer = "http://127.0.0.1:3000";

module.exports = {
  server: process.env.NODE_ENV === "production" ? prodServer : devServer,
};
