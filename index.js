const express = require("express");
const SSLCommerzPayment = require("sslcommerz");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
// var messagebird = require('messagebird')('test_gshuPaZoeEG6ovbc8M79w0QyM');


const { v4: uuidv4 } = require("uuid");
const verifyJwt = require("./jwt");
require("dotenv").config();
// middle wares
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//port
const PORT = process.env.PORT || 5000;

//Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tfzr2.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const userCollection = client.db("CSTE").collection("user");
const userRegForm = client.db("CSTE").collection("form");
const addStudent = client.db("CSTE").collection("students");
const addTeacher = client.db("CSTE").collection("Teacher");
const chairmanMsg = client.db("CSTE").collection("ChairmanMsg");
const programmer = client.db("CSTE").collection("Programmer");
const otherExprience = client.db("CSTE").collection("otherExp");
const galaryCollection = client.db("CSTE").collection("Galay");
const materialCollection = client.db("CSTE").collection("Material");
const clubMemberCollection = client.db("CSTE").collection("Club-Members");
const jobCollection = client.db("CSTE").collection("Job");
const curriculumCollection = client.db("CSTE").collection("Curriculum");
const newsCollection = client.db("CSTE").collection("News");
const noticeCollection = client.db("CSTE").collection("Notice");
const onlineFormCollection = client.db("CSTE").collection("OnlineForm");
const examFeeFormCollection = client.db("CSTE").collection("Exam-Fee");
const studentNoticeCollection = client.db("CSTE").collection("Student-Notice");
const officialEventCollection = client.db("CSTE").collection("cste-official");
const playListCollection = client.db("CSTE").collection("Online-Playlist");
const jobCuirculerCollection = client.db("CSTE").collection("Online-Job");
const jobRegistrationCollection = client.db("CSTE").collection("Job-Registration");
// //location
// const IPGeolocationAPI = require("ip-geolocation-api-javascript-sdk");
// const ipgeolocationApi = new IPGeolocationAPI(
//   process.env.LOCATION_API_KYE,
//   false
// );
// app.get("/user/location", async (req, res) => {
//   ipgeolocationApi.getGeolocation(handleResponse);
//   function handleResponse(userLocation) {
//     res.send({ location: userLocation });
//   }
// });
//router

//user post register router
// app.post("/api/user/register", async (req, res) => {
//   try {
//     const user = req.body;
//     // console.log(user);
//     const payload = {
//       user: {
//         email: user.email,
//       },
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRETE, {
//       expiresIn: "1d",
//     });
//     res.status(200).send({ msg: "Login Successfully", token: token });
//     // console.log(result);
//   } catch (err) {
//     console.log(err);
//   }
// });
//user post login router
app.post("/api/user/login", async (req, res) => {
  try {
    const user = req.body;
    //console.log(user);
    const loginUser = await addStudent.findOne({
      studentId: user.studentID,
    });
    if (user.eduMail) {
      const eduUser = await addStudent.findOne({
        email: user.eduMail,
      });
      // console.log(eduUser);
      if (eduUser) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res.status(200).send({
          msg: `Login by ${eduUser.studentId}`,
          token: token,
          student: eduUser,
        });
      } else {
        res.status(200).send({ error: "Invalid email" });
      }
    } else if (loginUser) {
      if (loginUser.password === req.body.stduentPassword) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res.status(200).send({
          msg: `Login by ${user.studentID}`,
          token: token,
          student: loginUser,
        });
      } else {
        res.status(200).send({ error: "Invalid password" });
      }
    } else {
      res.status(200).send({ error: "Invalid ID" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});


//teacher login
app.post("/api/teacher/login", async (req, res) => {
  try {
    const user = req.body;
    //console.log(user);
    const loginTeacher = await addTeacher.findOne({
      email: user.email,
    });
    if (user.eduMail) {
      const eduUser = await addTeacher.findOne({
        email: user.eduMail,
      });
      // console.log(eduUser);
      if (eduUser) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res.status(200).send({
          msg: `Login Successfully`,
          token: token,
          teacher: eduUser,
        });
      } else {
        res.status(200).send({ error: "Invalid email" });
      }
    } else if (loginTeacher) {
      if (loginTeacher.password === req.body.Password) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res.status(200).send({
          msg: `Login Succesfully`,
          token: token,
          teacher: loginTeacher,
        });
      } else {
        res.status(200).send({ error: "Invalid password" });
      }
    } else {
      res.status(200).send({ error: "Invalid ID" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//teacher img add
app.patch("/api/teacher/profile/image/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        picture: req.body.picture,
      },
    };
    await addTeacher.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Add your picture" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//Online playlist
app.post('/api/online/playlist',verifyJwt,async(req,res)=>{
  try {
    const playlist=req.body
  await playListCollection.insertOne(playlist)
  res.status(200).send({msg:'Play List Added'})
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
 
})
app.get('/api/online/playlist',async(req,res)=>{
  try {
 const allPlayList= await playListCollection.find({}).toArray()
  res.status(200).send(allPlayList)
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
 
})
//update and add techer information
app.patch("/api/teacher/profile/information/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        designation: req.body.designation,
        joinDate: req.body.joinDate,
        about: req.body.about,
      },
    };
    await addTeacher.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Add your information" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//user profile update
app.patch("/api/user/update/:id", verifyJwt, async (req, res) => {
  try {
    const stuId = req.params.id;
    const student = await addStudent.findOne({ studentId: stuId });

    const query = { studentId: stuId };
    const updatedReview = {
      $set: {
        name: req.body.name ? req.body.name : student.name,
        email: req.body.email ? req.body.email : student.email,
        password: req.body.password ? req.body.password : student.password,
        session: req.body.session ? req.body.session : student.session,
        contactNo: req.body.contactNo ? req.body.contactNo : student.contactNo,
        batch: req.body.batch ? req.body.batch : student.batch,
        dept: req.body.dept ? req.body.dept : student.dept,
        blood: req.body.blood ? req.body.blood : student.blood,
        adress: req.body.adress ? req.body.adress : student.adress,
      },
    };
    await addStudent.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Updated" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//user get all register router
app.get("/api/user", async (req, res) => {
  try {
    const result = await userCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//job circuler
app.post('/api/online/job/circuler',verifyJwt,async(req,res)=>{
  try{
    const jobInfo=req.body;
  await jobCuirculerCollection.insertOne(jobInfo)
  res.status(200).send({msg:'Posted'})
  }catch(err){
    res.status(400).send({ error: err.massage });
  }

})
//all job get
app.get('/api/online/job/circuler',async(req,res)=>{
  try{
 const allJobCircular= await jobCuirculerCollection.find({}).toArray();
  res.status(200).send({allJob:allJobCircular})
  }catch(err){
    res.status(400).send({ error: err.massage });
  }

})

//all applicant specific job
app.get(`/api/online/job/applicant/:id`,verifyJwt,async(req,res)=>{
  try{
    const id=req.params.id
    const allApplicant=await jobRegistrationCollection.find({}).toArray()
    const applicantById=allApplicant.filter(res=>res?.PaymentDetails?.jobId===id)
  res.status(200).send({allApplicant:applicantById})
  }catch(err){
    res.status(400).send({ error: err.massage });
  }

})

//admit card approve
app.patch("/api/job/applicant/isapprove/:id", async (req, res) => {
  try {
    const data=req.body.value
    const id=req.params.id
    const query = {_id:ObjectId(id)};
    let updatedAdmit;
    if(data===1){
     updatedAdmit= {
        $set: {
          admitCard:true,
        },
      };
    }else{
       updatedAdmit= {
        $set: {
          admitCard:false,
        },
      };
    }
   
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedAdmit);
    //console.log(updatedDate)
    if(updatedDate.acknowledged &&data===1){
      res.status(200).send({ msg: "Selected!" });
    }else if(updatedDate.acknowledged &&data===0){
      res.status(200).send({ msg: "Cancled!" })
      
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});





//single job get
app.get('/api/online/job/single/:id',async(req,res)=>{
  try{
    const id=req.params.id
 const singleJob= await jobCuirculerCollection.findOne({_id:ObjectId(id)});
  res.status(200).send({Job:singleJob})
  }catch(err){
    res.status(400).send({ error: err.massage });
  }

})

//job's register
app.post("/api/job/apply/registration", async (req, res) => {
  try {
    const form = req.body;
    //console.log(form)
    const existUser=await jobRegistrationCollection.findOne({appEmail:req.body.appEmail})
    if(existUser){
      res.status(200).send({ error: 'Email already used!' });
    }else{
      await jobRegistrationCollection.insertOne(form);
     res.status(200).send({ msg: "registration completed" });
    }
    
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

app.get("/api/job/applicant/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id)
    const apllicatUser=await jobRegistrationCollection.findOne({_id:ObjectId(id)})
    if(apllicatUser){
      res.status(200).send({ info:apllicatUser});
    }else{
     res.status(200).send({ error: "Invalid user!" });
    }
    
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//job's login
app.post("/api/job/apply/login", async (req, res) => {
  try {
    const user = req.body;
    const userInfo=await jobRegistrationCollection.findOne({appEmail:req.body.appEmail})
    if(!userInfo){
      res.status(200).send({ error: 'Invalid email!' });
    }else{
      if(userInfo.appPassword===req.body.appPassword){
        const payload = {
          user: {
            appEmail: user.appEmail,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRETE, {
          expiresIn: "1d",
        });
        res.status(200).send({
          msg: `Login Succesfully`,
          token: token,
          userInfo: userInfo,
        });
        }
      
    }
    
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//applicant qualification
app.patch("/api/job/apply/qualification",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userQualification=userInfo?.qualification || []
    let qualiArray=[...userQualification,userData?.qualification]

    const query = {_id:ObjectId(req.body.id)};
    const updatedQualification= {
      $set: {
        qualification:qualiArray,
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedQualification);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Add your Qualification" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete qualification
app.post("/api/job/apply/qualification",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
   // console.log(userData)
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userQualification=userInfo?.qualification || []
    // console.log(userQualification[userData.index])
    let qualiArray=[...userQualification]
    qualiArray.splice(userData?.index,1)
    const query = {_id:ObjectId(req.body.id)};
    const updatedQualification= {
      $set: {
        qualification:qualiArray
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedQualification);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Deleted" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});


//applicant training
app.patch("/api/job/apply/training",verifyJwt, async (req, res) => {
  try {

    const userData = req.body;
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userTraining=userInfo?.training || []
    let trainingArray=[...userTraining,userData?.training]

    const query = {_id:ObjectId(req.body.id)};
    const updatedTraining= {
      $set: {
        training:trainingArray,
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedTraining);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Add your Training" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete training
app.post("/api/job/apply/training",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
   // console.log(userData)
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userTraining=userInfo?.training || []
    // console.log(userQualification[userData.index])
    let trainingArray=[...userTraining]
    trainingArray.splice(userData?.index,1)
    const query = {_id:ObjectId(req.body.id)};
    const updatedQualification= {
      $set: {
        training:trainingArray
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedQualification);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Deleted" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//applicant experience
app.patch("/api/job/apply/experience",verifyJwt, async (req, res) => {
  try {

    const userData = req.body;
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userExperience=userInfo?.experience || []
    let experienceArray=[...userExperience,userData?.experience]

    const query = {_id:ObjectId(req.body.id)};
    const updatedExperience= {
      $set: {
        experience:experienceArray,
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedExperience);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Add your Experience" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete experience
app.post("/api/job/apply/experience",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
   // console.log(userData)
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userExperience=userInfo?.experience || []
    // console.log(userQualification[userData.index])
    let experienceArray=[...userExperience]
    experienceArray.splice(userData?.index,1)
    const query = {_id:ObjectId(req.body.id)};
    const updatedExp= {
      $set: {
        experience:experienceArray
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedExp);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Deleted" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//applicant document
app.patch("/api/job/apply/document",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
    //console.log(userData)
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userDocument=userInfo?.document || []
    let documentArray=[...userDocument,userData?.document]

    const query = {_id:ObjectId(req.body.id)};
    const updatedDocument= {
      $set: {
        document:documentArray,
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedDocument);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Add your Document" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete document
app.post("/api/job/apply/document",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
    //console.log(userData)
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userDocument=userInfo?.document || []
    // console.log(userQualification[userData.index])
    let documentArray=[...userDocument]
    documentArray.splice(userData?.index,1)
    const query = {_id:ObjectId(req.body.id)};
    const updatedDocument= {
      $set: {
        document:documentArray
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedDocument);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Deleted" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});


//applicant document
app.patch("/api/job/apply/publication",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
    //console.log(userData)
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userPublication=userInfo?.publication || []
    let publicationArray=[...userPublication,userData?.publication]

    const query = {_id:ObjectId(req.body.id)};
    const updatedPublication= {
      $set: {
        publication:publicationArray,
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedPublication);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Add your Publication" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete document
app.post("/api/job/apply/publication",verifyJwt, async (req, res) => {
  try {
    const userData = req.body;
    //console.log(userData)
    const userInfo=await jobRegistrationCollection.findOne({_id:ObjectId(req.body.id)}) 
    let userPublication=userInfo?.publication || []
    // console.log(userQualification[userData.index])
    let publicationArray=[...userPublication]
    publicationArray.splice(userData?.index,1)
    const query = {_id:ObjectId(req.body.id)};
    const updatedPublication= {
      $set: {
        publication:publicationArray
      },
    };
   const updatedDate= await jobRegistrationCollection.updateOne(query, updatedPublication);
    //console.log(updatedDate)
    if(updatedDate.acknowledged){
      res.status(200).send({ msg: "Deleted" });
    }else{
      res.status(200).send({ error: "Something Wrong" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});





//user post registration
app.post("/api/user/registration", async (req, res) => {
  try {
    const form = req.body;
    await userRegForm.insertOne(form);
    res.status(400).send({ msg: "registration completed" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

app.get("/api/user/registration/:id", async (req, res) => {
  const id = req.params.id;
  //console.log(id);
  try {
    const result = await userRegForm.findOne({
      "studentInfo.studentID": id,
    });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send({ error: "Not Registed" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//chairman msg
app.post("/api/chairman/sms", verifyJwt, async (req, res) => {
  try {
    const msg = req.body;
    await chairmanMsg.insertOne(msg);
    res.status(200).send({ msg: "Added" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/chairman/sms", async (req, res) => {
  try {
    const allMsg = await chairmanMsg.find({}).toArray();
    res.status(200).send({ sms: allMsg });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//add student api
app.post("/api/student/add", verifyJwt, async (req, res) => {
  try {
    const student = req.body;
    const exsistStudent = await addStudent.findOne({
      studentId: req.body.studentId,
    });
    if (exsistStudent) {
      res.status(200).send({ error: `${student.name} Already Added` });
    } else {
      await addStudent.insertOne(student);
      res.status(400).send({ msg: `${student.name} Added` });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//get all student
app.get("/api/student/add", async (req, res) => {
  try {
    const batch = req.query.batch;
    //console.log(batch);
    const allStudent = await addStudent.find({}).toArray();
    if (batch && batch !== "all") {
      const filterStudent = allStudent.filter((st) => st.batch === batch);
      res.status(200).send(filterStudent);
      // console.log(filterStudent);
    } else {
      res.status(200).send(allStudent);
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete a student
app.delete("/api/student/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    await addStudent.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "Deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//edit a student
app.patch("/api/student/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        picture: req.body.picture,
      },
    };
    await addStudent.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Add your picture" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//hsc result a student
app.patch("/api/student/hsc/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        hsc: req.body,
      },
    };
    await addStudent.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Added" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//hsc result a student
app.patch("/api/student/ssc/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const query = { _id: ObjectId(id) };
    const updatedReview = {
      $set: {
        ssc: req.body,
      },
    };
    await addStudent.updateOne(query, updatedReview);
    res.status(200).send({ msg: "Added" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//add teacher api
app.post("/api/teacher/add", verifyJwt, async (req, res) => {
  try {
    const teacher = req.body;
    const exsistTeacher = await addTeacher.findOne({
      email: req.body.email,
    });
    if (exsistTeacher) {
      res.status(400).send({ error: `${teacher.name} Already Added` });
    } else {
      await addTeacher.insertOne(teacher);
      res.status(200).send({ msg: `${teacher.name} Added` });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//get all teacher
app.get("/api/teacher/add", async (req, res) => {
  try {
    const allTeacher = await addTeacher.find({}).toArray();
    res.status(200).send(allTeacher);
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/teacher/add/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await addTeacher.findOne({
      _id: ObjectId(id),
    });
    res.status(200).send(teacher);
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//delete a student
app.delete("/api/teacher/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    await addTeacher.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "Deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

//top programmer
app.post("/api/programmer/add", async (req, res) => {
  try {
    const coder = req.body;
    // console.log(coder);
    await programmer.insertOne(coder);
    res.status(200).send({ msg: `${coder.name} Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/programmer/add", async (req, res) => {
  try {
    const coder = await programmer
      .find({})
      .limit(10)
      .sort({ rating: -1 })
      .toArray();
    res.status(200).send({ coderList: coder });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//other exprience
app.post("/api/other/exp/add", async (req, res) => {
  try {
    const exp = req.body;
    // console.log(coder);
    await otherExprience.insertOne(exp);
    res.status(200).send({ msg: `${exp.name} Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/other/exp/add", async (req, res) => {
  try {
    const expList = await otherExprience.find({}).limit(10).toArray();
    res.status(200).send({ expList: expList });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//galary
app.post("/api/img/add", async (req, res) => {
  try {
    const img = req.body;
    // console.log(coder);
    await galaryCollection.insertOne(img);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/img/add", async (req, res) => {
  try {
    const allImg = await galaryCollection
      .find({})
      .limit(8)
      .sort({ date: -1 })
      .toArray();
    res.status(200).send({ imgList: allImg });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//add materials
app.post("/api/add/material", async (req, res) => {
  try {
    const data = req.body;
    // console.log(coder);
    await materialCollection.insertOne(data);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/add/material", async (req, res) => {
  try {
    const allMaterials = await materialCollection.find({}).toArray();
    res.status(200).send({ material: allMaterials });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//add club members
app.post("/api/add/club/members", async (req, res) => {
  try {
    const data = req.body;
    // console.log(coder);
    await clubMemberCollection.insertOne(data);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/add/club/members", async (req, res) => {
  try {
    const allMember = await clubMemberCollection.find({}).toArray();
    res.status(200).send({ members: allMember });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//job
app.post("/api/add/job", async (req, res) => {
  try {
    const jobPost = req.body;
    // console.log(coder);
    await jobCollection.insertOne(jobPost);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/add/job", async (req, res) => {
  try {
    const job = parseInt(req.query.job);
    if (job) {
      const allJobPost = await jobCollection.find({}).limit(job).toArray();
      res.status(200).send({ jobList: allJobPost });
    } else {
      const allJobPost = await jobCollection.find({}).toArray();
      res.status(200).send({ jobList: allJobPost });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//curriculum
app.post("/api/add/curriculum", async (req, res) => {
  try {
    const curruculum = req.body;
    //console.log(curruculum);
    await curriculumCollection.insertOne(curruculum);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/add/curriculum/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const course = await curriculumCollection
      .find({ formData: id })
      .sort({ courseCode: 1 })
      .toArray();
    res.status(200).send({ course: course });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//news
app.post("/api/add/news", async (req, res) => {
  try {
    const news = req.body;
    await newsCollection.insertOne(news);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//home news
app.get("/api/add/news", async (req, res) => {
  try {
    const news = await newsCollection.find({}).sort({ date: -1 }).toArray();
    res.status(200).send({ news: news[0] });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//all news
app.get("/api/add/all/news", async (req, res) => {
  try {
    const news = await newsCollection.find({}).sort({ date: 1 }).toArray();
    res.status(200).send({ allNews: news });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/add/news/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const news = await newsCollection.findOne({ _id: ObjectId(id) });
    res.status(200).send({ singleNews: news });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.delete("/api/add/news/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await newsCollection.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//Notice
app.post("/api/add/notice", async (req, res) => {
  try {
    const notice = req.body;
    await noticeCollection.insertOne(notice);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//home notice
app.get("/api/add/notice", async (req, res) => {
  try {
    const notice = await noticeCollection.find({}).limit(5).toArray();
    res.status(200).send({ notice: notice });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//csteofficial
app.post("/api/add/official/event",verifyJwt, async (req, res) => {
  try {
    const event = req.body;
    await officialEventCollection.insertOne(event);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.get("/api/add/official/event", async (req, res) => {
  try {
    const event = await officialEventCollection.find({}).toArray();
    res.status(200).send({ allEvent: event });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
app.delete("/api/add/official/event/:id", verifyJwt, async (req, res) => {
  try {
    const id = req.params.id;
    await officialEventCollection.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//all Notice
app.get("/api/add/all/notice", async (req, res) => {
  try {
    const notice = await noticeCollection.find({}).toArray();
    res.status(200).send({ allNotice: notice });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//public notice  delete
app.delete("/api/add/public/notice/:id", verifyJwt, async (req, res) => {
  try {
    const id = req.params.id;
    await noticeCollection.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//news delete
app.delete("/api/add/news/:id1", async (req, res) => {
  try {
    const id = req.params.id;
    await newsCollection.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ msg: "deleted" });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//student notice post
app.post("/api/add/student/notice", verifyJwt, async (req, res) => {
  try {
    const notice = req.body;
    await studentNoticeCollection.insertOne(notice);
    res.status(200).send({ msg: `Added` });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//student notice get by batch
app.get("/api/add/student/notice/:batch", verifyJwt, async (req, res) => {
  try {
    const batch = req.params.batch;
    //console.log(batch);
    const notice = await studentNoticeCollection
      .find({ batch: batch })
      .sort({ time: -1 })
      .limit(5)
      .toArray();
    res.status(200).send({ batchNotice: notice });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//student notice visit or not
app.patch("/api/visit/student/notice", verifyJwt, async (req, res) => {
  try {
    const read = req.body;
    const findNotice = await studentNoticeCollection.findOne({
      _id: ObjectId(read.id),
    });

    let exitsId = findNotice.visit.includes(read.stuId);
    // console.log(exitsId);
    if (!exitsId) {
      let visitId = [...findNotice.visit, read.stuId];
      const query = { _id: ObjectId(read.id) };
      const updatedReview = {
        $set: {
          visit: visitId,
        },
      };
      await studentNoticeCollection.updateOne(query, updatedReview);
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//student single notice
app.get("/api/read/student/notice/:id", verifyJwt, async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(batch);
    const notice = await studentNoticeCollection.findOne({ _id: ObjectId(id) });
    //console.log(notice);
    res.status(200).send({ readNotice: notice });
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});
//payment init
app.post("/init", verifyJwt, async (req, res) => {
   //console.log(req.body);
  try {
    const data = {
      total_amount: req.body?.fee,
      form_ref: req.body?.ref,
      currency: "BDT",
      tran_id: uuidv4(),
      stu_id: req.body.studentInfo?.studentID,
      success_url: "http://localhost:5000/success",
      fail_url: "https://cste-club-ibrahimecste.vercel.app/fail",
      cancel_url: "https://cste-club-ibrahimecste.vercel.app/cancel",
      ipn_url: "http://yoursite.com/ipn",
      studentInfo: req.body?.studentInfo,
      regFormInfo: req.body?.regForm,
      payment: false,
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: "cust@yahoo.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
      multi_card_name: "mastercard",
      value_a: "ref001_A",
      value_b: "ref002_B",
      value_c: "ref003_C",
      value_d: "ref004_D",
    };

    await onlineFormCollection.insertOne(data);
    const sslcommer = new SSLCommerzPayment(
      process.env.SSL_STORE_ID,
      process.env.SSL_SECRET_KEY,
      false
    ); //true for live default false for sandbox
    sslcommer.init(data).then((data) => {
      //process the response that got from sslcommerz
      //https://developer.sslcommerz.com/doc/v4/#returned-parameters
      // console.log(data);
      if (data.GatewayPageURL) {
        res.status(200).send({ paymentUrl: data.GatewayPageURL });
      } else {
        res.status(200).send({
          error: "SSL session was not successful",
        });
      }
    });
  } catch (err) {
    return res.status(400).send({
      error: err.massage,
    });
  }
});
//job applicat payment init
app.post("/applicant/init", verifyJwt, async (req, res) => {
  //console.log(req.body);
 try {
   const data = {
     total_amount: req.body?.fee,
     form_ref: req.body?.ref,
     currency: "BDT",
     tran_id: uuidv4(),
     success_url: "http://localhost:5000/success",
     fail_url: "https://cste-club-ibrahimecste.vercel.app/fail",
     cancel_url: "https://cste-club-ibrahimecste.vercel.app/cancel",
     ipn_url: "http://yoursite.com/ipn",
     applicantId: req.body?.applicantId,
     jobId:req.body?.jobId,
     payment: false,
     shipping_method: "Courier",
     product_name: "Computer.",
     product_category: "Electronic",
     product_profile: "general",
     cus_name: "Customer Name",
     cus_email: "cust@yahoo.com",
     cus_add1: "Dhaka",
     cus_add2: "Dhaka",
     cus_city: "Dhaka",
     cus_state: "Dhaka",
     cus_postcode: "1000",
     cus_country: "Bangladesh",
     cus_phone: "01711111111",
     cus_fax: "01711111111",
     ship_name: "Customer Name",
     ship_add1: "Dhaka",
     ship_add2: "Dhaka",
     ship_city: "Dhaka",
     ship_state: "Dhaka",
     ship_postcode: 1000,
     ship_country: "Bangladesh",
     multi_card_name: "mastercard",
     value_a: "ref001_A",
     value_b: "ref002_B",
     value_c: "ref003_C",
     value_d: "ref004_D",
   };

   await onlineFormCollection.insertOne(data);
   const sslcommer = new SSLCommerzPayment(
     process.env.SSL_STORE_ID,
     process.env.SSL_SECRET_KEY,
     false
   ); //true for live default false for sandbox
   sslcommer.init(data).then((data) => {
     //process the response that got from sslcommerz
     //https://developer.sslcommerz.com/doc/v4/#returned-parameters
     // console.log(data);
     if (data.GatewayPageURL) {
       res.status(200).send({ paymentUrl: data.GatewayPageURL });
     } else {
       res.status(200).send({
         error: "SSL session was not successful",
       });
     }
   });
 } catch (err) {
   return res.status(400).send({
     error: err.massage,
   });
 }
});
app.post("/success", async (req, res) => {
  await onlineFormCollection.updateOne(
    { tran_id: req.body.tran_id },
    {
      $set: {
        payment: true,
        paymentDetails: req.body,
      },
    }
  );
  const form = await onlineFormCollection.findOne({
    tran_id: req.body.tran_id,
  });
  if (form.form_ref === "reg") {
    await addStudent.updateOne(
      { studentId: form.stu_id },
      {
        $set: {
          form: form,
        },
      }
    );
  }
 else if (form.form_ref === "admit") {
    await addStudent.updateOne(
      { studentId: form.stu_id },
      {
        $set: {
          examFee: form,
        },
      }
    );
   
  }
  else if (form.form_ref==="job") {
    await jobRegistrationCollection.updateOne(
      { _id:ObjectId(form?.applicantId)},
      {
        $set: {
          PaymentDetails: form,
        },
      }
    );
   
  }
  
  res.redirect(`https://cste-dept.web.app/success/${req.body.tran_id}`);
});
app.post("/fail", async (req, res) => {
  await onlineFormCollection.deleteOne({ tran_id: req.body.tran_id });
  res.redirect(`https://cste-dept.web.app/`);
});
app.post("/cancel", async (req, res) => {
  await onlineFormCollection.deleteOne({ tran_id: req.body.tran_id });
  res.redirect(`https://cste-dept.web.app/`);
});
//add reg time

app.patch("/api/add/reg/time", verifyJwt, async (req, res) => {
  try {
    const StuBatch = req.body.batch;
    console.log(StuBatch);
    if (StuBatch) {
      await addStudent.updateMany(
        { batch: StuBatch },
        {
          $set: {
            RegDate: req.body,
          },
        }
      );
      res.status(200).send({ msg: "Added" });
    } else {
      res.status(200).send({ msg: "Add Batch Field" });
    }
  } catch (err) {
    res.status(400).send({ error: err.massage });
  }
});

// //testsms api
// app.get("/client/sms", (req, res) => {
//   messagebird.messages.create({
//     originator : '01612701346',
//     recipients : [ '018925893777' ],
//     body : 'Hello World, I am a text message and I was hatched by Javascript code!'
//  },function (err, response) {
//   if (err) {
//      console.log("ERROR:");
//      console.log(err);
//  } else {
//      console.log("SUCCESS:");
//      console.log(response);
//  }
// });
// });
app.get("/", (req, res) => {
  res.status(200).send("Hi server!");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
