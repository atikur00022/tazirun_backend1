import {ObjectId} from "mongodb";
import CartModel from "../../models/cart/CartModel.js";

export const CartListService = async (req) => {
    try {

        let userId = new ObjectId(req.headers['user_id'])
        let matchStage={$match:{userId:userId}}

        let JoinStageProduct = {$lookup: {from:"products", localField:"productId", foreignField:"_id", as:"products"}}
        let unwindProductStage = {$unwind:"$products"}

        let JoinStageBrand = {$lookup : {from:"brands", localField:"products.brandId", foreignField:"_id", as:"brands"}}
        let unwindBrandStage = {$unwind:"$brands"};

        let JoinStageCategory = {$lookup:{from:"categories", localField:"products.categoryId", foreignField:"_id", as:"categories"}}
        let unwindCategoryStage = {$unwind:"$categories"};

        let JoinStageSubCategory = {$lookup:{from:"subcategories", localField:"products.subCategoryId", foreignField:"_id", as:"subcategories"}}
        let unwindSubCategoryStage = {$unwind:"$subcategories"};

        let JoinStageSubSubCategory = {$lookup:{from:"subsubcategories", localField:"products.subSubCategoryId", foreignField:"_id", as:"subsubcategories"}}
        let unwindSubSubCategoryStage = {$unwind:"$subsubcategories"};

        let projectionStage={
            $project:{
                'userId':0,'createdAt':0,'updatedAt':0, 'products._id':0,
                'categoryId':0,'brandId':0,
                'subCategoryId':0,'subSubCategoryId':0,
                'brands._id':0,'categories._id':0,
                'subcategories._id':0,'subsubcategories._id':0,
            }
        }

        let data = await CartModel.aggregate([
            matchStage,
            JoinStageProduct,
            unwindProductStage,
            JoinStageBrand,
            unwindBrandStage,
            JoinStageCategory,
            unwindCategoryStage,
            // JoinStageSubCategory,
            // unwindSubCategoryStage,
            // JoinStageSubSubCategory,
            // unwindSubSubCategoryStage,
            projectionStage,
        ])

        let totalCount = await CartModel.countDocuments({ userId });

        return {status:"success", message: "Request Successful!",  total: totalCount, data:data}

    }catch (e) {
        return {status:"fail",message:"Something Went Wrong !"}
    }
}