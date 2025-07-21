import DataModel from "../../models/products/ProductsModel.js";
import ReturnsProductModel from "../../models/returns/ReturunsProductModel.js";
import PurchasesProductModel from "../../models/purchases/PurchasesProductModel.js";
import SalesProductModel from "../../models/sales/SalesProductModel.js";
import SliderModel from "../../models/slider/SliderModel.js";
import {ListTwoJoinService} from "../../services/common/ListTwoJoinService.js";
import {ObjectId} from "mongodb";
import {CheckAssociateService} from "../../services/common/CheckAssociateService.js";
import {DropdownService} from "../../services/common/DropDownService.js";
import {CreateProductService} from "../../services/product/CreateProductService.js";
import {ProductDetailByRemarkService} from "../../services/product/ProductDetailByRemarkService.js";
import {ProductDetailByIdService} from "../../services/product/ProductDetailsById.js";
import {AllProductDetailByRemarkService} from "../../services/product/AllProductDetailByRemarkService.js";
import {AllProductDetailByCategoryService} from "../../services/product/AllProductDetailByCategoryService.js";
import {AllProductDetailByBrandService} from "../../services/product/AllProductDetailByBrandService.js";
import {AllProductDetailBySliderService} from "../../services/product/AllProductDetailBySliderService.js";
import {UpdateProductService} from "../../services/product/UpdateProductService.js";
import {ProductDeleteService} from "../../services/product/ProductDeleteService.js";
import {AllProductDetailByCampaignService} from "../../services/product/AllProductDetailByCampaignService.js";
import ProductsModel from "../../models/products/ProductsModel.js";
import {AllProductDetailBySearchService} from "../../services/product/AllProductDetailBySearchService.js";

// Create
export const CreateProduct = async (req, res) => {
    const result = await CreateProductService(req, res);
    res.json(result);
}

// Update
export const UpdateProduct = async (req, res) => {
    const result = await UpdateProductService(req, res);
    res.json(result);
}

// Product Details By Remark
export const ProductDetailByRemark = async (req, res) => {

    const remark = req.params['remark'];
    const MatchQuery = { remark: remark };

    const JoinStage1 = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
    const JoinStage2 = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage1 = { $unwind: "$brands" };
    const UnwindBrandStage2 = { $unwind: "$categories" };

    const result = await ProductDetailByRemarkService(req, DataModel, MatchQuery, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2);
    res.json(result);
}

// All Product Details By Remark
export const AllProductDetailByRemark = async (req, res) => {

    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [{name: SearchRegx}, {details: SearchRegx}, {unit: SearchRegx}, {"brands.name" : SearchRegx}, {"categories.name" : SearchRegx}];

    const remark = req.params['remark'];
    const MatchQuery = { remark: remark };

    const JoinStage1 = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
    const JoinStage2 = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage1 = { $unwind: "$brands" };
    const UnwindBrandStage2 = { $unwind: "$categories" };

    const Projection = { $project: { image2: 0, image3: 0, image4: 0, image5: 0, brandId: 0, categoryId: 0, subCategoryId: 0, subSubCategoryId: 0, createdAt: 0, updatedAt: 0, 'brands.image': 0, 'brands.createdAt': 0, 'brands.updatedAt': 0, 'categories.image': 0, 'categories.createdAt': 0, 'categories.updatedAt': 0, } }

    const result = await AllProductDetailByRemarkService(req, DataModel, MatchQuery, SearchArray, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2, Projection);
    res.json(result);
}

// All Product Details By Category
export const AllProductDetailByCategory = async (req, res) => {

    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [{name: SearchRegx}, {details: SearchRegx}, {unit: SearchRegx}, {"brands.name" : SearchRegx}, {"categories.name" : SearchRegx}];

    const id = new ObjectId(req.params['id']);
    const MatchQuery = { subSubCategoryId: id };

    const JoinStage1 = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
    const JoinStage2 = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage1 = { $unwind: "$brands" };
    const UnwindBrandStage2 = { $unwind: "$categories" };

    const Projection = { $project: { image2: 0, image3: 0, image4: 0, image5: 0, brandId: 0, categoryId: 0, subCategoryId: 0, subSubCategoryId: 0, createdAt: 0, updatedAt: 0, 'brands.image': 0, 'brands.createdAt': 0, 'brands.updatedAt': 0, 'categories.image': 0, 'categories.createdAt': 0, 'categories.updatedAt': 0, } }

    const result = await AllProductDetailByCategoryService(req, DataModel, MatchQuery, SearchArray, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2, Projection);
    res.json(result);
}

// All Product Details By Brand
export const AllProductDetailByBrand = async (req, res) => {

    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [{name: SearchRegx}, {details: SearchRegx}, {unit: SearchRegx}, {"brands.name" : SearchRegx}, {"categories.name" : SearchRegx}];

    const id = new ObjectId(req.params['id']);
    const MatchQuery = { brandId: id };

    const JoinStage1 = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
    const JoinStage2 = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage1 = { $unwind: "$brands" };
    const UnwindBrandStage2 = { $unwind: "$categories" };

    const Projection = { $project: { image2: 0, image3: 0, image4: 0, image5: 0, brandId: 0, categoryId: 0, subCategoryId: 0, subSubCategoryId: 0, createdAt: 0, updatedAt: 0, 'brands.image': 0, 'brands.createdAt': 0, 'brands.updatedAt': 0, 'categories.image': 0, 'categories.createdAt': 0, 'categories.updatedAt': 0, } }

    const result = await AllProductDetailByBrandService(req, DataModel, MatchQuery, SearchArray, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2, Projection);
    res.json(result);
}

// All Product Details By Campaign
export const AllProductDetailByCampaign = async (req, res) => {
    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [
        {name: SearchRegx},
        {details: SearchRegx},
        {unit: SearchRegx},
        {"brands.name": SearchRegx},
        {"categories.name": SearchRegx}
    ];

    const campaignId = new ObjectId(req.params.id);
    const MatchQuery = { campaignId: campaignId };

    const JoinStage1 = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
    const JoinStage2 = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage = { $unwind: { path: "$brands", preserveNullAndEmptyArrays: true } };
    const UnwindCategoryStage = { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } };

    const Projection = {
        $project: {
            brandId: 0,
            categoryId: 0,
            subCategoryId: 0,
            subSubCategoryId: 0,
            'brands.image': 0,
            'brands.createdAt': 0,
            'brands.updatedAt': 0,
            'categories.image': 0,
            'categories.createdAt': 0,
            'categories.updatedAt': 0,
        }
    };

    const result = await AllProductDetailByCampaignService(
        req,
        ProductsModel,
        MatchQuery,
        SearchArray,
        JoinStage1,
        JoinStage2,
        UnwindBrandStage,
        UnwindCategoryStage,
        Projection
    );

    res.json(result);
}

// All Product Details By Slider
export const AllProductDetailBySlider = async (req, res) => {

    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [{name: SearchRegx}, {details: SearchRegx}, {unit: SearchRegx}, {"brands.name" : SearchRegx}, {"categories.name" : SearchRegx}];

    const id = new ObjectId(req.params['id']);
    const MatchQuery = { productId: id };

    const JoinStage1 = { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "products" } };
    const JoinStage2 = { $lookup: { from: "brands", localField: "products.brandId", foreignField: "_id", as: "brands" } };
    const JoinStage3 = { $lookup: { from: "categories", localField: "products.categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage1 = { $unwind: "$products" };
    const UnwindBrandStage2 = { $unwind: "$brands" };
    const UnwindBrandStage3 = { $unwind: "$categories" };

    const Projection = { $project: { image: 0, productId: 0, createdAt: 0, updatedAt: 0, 'products.image2': 0, 'products.image3': 0, 'products.image4': 0, 'products.image5': 0, 'products.brandId': 0, 'products.categoryId': 0, 'products.subCategoryId': 0, 'products.subSubCategoryId': 0, 'products.details': 0, 'products.createdAt': 0, 'products.updatedAt': 0, 'brands.image': 0, 'brands.createdAt': 0, 'brands.updatedAt': 0, 'categories.image': 0, 'categories.createdAt': 0, 'categories.updatedAt': 0, } }

    const result = await AllProductDetailBySliderService(req, SliderModel, MatchQuery, SearchArray, JoinStage1, JoinStage2, JoinStage3, UnwindBrandStage1, UnwindBrandStage2, UnwindBrandStage3, Projection);
    res.json(result);
}

// All Product Details By Search
export const AllProductDetailBySearch = async (req, res) => {
    const result = await AllProductDetailBySearchService(req, res);
    res.json(result);
}

// Product List
export const ProductList = async (req, res) => {
    const SearchRegx = { "$regex": req.params.searchKeyword, "$options": "i" };
    const SearchArray = [{name: SearchRegx}, {details: SearchRegx}, {unit: SearchRegx}, {"brands.name" : SearchRegx}, {"categories.name" : SearchRegx}];

    const JoinStage1 = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
    const JoinStage2 = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage1 = { $unwind: "$brands" };
    const UnwindBrandStage2 = { $unwind: "$categories" };

    const Projection = { $project: { image2: 0, image3: 0, image4: 0, image5: 0, createdAt: 0, updatedAt: 0, 'brands.image': 0, 'brands.createdAt': 0, 'brands.updatedAt': 0, 'categories.image': 0, 'categories.createdAt': 0, 'categories.updatedAt': 0, } }

    const result = await ListTwoJoinService(req, DataModel, SearchArray, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2, Projection);
    res.json(result);
}

// Delete
export const DeleteProduct = async (req, res) => {

    const id = new ObjectId(req.params['id']);

    const checkReturnAssociate = await CheckAssociateService({productId: id}, ReturnsProductModel);
    const checkPurchaseAssociate = await CheckAssociateService({productId: id}, PurchasesProductModel);
    const checkSalesAssociate = await CheckAssociateService({productId: id}, SalesProductModel);

    if(checkReturnAssociate){
        res.status(200).json({status: "associate", message: "Associate with Return!"});
    }else if(checkPurchaseAssociate){
        res.status(200).json({status: "associate", message: "Associate with Purchase!"});
    }else if(checkSalesAssociate){
        res.status(200).json({status: "associate", message: "Associate with Sale!"});
    }else{
        const result = await ProductDeleteService(req, res);
        res.json(result);
    }
}

// Details
export const ProductDetails = async (req, res) => {

    const id = new ObjectId(req.params['id']);
    const MatchQuery = { _id: id };

    const JoinStage1 = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
    const JoinStage2 = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };

    const UnwindBrandStage1 = { $unwind: "$brands" };
    const UnwindBrandStage2 = { $unwind: "$categories" };

    const Projection = { $project: { createdAt: 0, updatedAt: 0, 'brands.image': 0, 'brands.createdAt': 0, 'brands.updatedAt': 0, 'categories.image': 0, 'categories.createdAt': 0, 'categories.updatedAt': 0, } }

    const result = await ProductDetailByIdService(req, DataModel, MatchQuery, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2, Projection);
    res.json(result);
}

// DropDown
export const ProductDropDown = async (req, res) => {
    const result = await DropdownService(req, DataModel, {_id: 1, name: 1});
    res.json(result);
}