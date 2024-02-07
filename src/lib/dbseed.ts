// // db.ts

// import mongoose from "mongoose";
// require('dotenv').config();

// if (!process.env.MONGO_URL) {
//   throw new Error("Please add the MONGO_URL environment variable");
// }

// // Exporting the connect function
// export async function connect() {
//   try {
//     if (!process.env.MONGO_URL) {
//       throw new Error("MONGO_URL environment variable is not defined");
//     }

//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("✅ mongodb connected successfully");
//   } catch (error) {
//     console.error("❌ mongodb connection error:", error);
//   }
// }

// mongoose.Promise = Promise;
