import Joi from "joi";

const productValidation = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  image: Joi.string().uri().required(),
  category: Joi.string().required(),
  stockQuantity: Joi.number().required().min(1).required(),
  is_Listed: Joi.optional(),
  is_deleted: Joi.optional(),
});

export default productValidation;
