const express = require('express');
const svg2img = require('svg2img');
const fs = require('fs');
const multer = require('multer');
const { v4  } = require('uuid');
const path = require('path');


const app = express();
const port = 3000;

// Configuración de Multer para manejar archivos SVG
const storage = multer.memoryStorage();
const upload = multer({ storage });


app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// POST -- svgFile

app.post('/svgToJpg', upload.single('svgFile'), (req, res) => {
  const svgContent = req.file.buffer.toString('utf8'); // Obtén el contenido SVG del archivo subido
  const outputImagePath = `public/carnets/${v4()}.jpg`;

  const options = {
    format: 'jpeg',
    quality: 90,
  };

  const domain = req.get('host');

  svg2img(svgContent, options, (error, buffer) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send('Error al convertir el SVG a imagen');
    }

    fs.writeFileSync(outputImagePath, buffer);

    console.log('Imagen guardada:', outputImagePath);
    return res.status(200).json({ ok: true, data: `${domain}/${outputImagePath}`});
  });
});

app.listen(port, () => {
  console.log(`API escuchando en ${port}`);
});