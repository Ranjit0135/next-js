import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number;
}
const connection : ConnectionObject = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected")
        return
    }
    try {
      const db =   await mongoose.connect(process.env.MONGOBD_URI || "",{})
      console.log(db,"connection")
connection.isConnected = db.connections[0].readyState
console.log(db.connections[0].readyState,"hello connection")
console.log("db is connected")
    } catch (error) {
        console.log("Failed to connect database: " + error)
        process.exit(1)
    }

}
export default  dbConnect