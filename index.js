const express = require("express");
const SSLCommerzPayment = require("sslcommerz");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const news = await newsCollection.find({}).sort({ date: 1 }).toArray();
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
  // console.log(req.body);
  try {
    const data = {
      total_amount: req.body.fee,
      form_ref: req.body.ref,
      currency: "BDT",
      tran_id: uuidv4(),
      stu_id: req.body.studentInfo.studentID,
      success_url: "https://cste-club-ibrahimecste.vercel.app/success",
      fail_url: "https://cste-club-ibrahimecste.vercel.app/fail",
      cancel_url: "https://cste-club-ibrahimecste.vercel.app/cancel",
      ipn_url: "http://yoursite.com/ipn",
      studentInfo: req.body.studentInfo,
      regFormInfo: req.body.regForm,
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
  if (form.form_ref === "admit") {
    await addStudent.updateOne(
      { studentId: form.stu_id },
      {
        $set: {
          examFee: form,
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

//test api
app.get("/", (req, res) => {
  res.status(200).send("Hi server!");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
