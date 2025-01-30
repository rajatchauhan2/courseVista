const tag = require('../models/tags.models');



exports.createTag = async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:'Please provide all details'
            });
        }

        const tagDetails = await tag.create({
            name:name,
            description:description
        })
        console.log(tagDetails);

        return res.status(200).json({
            success:true,
            message:'Tag created successfully',
            data:tagDetails
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
    
}

//get Alltag handler function


exports.getAllTags = async (req, res) => {
    try {
        const allTags = await tag.find({},{name:true, description:true});
        return res.status(200).json({
            success: true,
            message: 'All tags fetched successfully',
            data: allTags
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        
    }
}
