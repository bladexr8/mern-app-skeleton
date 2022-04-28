import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

// route('/auth/signin').post(authCtrl.signin)
const signin = async (req, res) => { 
    try {
        let user = await User.findOne({ "email": req.body.email })
        if (!user) {
            return res.status('401').json({ error: 'User Not Found '})
        }

        if (!user.authenicate(req.body.password)) {
            return res.status('401').send({ error: "Login Failed - Invalid User Credentials" })
        }

        const token = jwt.sign({ _id: user._id }, config.jwtSecret)

        res.cookie('t', token, { expire: new Date() + 365 })

        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        return res.status('401').json({ error: "Could not sign in" })
    }
 }

// route('/auth/signout').get(authCtrl.signout)
const signout = (req, res) => { 
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
 }

// const requireSignin = () => { return true }
// verify that the incoming request has a valid JWT in the Authorization header.
const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth'
}) 

// make sure the requesting user is only updating or deleting their own user information.
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth 
          && req.profile._id ==  req.auth._id
    if (!(authorized)) {
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

export default { signin, signout, requireSignin, hasAuthorization }