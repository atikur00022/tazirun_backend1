export const AllProductDetailByCampaignService = async (
    Request,
    DataModel,
    MatchQuery,
    SearchArray,
    JoinStage1,
    JoinStage2,
    UnwindBrandStage,
    UnwindCategoryStage,
    Projection
) => {
    try {
        const pageNo = Number(Request.params.pageNo);
        const perPage = Number(Request.params.perPage);
        const searchValue = Request.params.searchKeyword;
        let skipRow = (pageNo - 1) * perPage;

        let data;
        if (searchValue !== "0") {
            let searchQuery = { $or: SearchArray };
            data = await DataModel.aggregate([
                { $match: MatchQuery },
                { $match: searchQuery },
                JoinStage1,
                JoinStage2,
                UnwindBrandStage,
                UnwindCategoryStage,
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }, Projection],
                    }
                }
            ]);
        } else {
            data = await DataModel.aggregate([
                { $match: MatchQuery },
                JoinStage1,
                JoinStage2,
                UnwindBrandStage,
                UnwindCategoryStage,
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }, Projection],
                    }
                }
            ]);
        }

        return {
            status: "success",
            data: data,
            message: "Products fetched successfully"
        };
    } catch (e) {
        return {
            status: "fail",
            message: e.toString()
        };
    }
}