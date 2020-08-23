/**
 * ROBOTJS (NODEJS)
 * http://robotjs.io/
 * http://robotjs.io/docs/syntax
 * 
 * Simulación de petición de cita previa en extranjería.
 * URL inicio petición: 
 *  https://sede.administracionespublicas.gob.es/icpplustiem/icpplus#wrap
 * 
 * Se realiza en dos partes, ya que contiene un reCAPTCHA.
 * El script se pausa en el reCaptcha para marcarlo de forma manual.
 * 
 * https://stackoverflow.com/questions/19687407/press-any-key-to-continue-in-nodejs
 */

// Move the mouse across the screen as a sine wave.
var robot = require("robotjs");
var sleep = require('sleep');
var fs = require("fs");

// Speed up the mouse.
robot.setMouseDelay(250);
robot.setKeyboardDelay(550);

let size = robot.getScreenSize();
console.log("Pantalla: ");
console.log(size);

let pausa = 500;

function ahora(txt) {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  
  // current year
  let year = date_ob.getFullYear();
  
  // current hours
  let hours = date_ob.getHours();
  
  // current minutes
  let minutes = date_ob.getMinutes();
  
  // current seconds
  let seconds = date_ob.getSeconds();
  
  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);
  
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  let ahora = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  let log = ahora + ": " + txt;
  console.log(log);
  return log;
}

function append(text) {
  fs.appendFile('log.txt', text + '\r\n', function (err) {
    if (err) throw err;
  });
}

function continuar() {
  console.log('Press any key to continue.');
  var fd = fs.openSync("/dev/stdin", "rs");
  fs.readSync(fd, Buffer.alloc(1), 0, 1);
  fs.closeSync(fd);
}

function getDatosSolicitud() {
  // Abrir página
  // Move the mouse to x 20, y 90 on the screen.
  // robot.keyTap('pageup');
  // robot.moveMouse(20, 90);
  // robot.mouseClick();
  // robot.keyTap('r', ['control', 'shift']);
  
  // Seleccionar Madrid
  robot.moveMouse(300, 470);
  robot.mouseClick();
  robot.keyTap('m');
  robot.keyTap('enter');
  robot.keyTap('tab');
  robot.keyTap('enter');

  // Aceptar primera pantalla
  // robot.moveMouse(100, 510);
  // robot.mouseClick();

   // Selección del trámite
  // Al entrar, ya toma el desplegable resaltado: usamos combinaciones de teclas
  // Desplegable de trámites
  robot.keyTap('space');
  robot.keyTap('pagedown');
  robot.keyTap('enter');
  // Botón Aceptar
  robot.keyTap('tab');
  robot.keyTap('enter');

  console.log('esperamos ' + (pausa/1000) + ' segundos..');
  sleep.msleep(pausa); // Cambio de página
}

function getDatosSolicitante() { 
  
  // SEGUNDA PANTALLA: Resumen trámite
  // buscamos el botón entrar, abajo
  // Accedemos con tabs inversos porque está muy abajo
  robot.keyTap('pagedown');
  robot.moveMouse(100, 1350);
  robot.mouseClick();
  console.log('esperamos ' + (pausa/1000) + ' segundos..');
  sleep.msleep(pausa); // Cambio de página

  // CUARTA PANTALLA - FINAL PASO 1
  // Hacemos clicks en los autorellenos del pasaporte y nombre, es más rápido.
  robot.moveMouse(400, 495);
  robot.mouseClick();
  robot.moveMouse(320, 550);
  robot.mouseClick();
  robot.moveMouse(320, 600);
  robot.mouseClick();
  robot.moveMouse(320, 880);
  robot.mouseClick();
  robot.moveMouse(320, 920);
  robot.mouseClick();
  
  // robot.typeString('pasaporte');
  // robot.keyTap('tab');
  // robot.typeString('nombre');
  // robot.keyTap('tab');
  // robot.keyTap('space');
  // robot.keyTap('tab');

  // Apuntamos el captcha
  robot.moveMouse(280, 1120);
  console.log('captcha');
}

function iniciarSolicitud() {
  console.log('2.- Iniciar solicitud. Después aceptar el Captcha.');
  robot.moveMouse(80, 550);
  robot.mouseClick();

  // var img = robot.screen.capture(0, 230, 500, 300);
  var x = 105;
  var y = 565;
  robot.moveMouse(x, y);
  var punto =  robot.getPixelColor(x, y);
  console.log(punto);

  if (punto === '0091aa') {
    append(ahora('En este momento no hay citas disponibles: ' + punto)); // LOG
    robot.moveMouse(105, 660);
    robot.mouseClick();
  } else {
    append(ahora('HAY Oficinas: ' + punto)); // LOG
  }
}

// INICIO
//============================================
console.log('1.- Obtener datos para la solicitud. Antes del Captcha.');
getDatosSolicitud(); // Antes del Captcha
getDatosSolicitante();
continuar();
iniciarSolicitud(); // Después del Captcha

console.log('The End');

// var twoPI = Math.PI * 2.0;
// var screenSize = robot.getScreenSize();
// var height = (screenSize.height / 2) - 10;
// var width = screenSize.width;

// for (var x = 0; x < width; x++) {
//   y = height * Math.sin((twoPI * x) / width) + height;
//   robot.moveMouse(x, y);
// }
