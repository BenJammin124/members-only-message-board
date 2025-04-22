//./routes/indexRouters.js
const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.indexHome);
indexRouter.get("/create-account", indexController.createAccountForm);
indexRouter.post("/create-account", indexController.createAccountFormPost);
indexRouter.get("/login", indexController.logInForm);
indexRouter.post("/login", indexController.logInSubmit);

indexRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

indexRouter.get("/create-new-message", indexController.createNewMessageForm);
indexRouter.post("/create-new-message", indexController.postNewMessage);

indexRouter.get("/members", indexController.membersPage);
indexRouter.post("/members", indexController.membersPagePost);

module.exports = { indexRouter };
