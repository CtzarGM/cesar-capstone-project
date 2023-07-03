import mongoose from "mongoose";

const { Schema } = mongoose;

const customizationSchema = new Schema({
    name: String,
    image: String,
});

const Customization = mongoose.models.Customization || mongoose.model("Customization", customizationSchema);

export default Customization;