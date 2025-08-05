const mongoose=require("mongoose");
const Review=require("./review.js");
const Schema= mongoose.Schema;


const listingSchema = new Schema({

    title:{
        type:String,
        required:true
    }
    ,
    description:{
        type:String,
        required:true
    }
    ,image:{
        url:String,
        filename:String    
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        required:true,
        type:String
    },
    country:{
        required:true,
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"

        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
   category: {
  type: String,
  enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castle", "Amazing Pools", "Camping", "Farms", "Arctic"]
}

});

      listingSchema.post("findOneAndDelete",async (listing)=>{
        if(listing){
              await Review.deleteMany({_id : {$in : listing.reviews}});
        }
      })

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;