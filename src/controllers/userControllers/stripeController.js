import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import cartDb from "../../models/schemas/cartSchema.js";
import productDb from "../../models/schemas/productSchema.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeIntent = async (req, res) => {
 try {

  const userId = req.params.id;
  const {products , cartId} = req.body;
  
  let productDetails;
  let totalAmount = 0;
  let lineItems;
  if (cartId) {    

    productDetails = await cartDb.aggregate([ { $match: { _id: new mongoose.Types.ObjectId(cartId) } } ]);
    
    if (!productDetails.length || productDetails[0].userId.toString() !== userId) {
      return res.status(400).json({ success: false, error: "Invalid cart or user" });
    }

    const cartProducts = await productDetails[0].products;

     lineItems = await cartProducts.map((item) => {
      const product =  productDb.findById(item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
      
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productName,
          description: item.description,
          category:item.category,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    };
    })
 
    

  }else if (products) {
    
    const productIds = products.map((product) => product.productId);
    productDetails = await productDb.find({ _id: { $in: productIds } });

  lineItems =  products.map((product) => {
      const paymentProduct= productDetails.find((p) => p._id.equals(product.productId));
      if (paymentProduct) {
        totalAmount += paymentProduct.price * product.quantity; 
      }

      
    });

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: paymentProduct.productName,
          description: paymentProduct.description,
          category:paymentProduct.category,
        },
        unit_amount: Math.round(paymentProduct.price * 100),
      },
      quantity: products[0].quantity,
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "https://example.com/success", // Replace with actual success URL
    cancel_url: "https://example.com/cancel", // Replace with actual cancel URL
  });

  if (!session) {
    return res.status(500).json({ message: "Error occurred while creating session" });
  }

  res.status(200).json({message: "Stripe payment session created successfully", url: session.url,totalAmount,totalQuantity,});
  
 }catch(error) {
  res.status(500).json({success:false,message:`Payment Failed - ${error.message}`})
 }
}



export const success =  async (req, res) => {
  const result = Promise.all([
      stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
      stripe.checkout.sessions.listLineItems(req.query.session_id)
  ])

  console.log(JSON.stringify(await result))

  res.send('Your payment was successful')
}

export const cancel =  (req, res) => {
  res.redirect('/')
}

