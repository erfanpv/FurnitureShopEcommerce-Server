import Joi from "joi";
import mongoose from "mongoose";

const productValidation = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().optional().required(),
  price: Joi.number().required(),
  image: Joi.string().optional().uri().required(),
  catogory: Joi.string().required(),
  is_Listed: Joi.boolean().default(true),
  stockQuantity: Joi.number().optional().min(0).required(),
  date: Joi.date().default(() => new Date(), "current date"),
});

const productSchema = mongoose.model("Product", productValidation);
export default productSchema;
