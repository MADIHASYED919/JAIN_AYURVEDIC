const mongoose=require("mongoose")


const product=require("../models/product.js")

const initData=require("./data.js")
async function ConnectDB() {
   await mongoose.connect("mongodb://127.0.0.1:27017/jain-store")
}
ConnectDB().then((res)=>{
    console.log("connection successful!")
})
.catch((err)=>{
    console.log(err)
})

const initDB=async()=>{

//     // here initData is an object to print inside of object array we want to write .data (initData.data)

//     // await listing.deleteMany({ })
  
// // await review.deleteMany({});
    
// // initData.data=initData.data.map((obj)=>({...obj,  owner: new mongoose.Types.ObjectId("69ec383dd46ed37eb6940dce")}))

//     await product.insertMany(initData.data)
//     console.log(initData.data)
//     console.log(Array.isArray(initData))



  try {
    // ⚠️ IMPORTANT (avoid duplicates)
    await product.deleteMany({});

    // ✅ INSERT DATA
    await product.insertMany(initData.data);

    console.log(initData.data);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};




initDB()

