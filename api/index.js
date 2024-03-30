const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const bcrypt = require('bcryptjs');
const app = express();
const port = 4000;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs'); // fs : file system

const salt = bcrypt.genSaltSync(10);
const secret = 'vbwHV873GFB1cvaeve';

app.use(cors({
  credentials: true, 
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads')); //Giúp hiển thị trên browser. Ví dụ: http://localhost:4000/uploads/1f98e8ae3846cb936790ce2fff4d7d30.png


//connect mongoose database after creating User.js on models api
mongoose.connect('mongodb+srv://nguyentuanhung4529871036:nguyentuanhung123@blogappmern.mpyl34q.mongodb.net/')

app.get('/test', (req, res) => {
  res.json('Test OK 2!')
})

app.post('/register', async (req, res) => {
  const {username, password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  }catch(e){
    console.log(e);
    res.status(400).json(e);
  }
})

app.post('/login', async (req, res) => {
  const {username, password} = req.body; 
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if(passOk){
    //logged in (npm i jsonwebtoken)
    jwt.sign({username: userDoc.username, id: userDoc._id}, secret, {}, (err, token) => {
      if(err) throw err;
      //res.cookie('token', token).json('ok');
      res.cookie('token', token).json({
        id: userDoc._id,
        username: userDoc.username
      });
    });
    //res.json()
  }else{
    res.status(400).json('wrong credentials')
  }
})

// ta đang vẫn đang lưu giữ token ở browser khi ta đã đăng nhập và refresh browser
// tải thêm cookie-parser
// Lần đầu đăng nhập sẽ chỉ có Set-Cookie ở response , nhưng ở từ lần thứ 2 trở đi sẽ có request cookie
// Ở lần đầu khi đăng nhập và chuyển trang đến IndexPage thì không có request Cookie nên ở Header không có username
// Khi ta refresh nó mới gửi mới có cookie ở request nên Header mới có username
app.get('/profile', async (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if(err) throw err;
    res.json(info);
  })
  //res.json(req.cookies);
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok'); // Nó sẽ xoá token cả ở reponse lẫn Cookie trong Application (dù ở request vẫn còn)
})

// do khi bấm createNewPost thì file ở Form Data trong Payload đang có dạng nhị phân nên ta phải gửi ảnh đang có vào thư mục uploads đã tạo ở api 
// Giải pháp : dùng multer
// do ta đang để trong Data gửi lên là file nên để trong single là file (nếu để tên khác và avatar thì đổi lên thành avatar) 
// Sau khi bấm createNewPost thì tên các file rất lạ -> Ta phải đổi tên chúng
app.post('/posts', uploadMiddleware.single('file'), async (req, res) => {
  const {originalname, path} = req.file;
  const parts = originalname.split('.'); // tạo 1 mảng có n phần tử trong originalname
  const ext = parts[parts.length - 1]; // png hoặc webb
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath); // file được gửi vào thư mục uploads sẽ có dạng png (các file trước dù được gửi nhưng không có dạng png hoặc webb)
  //res.json(req.file); // // trả về 1 object (có các attribute : filename, destination: "uploads/", originalname: "Screenshot (10).png", path: "uploads\\1621a2c1a9f30a92b901391f70627713", ...)
  //res.json({files:req.file}); // trả về 1 object có tên là files (có các attribute : filename, destination: "uploads/", originalname: "Screenshot (10).png", path: "uploads\\1621a2c1a9f30a92b901391f70627713", ...)

  const {token} = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if(err) throw err;
      const {title, summary, content} = req.body; // Xem ở Payload
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id
      })
    res.json(postDoc);
  })
  //res.json(ext);// trả về 1 string : png

  // const {title, summary, content} = req.body; // Xem ở Payload
  // const postDoc = await Post.create({
  //   title,
  //   summary,
  //   content,
  //   cover: newPath
  // })
  //res.json({ext});// trả về 1 object có 1 attribute là ext : png (Xem ở Preview)
  //res.json({title, summary, content});// trả về 1 object có các attribute là title: ... , summary: ..., content: ... (Xem ở Preview)
  //res.json(postDoc); //trả về 1 object có các attribute là title, createdAt, updatedAt, ...
});

app.get('/posts', async (req, res) => {
  //const posts = await Post.find();
  //const posts = await Post.find().populate('author'); //Kết nối và xem tất cả thông tin của author bao gồm password, username, id
  const posts = await Post.find()
              .populate('author', ['username']) // chỉ trả về id và username
              .sort({createAt: -1}) // cái nào mới nhất sẽ được để lên đầu
              .limit(20) // chỉ hiện 20 cái Post mới nhất
  res.json(posts);
});

app.get('/posts/:id', async (req, res) => {
  const {id} = req.params; // req.params là 1 object chỉ chứa 1 attribute là id : '....' 
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.put('/posts', uploadMiddleware.single('file'), async (req, res) => {
  //res.json(req.file);
  let newPath = null;
  if(req.file){
    const {originalname, path} = req.file;
    const parts = originalname.split('.'); // tạo 1 mảng có n phần tử trong originalname
    const ext = parts[parts.length - 1]; // png hoặc webb
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath); // file được gửi vào thư mục uploads sẽ có dạng png (các file trước dù được gửi nhưng không có dạng png hoặc webb)
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if(err) throw err;
    const {id, title, summary, content} = req.body; // Xem ở Payload
      const postDoc = await Post.findById(id);
      // do author là ObjectId nên ta phảu dùng JSON.stringify để có sụe so sánh tốt hơn
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if(!isAuthor){
        return res.status(400).json('you are not the author');
        // throw 'you are not the author';
      }
      await Post.findByIdAndUpdate(id, {
        title, 
        summary, 
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
      //res.json({isAuthor, postDoc, info})
      res.json(postDoc);
  })
})

//nguyentuanhung123
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})