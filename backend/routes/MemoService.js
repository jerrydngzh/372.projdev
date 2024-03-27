var express = require("express");
var router = express.Router();
const Memo = require("../models/MemoSchema");
const User = require("../models/UserSchema");

// NOTE: dev only
// TODO: secure with Admin role
router.get("/all", async (req, res, next) => {
  const pass = req.query.pass;

  if (pass !== process.env.DEV_PASS) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  try {
    const memos = await Memo.find({});
    console.log(memos);
    res.status(200).send(memos);
  } catch (err) {
    next(err);
  }
});

// TODO: update to use JWT for auth for user instead of passing a user_id
// get for a user's memos
router.get("/:user_id", async (req, res, next) => {
  // TODO: validate user_id is a valid user
  const user_id = req.params.user_id;

  try {
    // returns array of objects
    const memos = await Memo.find({ user_id: user_id });

    if (memos.length === 0) {
      const err = new Error("No memos found");
      err.status = 404;
      throw err;
    }

    console.log(memos);
    res.status(200).send(memos);
  } catch (err) {
    next(err);
  }
});

// TODO: add in authentication for create
router.get("/:user_id/:id", async (req, res, next) => {
  // TODO: validate for user_id & memo_id pair
  const memoID = req.params.id;
  const userID = req.params.user_id;

  try {
    const memo = await Memo.findById({ _id: memoID, user_id: userID });

    if (!memo) {
      const err = new Error("No memos found");
      err.status = 404;
      throw err;
    }

    res.status(200).send(memo);
  } catch (err) {
    next(err);
  }
});

// TODO: validation of input
// TODO: add in authentication for create
router.post("/:user_id", async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const memo = new Memo({
      name: req.body.name,
      date: req.body.date,
      location: {
        name: req.body.location.name,
        coordinates: [
          req.body.location.coordinates[0],
          req.body.location.coordinates[1],
        ],
      },
      description: req.body.description,
      user_id: user_id,
    });

    const result = await memo.save();

    console.log({ message: "Created memo", result: result });
    res.status(201).send(memo);
  } catch (err) {
    next(err);
  }
});

// TODO: add in authentication for update
router.put("/:user_id/:id", async (req, res, next) => {
  const memo_id = req.params.id;
  const userID = req.params.user_id;

  // TODO: check for fields to update instead of updating all fields
  const memoToUpdate = {
    name: req.body.name,
    date: req.body.date,
    location: {
      name: req.body.location.name,
      coordinates: [
        req.body.location.coordinates[0],
        req.body.location.coordinates[1],
      ],
    },
    description: req.body.description,
  };

  try {
    const memo = await Memo.findOneAndUpdate(
      { _id: memo_id, user_id: userID },
      memoToUpdate,
      { new: true }
    );

    if (!memo) {
      const err = new Error("Memo not found");
      err.status = 404;
      throw err;
    }
    console.log({ message: "Updated memo", result: memo });
    res.status(200).send(memo);
  } catch (err) {
    next(err);
  }
});

router.delete("/:user_id/:id", async (req, res, next) => {
  // TODO: validate user_id & memo_id pair
  const memo_id = req.params.id;
  const user_id = req.params.user_id;

  try {
    const memo = await Memo.findOneAndDelete({
      _id: memo_id,
      user_id: user_id,
    });

    if (!memo) {
      const err = new Error("Memo not found");
      err.status = 404;
      throw err;
    }

    console.log("Deleted memo: " + memo);
    res.status(200).json({ message: "Deleted memo" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
