import { Request, Response } from "express";
import { Thumbnail } from "../models/thumbnail.model.js";

export async function getUsersThumbnails(request: Request, response: Response) {
    try{

        const {userId} = request.session;
        const thumbnail = await Thumbnail.find({userId}).sort({createdAt: -1});

        response.json({thumbnails: thumbnail});

    }catch(error:any){
        console.log(error);
        response.status(500).json({message: error.message});
    }
}

export async function getThumbnailById(request: Request, response: Response) {
    try{
        const {id} = request.params;
        const {userId} = request.session;

        const thumbnail = await Thumbnail.findOne({_id: id, userId});

        response.json({thumbnail});

    }catch(error:any){
        console.log(error);
        response.status(500).json({message: error.message});
    }
}
