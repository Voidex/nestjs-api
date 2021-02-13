db.createUser({
  user: "testuser",
  pwd: "111111",
  roles: [
    {
      role: "readWrite",
      db: "test"
    }
  ]
});