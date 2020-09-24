const express=require('express')
const dotenv=require('dotenv')
const morgan=require('morgan')
const path=require('path')
const expressLayouts=require('express-ejs-layouts')
const methodOverride=require('method-override')
const passport=require('passport')
const session=require('express-session')
const MongoStore=require('connect-mongo')(session)
const mongoose=require('mongoose')
const connectDB=require('./config/db')
// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport);

// connect to Database by method in db.js
connectDB()

const app=express()

// Body Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json()) 

//Method override 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//Logging 
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// set view engine for ejs
app.use(expressLayouts)
app.set('layout','layouts/main')
app.set('view engine','ejs')

// Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new MongoStore({ mongooseConnection: mongoose.connection})
  }))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname,'public')))

// Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

// Listen to port
const PORT=process.env.PORT||5000

app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))