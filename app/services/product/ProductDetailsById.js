export const ProductDetailByIdService = async (Request, DataModel, MatchQuery, JoinStage1, JoinStage2, UnwindBrandStage1, UnwindBrandStage2, Projection) => {

    try{

        const data = await DataModel.aggregate([
            JoinStage1,
            JoinStage2,
            UnwindBrandStage1,
            UnwindBrandStage2,
            { $match: MatchQuery },
            Projection
        ]);

        return { status: "success", message: "Request Successful!", data: data };

    }catch (e) {
        return { status: "fail", data: e.toString() };
    }

}