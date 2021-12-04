var express = require("express");
var router = express.Router();
var pool = require("./mysqlpool");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
// GET S T U D E N T   E N T R O L L E M N T    N U M B E R   A T    R O U T E
router.get("/studentmarksheet", function (req, res, next) {
  res.render("studentmarksheet");
});
//G E T  S T U D E N T   M A R K S H E E T   A T  R O U T E
router.post("/getstudentmarksheet", function (req, res, next) {
  pool.query(
    "select studentdata.* , states.statename as newstudentstate from studentinformation.studentdata join states on states.idstates=studentdata.studentstate where studentdata.studentrollno=?",
    [req.body.studentrollno],
    function (error, result) {
      if (error) {
        console.log("result", result);
        res.render("showstudentmarksheetbyrollno", { result: [] });
      } else {
        let totalmarks =
          result[0].emarks +
          result[0].hmarks +
          result[0].mmarks +
          result[0].pmarks +
          result[0].cmarks;
        // console.log("totalmarks", totalmarks);

        let percentage = (totalmarks * 100) / 500;

        let status = "";
        if (percentage > 33) {
          status = "Passed";
        }
        result[0] = {
          ...result[0],
          ["totalmarks"]: totalmarks,
          ["status"]: status,
          ["percentage"]: percentage,
        };
        res.render("showstudentmarksheetbyrollno", { result: result[0] });
      }
    }
  );
});

module.exports = router;
