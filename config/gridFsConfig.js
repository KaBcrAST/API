const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const mongoUri = 'mongodb://cosmosdb-mongo-prd:I475BTouZc9EF8LkkiJlKWFTqa0iEqQvuSfh4BqAJLnD0CVXrOxcHrarPY38dKL0bxKJoTB2k8DIACDby2hYhw==@cosmosdb-mongo-prd.mongo.cosmos.azure.com:10255/media_db?ssl=true&retrywrites=false';

const conn = mongoose.createConnection(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: mongoUri,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

module.exports = { gfs, upload };