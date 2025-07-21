import mongoose from "mongoose";
import ProductsModel from "../../models/products/ProductsModel.js";

export const AllProductDetailBySearchService = async (Request) => {
    try {
        const searchKeyword = Request.params.keyword;
        const pageNo = Number(Request.params.pageNo);
        const perPage = Number(Request.params.perPage);

        // Search regex
        const SearchRegx = { "$regex": searchKeyword, "$options": "i" };
        const numericSearchValue = isNaN(searchKeyword) ? 0 : Number(searchKeyword);

        // Join stages
        const JoinBrandStage = { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brands" } };
        const JoinCategoryStage = { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categories" } };
        const JoinSubCategoryStage = { $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategories" } };
        const JoinSubSubCategoryStage = { $lookup: { from: "subsubcategories", localField: "subSubCategoryId", foreignField: "_id", as: "subSubCategories" } };

        // Unwind stages
        const UnwindBrandStage = { $unwind: { path: "$brands", preserveNullAndEmptyArrays: true } };
        const UnwindCategoryStage = { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } };
        const UnwindSubCategoryStage = { $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true } };
        const UnwindSubSubCategoryStage = { $unwind: { path: "$subSubCategories", preserveNullAndEmptyArrays: true } };

        // Match stage after joins
        const MatchStage = {
            $match: {
                $or: [
                    { name: SearchRegx },
                    { details: SearchRegx },
                    { unit: SearchRegx },
                    { size: SearchRegx },
                    { remark: SearchRegx },
                    { specification: SearchRegx },
                    { price: numericSearchValue },
                    { "brands.name": SearchRegx },
                    { "categories.name": SearchRegx },
                    { "subCategories.name": SearchRegx },
                    { "subSubCategories.name": SearchRegx }
                ]
            }
        };

        // Projection
        const Projection = {
            $project: {
                name: 1,
                price: 1,
                discount: 1,
                discountPrice: 1,
                stock: 1,
                remark: 1,
                unit: 1,
                image1: 1,
                "brands.name": 1,
                "categories.name": 1,
                "subCategories.name": 1,
                "subSubCategories.name": 1
            }
        };

        const skipRow = (pageNo - 1) * perPage;

        const data = await ProductsModel.aggregate([
            JoinBrandStage,
            JoinCategoryStage,
            JoinSubCategoryStage,
            JoinSubSubCategoryStage,
            UnwindBrandStage,
            UnwindCategoryStage,
            UnwindSubCategoryStage,
            UnwindSubSubCategoryStage,
            MatchStage,
            {
                $facet: {
                    Total: [{ $count: "count" }],
                    Rows: [
                        { $skip: skipRow },
                        { $limit: perPage },
                        Projection
                    ]
                }
            }
        ]);

        return {
            status: "success",
            message: "Request Successful!",
            data: data
        };

    } catch (error) {
        return { status: "fail", message: error.message };
    }
};