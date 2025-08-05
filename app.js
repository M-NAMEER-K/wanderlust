const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const mongoose=require("mongoose");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const Listing =require("./models/listing.js");
const initData=require("./init/data.js");
if(process.env.NODE_ENV!="production"){
require("dotenv").config();}

MONGODB_URL=process.env.DATABASE_URL;
   async function main(){
     await mongoose.connect(MONGODB_URL);
    await  initDB();
   }

   const initDB= async ()=>{
    await Listing.deleteMany({});
      initData.data=initData.data.map((obj)=>({...obj,owner:'68919ddb476a88a8107ea106'}));
    await Listing.insertMany(initData.data);
    console.log("data is initialised");
   };

main()
.then(()=>{
  console.log("Database connected successfully");
})
.catch((err)=>{
  console.error(err);
});



   

   //set ejs engine

   app.set("view engine","ejs");
   app.set("views",path.join(__dirname,"views"));
   app.use(express.urlencoded({extended:true}));
   app.use(methodOverride("_method"));
  app.engine("ejs",ejsMate);
  app.use(express.static(path.join(__dirname,"/public")));

 const store=MongoStore.create({
    mongoUrl: MONGODB_URL,
    crypto:{
      secret:process.env.SECRET,
      touchAfter: 24 *3600
    }
  });
  store.on("error",()=>{console.log("ERROR IN MONGO SESSION STORE",err)});
  const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now() + 7* 24 * 60 * 60* 1000, 
    httpOnly:true   }
  }
 
   app.use(session(sessionOptions));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  app.use((req,res,next)=>{
    res.locals.currUser=req.user;
      res.locals.success=req.flash("success");
      res.locals.error=req.flash("error");
      next();
  });

  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);
 
 
/* 
app.all("*",(req,res,next)=>{
       next(new ExpressError(404,"Page not found"));
});
*/
app.use((err,req,res,next)=>{
      let {status=500, message="Something went wrong"}=err;

          res.status(status).render("error",{status,message});
});


app.listen(8080,()=>{
    console.log("App is listening on port 8080");
});