import dbConnect from "../../../db/connect";
import Customization from "../../../db/models/Customization";

export default async function handler(request, response) {
    await dbConnect();

    if (request.method === "GET") {
        const customs = await Customization.find();
        return response.status(200).json(customs);
    }
}