var express = require("express");
var router = express.Router();
var pool = require("./mysqlpool");
var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

// A D M I N   L O G I N   U I  A T  R O U T E - "/adminlogin"
router.get("/adminlogin", function (req, res, next) {
  res.render("adminlogin", { msg: "" });
});

// G E T   A D M I N   E M A I L   A N D   P A S S W O R D   A T   R O U T E  - "/checklogin"
router.post("/checklogin", function (req, res, next) {
  pool.query(
    "select * from studentinformation.admins where emailid=? and password=?",
    [req.body.emailid, req.body.password],
    function (error, result) {
      if (error) {
        res.render("adminlogin", { msg: "Server Error" });
      } else {
        if (result.length == 1) {
          localStorage.setItem("ADMIN", JSON.stringify(result[0]));
          res.render("dashboard", { admin: result[0] });
        } else {
          res.render("adminlogin", { msg: "Invalid Email Id or Password" });
        }
      }
    }
  );
});

//A D M I N   L O G O U T
router.get("/adminlogout", function (req, res, next) {
  localStorage.removeItem("ADMIN");
  localStorage.clear();
  res.render("adminlogin", { msg: "" });
});
module.exports = router;
