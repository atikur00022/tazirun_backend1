export const GetAllService = async (Request, DataModel) => {

    try{

        const data = await DataModel.aggregate([
            { $match: {  } },
        ]);

        return { status: "success", message: "Request Successful!", data: data };


    }catch (e) {
        return { status: "fail", data: e.toString() };
    }

}