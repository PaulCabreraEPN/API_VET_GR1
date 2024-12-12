import mongoose from 'mongoose'; //ODM de mongo

mongoose.set('strictQuery',true);

const connection = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGODV_URI_LOCAL);
        console.log(`Database is connected on ${connection.host} - ${connection.port}`);
    } catch (error) {
        console.log(error);
    }
};

export default connection;