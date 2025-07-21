export const ProductDetailByRemarkService = async (Request, DataModel, MatchQuery, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2) => {

    try{

        const data = await DataModel.aggregate([
            JoinStage1,
            JoinStage2,
            UnwindBrandStage1,
            UnwindBrandStage2,
            { $match: MatchQuery },
            { $sort: { _id: -1 } },
            { $limit: 12 }
        ]);

        return { status: "success", message: "Request Successful!", data: data };

    }catch (e) {
        return { status: "fail", data: e.toString() };
    }

}