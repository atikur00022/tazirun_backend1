import DataModel from "../../models/slider/SliderModel.js";
import {ListService} from "../../services/common/ListService.js";
import {DetailsByIdService} from "../../services/common/DetailsByIdService.js";
import {GetAllSliderService} from "../../services/common/GetAllSliderService.js";
import {CreateSliderService} from "../../services/slider/CreateSliderService.js";
import {UpdateSliderService} from "../../services/slider/UpdateSliderService.js";
import {DeleteSliderService} from "../../services/slider/DeleteSliderService.js";


// Create
export const CreateSlider = async (req, res) => {
    const result = await CreateSliderService(req, res);
    res.json(result);
}

// Update
export const UpdateSlider = async (req, res) => {
    const result = await UpdateSliderService(req, res);
    res.json(result);
}

// Get All Slider
export const AllSlider = async (req, res) => {
    const result = await GetAllSliderService(req, DataModel);
    res.json(result);
}

// Slider List
export const SliderList = async (req, res) => {
    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [{title: SearchRegx},{shortDes: SearchRegx}];
    const result = await ListService(req, DataModel, SearchArray);
    res.json(result);
}

// Details
export const SliderDetails = async (req, res) => {
    const result = await DetailsByIdService(req, DataModel);
    res.json(result);
}

// Delete
export const DeleteSlider = async (req, res) => {
    const result = await DeleteSliderService(req, res);
    res.json(result);
}