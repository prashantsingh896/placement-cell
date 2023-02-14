const User = require("../models/user");

//render profile page
module.exports.profile = function (req, res) {
    return res.render("user_profile", {
        title: "User Profile",
        profile_user: req.user,
    });
};

// update user Details
module.exports.updateUser = async function (req, res) {
    try {
        const user = await User.findById(req.user.id);
        const { username, password, confirm_password } = req.body;

        if (password != confirm_password) {
            console.log("Passwords doesn't match");
            return res.redirect("back");
        }

        if (!user) {
            console.log("user is not found");
            return res.redirect("back");
        }

        user.username = username;
        user.password = password;

        user.save();
        console.log('Details updated succesfully');
        return res.redirect("back");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

// render the Sign In page
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render("signin.ejs");
};

// render the Sign Up page
module.exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render("signup.ejs");
};

// creating up a new user
module.exports.create = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        // if password doesn't match
        if (password != confirm_password) {
            console.log(password+" "+confirm_password);
            console.log("Passwords doesn't match");
            return res.redirect("back");
        }

        // check if user already exist
        User.findOne({ email }, async (err, user) => {
            if (err) {
                console.log("Error in finding user while signing up");
                return;
            }

            if (!user) {
                await User.create(
                    {
                        email,
                        password,
                        username,
                    },
                    (err, user) => {
                        if (err) {
                            console.log("Error in signing Up");
                        }
                        return res.redirect("/");
                    }
                );
            } else {
                console.log("Error :", "Email already registed!");
                return res.redirect("back");
            }
        });
    } catch (err) {

        console.log(err, " Error in creating new user");
    }
};

// sign in and create a session for the user
module.exports.createSession = (req, res) => {
    return res.redirect("/dashboard");
};

// clears the cookie
module.exports.destroySession = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect("/");
    });
};
