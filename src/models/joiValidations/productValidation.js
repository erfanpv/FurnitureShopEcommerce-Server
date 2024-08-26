import Joi from "joi";

const productValidation = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().optional().required(),
  price: Joi.number().required(),
  image: Joi.string().optional().uri().required(),
  category: Joi.string().required(),
  stockQuantity: Joi.number().optional().min(0).required(),
});

export default productValidation;
