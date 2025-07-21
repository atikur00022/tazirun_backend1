import {ObjectId} from "mongodb";
import DataModel from "../../models/categories/CategoriesModel.js";
import {ListService} from "../../services/common/ListService.js";
import {CheckAssociateService} from "../../services/common/CheckAssociateService.js";
import ProductsModel from "../../models/products/ProductsModel.js";
import {DetailsByIdService} from "../../services/common/DetailsByIdService.js";
import {DropdownService} from "../../services/common/DropDownService.js";
import {GetAllService} from "../../services/common/GetAllService.js";
import {AllCategoryWithSubs} from "../../services/category/AllCatergoryWithSubs.js";
import {CreateCategoryService} from "../../services/category/CreateCategoryService.js";
import {UpdateCategoryService} from "../../services/category/UpdateCategoryService.js";
import {CategoryDeleteService} from "../../services/category/CategoryDeleteService.js";

// Create
export const CreateCategory = async (req, res) => {
    const result = await CreateCategoryService(req, res);
    res.json(result);
}

// Update
export const UpdateCategory = async (req, res) => {
    const result = await UpdateCategoryService(req, res);
    res.json(result);
}

// Get All Category
export const AllCategory = async (req, res) => {
    const result = await GetAllService(req, DataModel);
    res.json(result);
}

// Get All Category With Sub Category & Sub Sub-Category
export const AllCatWithSubCatAndSubSubCat = async (req, res) => {
    const result = await AllCategoryWithSubs(req, DataModel);
    res.json(result);
}

// Category List
export const CategoryList = async (req, res) => {
    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [{name: SearchRegx}];
    const result = await ListService(req, DataModel, SearchArray);
    res.json(result);
}

// DropDown
export const CategoryDropDown = async (req, res) => {
    const result = await DropdownService(req, DataModel, {_id: 1, name: 1});
    res.json(result);
}

// Delete
export const DeleteCategory = async (req, res) => {

    const id = new ObjectId(req.params['id']);

    let checkAssociate = await CheckAssociateService({categoryId: id}, ProductsModel);

    if(checkAssociate){
        res.status(200).json({status: "associate", message: "Can't be deleted! Associate with product!"});
    }else{
        const result = await CategoryDeleteService(req, res);
        res.json(result);
    }
}

// Details
export const CategoryDetails = async (req, res) => {
    const result = await DetailsByIdService(req, DataModel);
    res.json(result);
}