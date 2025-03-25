import mongoose from "mongoose";

const DBconnect = async () => {
	const mongoUri = process.env.MONGO_URI as string;
	try{
		const conn = await mongoose.connect(mongoUri);
		console.log(`database connected - ${conn.connection.host}`);
	} catch(error){
		console.log(`error connwcting to database - ${error}`);
		process.exit(1);
	}
}

export default DBconnect;
