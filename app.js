const express = require('express');
const app = express();


//para poder obtener la informacion de form y manejarla
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usuarios = [
    { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
    { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
    { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
    { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
    { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];

app.get('/', (req, res) => {
  //Con el map recorroa cada una de las partes del array, genero el li y join para separarlo sin coma.
  //<a href="/usuarios">usuarios json</a> link al json generado en /usuarios
  res.send(`
  <h1>Lista de Usuarios</h1>
  <ul>
  ${usuarios
    .map((usuario) => `<li>ID: ${usuario.id}, Nombre: ${usuario.nombre}, Edad: ${usuario.edad}, Nombre: ${usuario.lugarProcedencia} </li>`)
    .join('')}
    </ul>
    `);  
  });

  // todo esto se haría si no utilizara postman para introducir datos simulando el front pero ahora introduzco datos para (post delete put etc) desde postman

  /*<form action="/usuarios" method="post">
  <label for="nombre">Nombre</label>
  <input type="text" id="nombre" name="nombre" required>
  <label for="edad">Edad</label>
  <input type="text" id="edad" name="edad" required>
  <label for="lugarProcedencia">Lugar de procedencia</label>
  <input type="text" id="lugarProcedencia" name="lugarProcedencia" required>
  <button type="submit">Agregar usuario</button>
  </form>
  <a href="/usuarios">usuarios json</a>
  `); 
}); */

//creo el json en usuarios del array usuarios + los campos introducidos
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

//para incluir nuevos usuarios al array
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre,
    edad: req.body.edad,
    lugarProcedencia: req.body.lugarProcedencia,
     //requiero del cuerpo del post los .valores
  };
  usuarios.push(nuevoUsuario);
  res.redirect('/'); 
  //al  terminar me redirige a /
});

//buscar un usuario mediante http://localhost:3000/usuarios/usuario/
app.get('/usuarios/:nombre', (req, res) => {
    const usuario = usuarios.find(usuario => usuario.nombre.toLowerCase() === req.params.nombre.toLowerCase());
    if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
});

//Actualizar un usuario por nombre
app.put('/usuarios/:nombre', (req, res) => {
  const index = usuarios.findIndex(usuario => usuario.nombre.toLowerCase() === req.params.nombre.toLowerCase());   //Find index devuelve el index si existe o -1 si no existe por eso valido -1 en el if
  if (index !== -1) {    
    usuarios[index] = { ...usuarios[index], ...req.body };                                                         //me traigo el usuario[index] y le cambio los datos requeridos en req.body
    res.json(usuarios);
  }
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
  });


 //Eliminar un usuario                    
app.delete('/usuarios/:nombre', (req, res) => {                                                                     //elimina el usuario pasado como :nombre
  usuarios = usuarios.filter(usuario => usuario.nombre.toLowerCase() !== req.params.nombre.toLowerCase());          //devuelvo a la lista usuarios todos menos el que voy a eliminar
    res.json({ 
      mensaje: 'Usuario eliminado correctamente',
      usuarios: usuarios
     }); 
});  

app.listen(3000, () => {
  console.log('Express esta escuchando en el puerto http://localhost:3000');
});
