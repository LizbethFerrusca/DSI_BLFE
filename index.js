
const db = require("./config/database")
const express = require ("express");
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
//app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res, next) => {
    res.render("index");
});

app.get("/pokemon", async (req, res, next) => {
    
    const pokemon = await db.query("SELECT * FROM pokemon;");
    console.log(pokemon);
    res.json(pokemon);
  });

app.get("/pokedex/:pok_id", async (req, res, next) => {
   const {pok_id} = req.params;
   let query = await db.query(`SELECT * FROM pokemon WHERE pok_id = '${pok_id}';`);
   console.log(query);
   res.json(query);
});

app.get("/pokedex/name/:pok_name", async (req, res, next) => {
  const {pok_name} = req.params;
  let query = await db.query(`SELECT * FROM pokemon WHERE pok_name = '${pok_name}';`);
  console.log(query);
  res.json(query);
});

app.get("/pokedex/ID/random", async (req, res, next) => {
  const id = Math.floor(Math.random() * 722)+ 1;
  let query = await db.query(`SELECT * FROM POKEMON WHERE POK_ID = '${id}';`);
  res.json(query);
});

app.post("/pokemon", (req, res, next) =>{
    console.log(req.body);
    res.json(req.body);
});

app.get("/users", async (req, res, next) =>{
    let query = await db.query(`SELECT id, name, last_name, mail, phone_number FROM users;`);
    console.log(query);
    res.json(query);
});

app.get("/users/:id", async (req, res, next) =>{
  const {id} = req.params;
  let query = await db.query(`SELECT * FROM users WHERE id = '${id}';`);
  console.log(query);  console.log(query);
  res.json(query);
});

app.put("/users/update", async (req, res, next) =>{
  const {id, name, last_name, mail, phone_number, password} = req.body;
    let query = await db.query(`UPDATE users SET name = '${name}', last_name = '${last_name}', mail= '${mail}', phone_number = '${phone_number}', password = '${password}' WHERE id = ${id}; `);
    res.json("Usuario actualizado");
});

app.post("/user", async (req, res) => {
    // const name = req.body.name;
    // const last_name = req.body.last_name;
    // const mail = req.body.mail;
    // const phone_number = req.body.phone_number;
    // const password = req.body.password;
    const {name, last_name, mail, phone_number, password} = req.body;
    let query = "INSERT INTO users (name, last_name, mail, phone_number, password)";
    query += `VALUES ('${name}', '${last_name}', '${mail}', '${phone_number}', '${password}');`;
    try {
      const rows = await db.query(query);
      console.log(rows);
      res.json("Usuario registrado");
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.json("Correo ya registrado");
        console.log("Error de registro:", error); 
      }
    }
  });
  
  
  app.post("/login", async (req, res) => {
    const {mail, password} = req.body;
    let query = `SELECT * FROM users WHERE mail = '${mail}' AND password = '${password}';`;
    try {
      const rows = await db.query(query);
      console.log(rows);
      if (rows.length === 1) {
        res.json("Acceso concedido");
      } else 
      {
        res.json("Correo o Contraseña incorrectos");
      }
    } catch (error) 
    {
      console.log("Error:", error);
    }	
  });


app.listen (3000, () =>{
    console.log("Server is running...");
});