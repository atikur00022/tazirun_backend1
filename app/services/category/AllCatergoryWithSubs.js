export const AllCategoryWithSubs = async (req, DataModel) => {
    try {
        const data = await DataModel.aggregate([
            // Stage 1: Single lookup to get subcategories and products in parallel
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "subcategories",
                    pipeline: [
                        // Stage 1a: Get subsubcategories for each subcategory
                        {
                            $lookup: {
                                from: "subsubcategories",
                                localField: "_id",
                                foreignField: "subCategoryId",
                                as: "subsubcategories",
                                pipeline: [
                                    { $project: { _id: 1, name: 1, subCategoryId: 1, image: 1 } }
                                ]
                            }
                        },
                        // Stage 1b: Get products for each subcategory (where subSubCategoryId is null)
                        {
                            $lookup: {
                                from: "products",
                                let: { subCatId: "$_id", catId: "$categoryId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$subCategoryId", "$$subCatId"] },
                                                    { $eq: ["$subSubCategoryId", null] }
                                                ]
                                            }
                                        }
                                    },
                                    { $project: productProjection }
                                ],
                                as: "products"
                            }
                        },
                        // Stage 1c: Get products for each subsubcategory
                        {
                            $addFields: {
                                subsubcategories: {
                                    $map: {
                                        input: "$subsubcategories",
                                        as: "subsub",
                                        in: {
                                            $mergeObjects: [
                                                "$$subsub",
                                                {
                                                    products: {
                                                        $let: {
                                                            vars: { subsubId: "$$subsub._id" },
                                                            in: {
                                                                $filter: {
                                                                    input: "$products",
                                                                    as: "prod",
                                                                    cond: { $eq: ["$$prod.subSubCategoryId", "$$subsubId"] }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        { $project: subcategoryProjection }
                    ]
                }
            },
            // Stage 2: Get products that belong directly to category (no subcategory)
            {
                $lookup: {
                    from: "products",
                    let: { catId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$categoryId", "$$catId"] },
                                        { $eq: ["$subCategoryId", null] }
                                    ]
                                }
                            }
                        },
                        { $project: productProjection }
                    ],
                    as: "categoryProducts"
                }
            },
            // Stage 3: Final projection
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    products: "$categoryProducts",
                    subcategories: 1
                }
            }
        ]);

        return {
            status: "success",
            message: "Request Successful!",
            data: data
        };
    } catch (e) {
        console.error("Error in AllCategoryWithSubs:", e);
        return {
            status: "fail",
            message: "Something went wrong!",
            error: e.message
        };
    }
};

// Reusable projection definitions
const productProjection = {
    _id: 1,
    name: 1,
    price: 1,
    discount: 1,
    discountPrice: 1,
    image1: 1,
    image2: 1,
    image3: 1,
    image4: 1,
    image5: 1,
    stock: 1,
    size: 1,
    colorVariants: 1,
    details: 1,
    specification: 1,
    unit: 1,
    remark: 1
};

const subcategoryProjection = {
    _id: 1,
    name: 1,
    categoryId: 1,
    image: 1,
    products: 1,
    subsubcategories: {
        _id: 1,
        name: 1,
        subCategoryId: 1,
        image: 1,
        products: 1
    }
};