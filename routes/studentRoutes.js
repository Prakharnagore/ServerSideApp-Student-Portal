var express = require("express");
var router = express.Router();
var pool = require("./mysqlpool");
var upload = require("./multer");
var LocalStorage = require("node-localstorage").LocalStorage;
const e = require("express");
var localStorage = new LocalStorage("./scratch");

router.get("/studententry", function (req, res, next) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin == null) {
    res.redirect("/admin/adminlogin");
  } else {
    res.render("studententry", { message: "", admin: admin });
  }
});

// G E T T I N G   S T U D E N T  P O R T A L   S T A T E S  V A L U E  A T   R O U T E -'/getstudentstate'

router.get("/getstudentstate", function (req, res) {
  pool.query(
    "select * from studentinformation.states",
    function (error, result) {
      if (error) {
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

// G E T T I N G   S T U D E N T  P O R T A L   C I T Y  V A L U E  A T   R O U T E -'/getstudentcity'

router.get("/getstudentcity", function (req, res) {
  pool.query(
    "select * from studentinformation.cities where idstates=?",
    [req.query.idstates],
    function (error, result) {
      if (error) {
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

// S U B M I T T I N G   S T U D E N T  P O R T A L   V A L U E S  A T   R O U T E -'/submitstudententry'

router.post(
  "/submitstudententry",
  upload.single("studentpicture"),
  function (req, res, next) {
    console.log("body", req.body);
    console.log("file", req.file);
    var admin = JSON.parse(localStorage.getItem("ADMIN"));
    if (admin == null) {
      res.redirect("/admin/adminlogin");
    } else {
      pool.query(
        "insert into studentinformation.studentdata(studentname,studentfathername,studentrollno,studentgender,studentdob,studentstate,studentcity,studentaddress,studentschool,studentpicture,ecode,emarks,hcode,hmarks,mcode,mmarks,pcode,pmarks,ccode,cmarks) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          req.body.studentname,
          req.body.studentfathername,
          req.body.studentenrollmentno,
          req.body.studentgender,
          req.body.studentdob,
          req.body.studentstate,
          req.body.studentcity,
          req.body.studentaddress,
          req.body.studentschoolname,
          req.body.filename,
          req.body.englishcode,
          req.body.englishmarks,
          req.body.hindicode,
          req.body.hindimarks,
          req.body.mathcode,
          req.body.mathmarks,
          req.body.physicscode,
          req.body.physicsmarks,
          req.body.chemistrycode,
          req.body.chemistrymarks,
        ],
        function (error, result) {
          if (error) {
            res.render("studententry", { message: "Server Error..." });
          } else {
            res.render("studententrysubmittednotification", { admin });
          }
        }
      );
    }
  }
);

// S H O W   S T U D E N T  P O R T A L  D A T A   A T   R O U T E -'/showstudentdata'

router.get("/showstudentdata", function (req, res, next) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin == null) {
    res.redirect("/admin/adminlogin");
  } else {
    pool.query(
      "select studentdata.*,states.statename as newstudentstate from studentinformation.studentdata join states on states.idstates=studentdata.studentstate",
      function (error, result) {
        if (error) {
          res.render("showstudentdata", { result: [], msg: "Server Error" });
        } else {
          if (result.length === 0) {
            res.render("showstudentdata", {
              result: [],
              msg: "No record Found",
              admin,
            });
          } else {
            res.render("showstudentdata", {
              result: result,
              admin,
              msg: "",
            });
          }
        }
      }
    );
  }
});

// U P D A T E   S T U D E N T  P O R T A L  D A T A   A T   R O U T E - '/updatestudentdata'

router.get("/updatestudentdata", function (req, res, next) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin == null) {
    res.redirect("/admin/adminlogin");
  } else {
    pool.query(
      "select studentdata.*,states.statename as newstudentstate from studentinformation.studentdata join states on states.idstates=studentdata.studentstate",
      function (error, result) {
        if (error) {
          res.render("updatestudentdata", { result: [], msg: "Server Error" });
        } else {
          if (result.length === 0) {
            res.render("updatestudentdata", {
              result: [],
              msg: "No record Found",
              admin,
            });
          } else {
            res.render("updatestudentdata", {
              result: result,
              msg: "",
              admin,
            });
          }
        }
      }
    );
  }
});

// S H O W  S T U D E N T  D A T A  B Y  R O L L N O  A  T   R O U T E -'/showstudentdatabyrollno'

router.get("/showstudentdatabyrollno", function (req, res, next) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin == null) {
    res.redirect("/admin/adminlogin");
  } else {
    pool.query(
      "select studentdata.* , states.statename as newstudentstate from studentinformation.studentdata join states on states.idstates=studentdata.studentstate where studentdata.studentrollno=?",
      [req.query.studentrollno],
      function (error, result) {
        if (error) {
          res.render("showstudentdatabyrollno", { result: [] });
        } else {
          res.render("showstudentdatabyrollno", { result: result[0], admin });
        }
      }
    );
  }
});

// S U B M I T T I N G    E D I I T E D   S T U D E N T  P O R T A L  D A T A  A T   R O U T E -'/submiteditedstudententry'

router.post("/submiteditedstudententry", function (req, res, next) {
  console.log("body", req.body);
  pool.query(
    "update studentinformation.studentdata set studentname=?,studentfathername=?,studentrollno=?,studentgender=?,studentdob=?,studentstate=?,studentcity=?,studentaddress=?,studentschool=?,ecode=?,emarks=?,hcode=?,hmarks=?,mcode=?,mmarks=?,pcode=?,pmarks=?,ccode=?,cmarks=? where studentrollno=?",
    [
      req.body.studentname,
      req.body.studentfathername,
      req.body.studentenrollmentno,
      req.body.studentgender,
      req.body.studentdob,
      req.body.studentstate,
      req.body.studentcity,
      req.body.studentaddress,
      req.body.studentschoolname,
      /* req.body.studentpicture */
      req.body.englishcode,
      req.body.englishmarks,
      req.body.hindicode,
      req.body.hindimarks,
      req.body.mathcode,
      req.body.mathmarks,
      req.body.physicscode,
      req.body.physicsmarks,
      req.body.chemistrycode,
      req.body.chemistrymarks,
      req.body.studentenrollmentno,
    ],
    function (error, result) {
      if (error) {
        res.redirect("/studententrysubmittednotification", {
          message: "Server Error...",
        });
      } else {
        res.redirect("/studentportal/updatestudentdata");
      }
    }
  );
});

// D E L E T E    S T U D E N T  P O R T A L  D A T A  A T   R O U T E -'/deletestudentdatabyrollno'

router.get("/deletestudentdatabyrollno", function (req, res, next) {
  pool.query(
    "delete from studentinformation.studentdata where studentrollno=?",
    [req.query.studentrollno],
    function (error, result) {
      if (error) {
        res.redirect("/studentportal/updatestudentdata", {
          message: "Server Error...",
        });
      } else {
        res.redirect("/studentportal/updatestudentdata");
      }
    }
  );
});

// E D I T  S T U D E N T  P I C T U R E   A T   R O U T E -'/editstudentpicture'

router.get("/editstudentpicture", function (req, res, next) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin == null) {
    res.redirect("/admin/adminlogin");
  } else {
    res.render("editstudentpicture", { ...req.query, admin });
  }
});

// E D I T E D  S T U D E N T  P I C T U R E   A T   R O U T E -'/editedstudentpicture'

router.post(
  "/editedstudentpicture",
  upload.single("studentpicture"),
  function (req, res, next) {
    console.log("start");
    console.log("body", req.body);
    console.log("file", req.body.filename);
    console.log("end");

    pool.query(
      "update studentinformation.studentdata set studentpicture=? where studentrollno=?",
      [req.body.filename, req.body.studentrollno],
      function (error, result) {
        if (error) {
          res.redirect("/studentportal/editstudentpicture", {
            message: "Server Error...",
          });
        } else {
          res.redirect("/studentportal/updatestudentdata");
        }
      }
    );
  }
);
// S E A R C H   S T U D E N T   D A T A   R O U T E  - "/searchstudentdata"
router.get("/searchstudentdata", function (req, res, next) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin == null) {
    res.redirect("/admin/adminlogin");
  } else {
    res.render("searchstudentdata", { message: "", admin: admin });
  }
});

// S E A R C H   S T U D E N T  D A T A  B Y  R O L L N O  A  T   R O U T E -'/searchstudentdatabyrollno'

router.post("/searchstudentdatabyrollno", function (req, res, next) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin == null) {
    res.redirect("/admin/adminlogin");
  } else {
    pool.query(
      "select studentdata.* , states.statename as newstudentstate from studentinformation.studentdata join states on states.idstates=studentdata.studentstate where studentdata.studentrollno=?",
      [req.body.studentrollno],
      function (error, result) {
        if (error) {
          res.render("showstudentdatabyrollno", { result: [] });
        } else {
          res.render("showstudentdatabyrollno", { result: result[0], admin });
        }
      }
    );
  }
});
module.exports = router;

///searchstudentdata
