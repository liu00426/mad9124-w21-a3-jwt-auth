"use strict";
// load dependencies
const express = require("express");
const Student = require('./models/student');
const User = require('./models/user');
const Course = require('./models/course');
const Authentication = require('./models/authentication');
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'llamallamaduck';
// create the express app
const app = express();

// configure express middleware
app.use(express.json());

const authed = fn => async (req, res) => {
  try {
    const authorization = req.header('Authorization')
    const token = authorization.replace('Bearer ', '');
    const { email,isAdmin,firstName } = jwt.verify(token, JWT_SECRET);
    if (!email || !isAdmin) {
      throw 'Invalid Token';
    }
    const newLog = {
      username:firstName,
      ipAddress:req.connection.remoteAddress,
      didSucceed:true,
      createdAt:new Date()
    }
    Authentication.save(newLog)
    await fn(req, res, email);
  } catch {
    throw 'Invalid token';
  }
};

app.post('/auth/register',  (req, res) => {
  const { email, password, isAdmin,firstName,lastName } = req.body;
  User.find({name: name}, (err, data)=> {
    if (data.length > 0) {
      res.send('The user name is already registered');
    } else {
      User({ email, password, isAdmin,firstName,lastName }).save();
      const token = jwt.sign({email,isAdmin,firstName}, JWT_SECRET, {algorithm: 'HS256',});
      res.send(token);
    }
  })
});

app.post('/auth/login', (req, res) => {
  const { email, password,firstName } = req.body;
  User.find({email}, (err, data)=> {
    if (data && password === data.password) {
      const token = jwt.sign({ email,isAdmin:data.isAdmin,firstName }, JWT_SECRET, { algorithm: 'HS256', });
      return res.json({ token, });
    }else {
      res.send('Invalid username or password');
    }
  })
});


/***************************************************************
 student
 ***************************************************************/
app.get("/api/student", authed((req, res) => {
  Student.find({}, (err, data)=> {
    res.send({data})
  })
}));

app.get("/api/student/:studentId",authed((req, res) => {
  Student.find({_id:req.params.studentId}, (err, data)=> {
    res.send({data})
  })
}));

app.post("/api/student", authed((req, res) => {
  const { firstName, lastName, nickName, email} = req.body;
  const newStudent = {
    firstName,
    lastName,
    nickName,
    email
  };
  Student.save(newStudent)
  res.status(201).send({ data: newStudent });
}));

app.patch("/api/student/:studentId", authed((req, res) => {
  Student.find({_id:req.params.studentId}, (err, data)=> {
    if(data.length === 0){
      res.status(404).send({
        errors: [
          {
            status: "404",
            title: "Resource does not exist",
            description: `We could not find a student with id: ${id}`,
          },
        ],
      });
    }else {
      const { id, ...theRest } = req.body;
      Student.findByIdAndUpdate(req.params.studentId, theRest,(err1,data1)=>{
        res.send({ data1 });
      })
    }
  })
}));

app.put("/api/student/:studentId", authed((req, res) => {
  Student.find({_id:req.params.studentId}, (err, data)=> {
    if(data.length === 0){
      res.status(404).send({
        errors: [
          {
            status: "404",
            title: "Resource does not exist",
            description: `We could not find a student with id: ${id}`,
          },
        ],
      });
    }else {
      const { firstName, lastName, nickName, email}  = req.body;
      const updatedStudent = { firstName, lastName, nickName, email} ;
      Student.findByIdAndUpdate(req.params.studentId,updatedStudent,(err1,ret)=>{
        res.send({ data:ret });
      })
    }
  })
}));

app.delete('/api/student/:studentId', authed((req, res) => {
  Student.find({_id:req.params.studentId}, (err, data)=> {
    if(data.length === 0){
      res.status(404).send({
        errors: [
          {
            status: "404",
            title: "Resource does not exist",
            description: `We could not find a student with id: ${id}`,
          },
        ],
      });
    }else {
      Student.findOneAndRemove(req.params.studentId,(err,data)=>{
        res.send({ data });
      })
    }
  })
}))

/***************************************************************
 course
 ***************************************************************/
app.get("/api/course", authed((req, res) => {
  Course.find({}, (err, data)=> {
    res.send({data})
  })
}));

app.get("/api/course/:courseId", authed((req, res) => {
  Course.find({_id:req.params.courseId}, (err, data)=> {
    res.send({data})
  })
}));

app.post("/api/course", authed((req, res) => {
  const { code, title, description, url,students} = req.body;
  const newCourse = {
    code,
    title,
    description,
    url,
    students
  };
  Student.save(newCourse)
  res.status(201).send({ data: newCourse });
}));

app.patch("/api/course/:courseId", authed((req, res) => {
  Course.find({_id:req.params.courseId}, (err, data)=> {
    if(data.length === 0){
      res.status(404).send({
        errors: [
          {
            status: "404",
            title: "Resource does not exist",
            description: `We could not find a student with id: ${id}`,
          },
        ],
      });
    }else {
      const { id, ...theRest } = req.body;
      Course.findByIdAndUpdate(req.params.courseId,theRest,(err1,ret)=> {
        res.send({ data:ret });
      })
    }
  })
}));

app.put("/api/course/:courseId", authed((req, res) => {
  Course.find({_id:req.params.courseId}, (err, data)=> {
    if(data.length === 0){
      res.status(404).send({
        errors: [
          {
            status: "404",
            title: "Resource does not exist",
            description: `We could not find a student with id: ${id}`,
          },
        ],
      });
    }else {
      const { firstName, lastName, nickName, email}  = req.body;
      const updatedStudent = { firstName, lastName, nickName, email} ;
      Course.findByIdAndUpdate(req.params.courseId,updatedStudent,(err1,ret)=>{
        res.send({ data:ret });
      })
    }
  })
}));

app.delete('/api/course/:courseId', authed((req, res) => {
  Course.find({_id:req.params.courseId}, (err, data)=> {
    if(data.length === 0){
      res.status(404).send({
        errors: [
          {
            status: "404",
            title: "Resource does not exist",
            description: `We could not find a student with id: ${id}`,
          },
        ],
      });
    }else {
      Course.findOneAndRemove(req.params.courseId,(err1,ret)=>{
        res.send({ data:ret });
      })
    }
  })
}))


// start listening for HTTP requests
const port = process.env.port || 3030;
app.listen(port, () => console.log(`Server listening on port ${port} ...`));
