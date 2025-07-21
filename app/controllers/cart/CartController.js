import {CartListService} from "../../services/cart/CartListService.js";
import {SaveCartListService} from "../../services/cart/SaveCartListService.js";
import {UpdateCartListService} from "../../services/cart/UpdateCartList.js";
import {RemoveCartListService} from "../../services/cart/RemoveCartListService.js";

// Cart List
export const CartList = async (req, res) => {
    const result = await CartListService(req, res);
    res.json(result);
}

// Save Cart List
export const SaveCartList = async (req, res) => {
    const result = await SaveCartListService(req, res);
    res.json(result);
}

// Update Cart List
export const UpdateCartList = async (req, res) => {
    const result = await UpdateCartListService(req, res);
    res.json(result);
}

// Delete Cart List
export const DeleteCartList = async (req, res) => {
    const result = await RemoveCartListService(req, res);
    res.json(result);
}