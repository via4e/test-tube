const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8989;

const VIDEO_DIR = path.join(__dirname, 'video');

http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.slice(1);

  if (urlPath === '') return handleHelp(req, res);
  if (urlPath === 'video') return handleVideoList(req, res);
  if (urlPath.startsWith('video/') && urlPath.toLowerCase().endsWith('.mp4')) return handleVideoFile(req, res);

  res.writeHead(404);
  res.end('Not found');
}).listen(port, () => console.log('Server: http://localhost:', port));

function handleHelp(req, res) {
  res.writeHead(200, { 'Content-type': 'text/plain' })
  res.end('Available endoints:\r\n /video - list \r\n /video/filename.mp4 - get video filename.mp4')
}

function handleVideoList(req, res) {
  fs.readdir(VIDEO_DIR, (err, files) => {
    if (err) {
      res.writeHead(500);
      return res.end('Server error');
    }

    console.log(files);

    const videos = files.filter(name => name.toLowerCase().endsWith('.mp4'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(
      {
        files: videos,
        count: videos.length
      }
    ));
  });
}

function handleVideoFile(req, res) {
  const filename = req.url.slice(6);
  const filePath = path.join(VIDEO_DIR, filename);

  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes'
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => {
    res.writeHead(404);
    res.end('File not found');
  });
}
