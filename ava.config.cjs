module.exports = {
  ignoredByWatcher: [
    '*/.env', // Prevents the `ava` test watcher from going into infinite loop (since it's generating .env file during test)
  ],
};
