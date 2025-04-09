import { ImageModel } from "../../models/ImageModel.js";



export const uploadImages = async (req, res) => {
    console.log(req.body);
    try {
        const body = req.body;
        console.log("---- files ---", JSON.stringify(req.files));
        const images = req.files.map((file) => (
            {
                mimeType: file.mimetype,
                originalName: file.originalname,
                imageURL: file.path,
                size: file.size
            }
        ));
        console.log(images);
        console.log(body);

        await ImageModel.insertMany(images);
        
        if(body){
            const img = new ImageModel(body);
            await img.save();
        }

        res.status(200)
            .json({
                message: "Files uploaded successfully",
                success: true,
                files: req.files,
            });
    } catch (err) {
        console.log('Error ', err);
        res.status(500).json({
            message: 'Image: Internal server error',
            success: false,
            error: err
        })
    }
}


export const getAllImages = async (req, res) => {
    try {
        const data = await ImageModel.find().sort({ createdAt: -1 });

        console.log('<--- data --> ', data);
        res.status(200)
            .json({
                message: "Images",
                success: true,
                data: data
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err
        })
    }
}


export const getImageDetailById = async (req, res) => {
    console.log(req.params);
    try {
        const { id } = req.params;
        const data = await ImageModel.findOne({ _id: id });
        console.log('<--- data --> ', data);
        res.status(200)
            .json({
                message: "Image Details",
                success: true,
                data: data
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err
        })
    }
}



