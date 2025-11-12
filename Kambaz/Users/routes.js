import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    console.log("Signup - Session ID:", req.sessionID);
    console.log("Signup - User saved to session:", currentUser._id);
    res.json(currentUser);
  };

const signin = (req, res) => {
  const { username, password } = req.body;
  console.log("Signin attempt - Username:", username, "Password:", password);
  console.log("Total users in database:", dao.findAllUsers().length);
  console.log("All users:", JSON.stringify(dao.findAllUsers(), null, 2));
  
  const currentUser = dao.findUserByCredentials(username, password);
  if (currentUser) {
    req.session["currentUser"] = currentUser;
    console.log("Signin successful - User ID:", currentUser._id);
    res.json(currentUser);
  } else {
    console.log("Signin failed - Invalid credentials");
    res.status(401).json({ message: "Unable to login. Try again later." });
  }
};

  const signout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Could not sign out" });
      } else {
        res.sendStatus(200);
      }
    });
  };

  const profile = (req, res) => {
    console.log("Profile - Session ID:", req.sessionID);
    console.log("Profile - Full session:", req.session);
    console.log("Profile - Cookies:", req.headers.cookie);
    console.log("Profile - Request origin:", req.headers.origin);
    
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      console.log("Profile - No user in session, returning 401");
      res.sendStatus(401);
      return;
    }
    console.log("Profile - Found user:", currentUser._id);
    res.json(currentUser);
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    const updatedUser = dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = updatedUser;
    }
    res.json(updatedUser);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const user = dao.findUserById(req.params.userId);
    res.json(user);
  };

  const deleteUser = (req, res) => {
    dao.deleteUser(req.params.userId);
    res.sendStatus(200);
  };

  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}