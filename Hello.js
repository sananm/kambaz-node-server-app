export default function hello(app) {
  const sayHello = (req, res) => {
    res.send("Life is good!");
  };
  const sayWelcome = (req, res) => {
    res.send("Welcome to Full Stack Development!");
  };

  app.get("/hello", sayHello);
  app.get("/welcome", sayWelcome);
}
