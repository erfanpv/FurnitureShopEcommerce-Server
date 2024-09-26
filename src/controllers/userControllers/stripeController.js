import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import cartDb from "../../models/schemas/cartSchema.js";
import productDb from "../../models/schemas/productSchema.js";
import orderDb from "../../models/schemas/orderSchema.js";
import paymentSession from "../../models/schemas/paymentSession.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let paymentData = {};

export const stripeIntent = async (req, res) => {
  try {
    const userId = req.params.id;
    const { cartId } = req.body;
    console.log(cartId);
    
    // let paymentProductData = new Map();

    // if (cartId) {
    //   paymentProductData.set("cartId", cartId);
    // } else if (products) {
    //   paymentProductData.set("products", products);
    // }

    let productDetails;
    let totalAmount = 0;
    let lineItems = [];

    if (cartId) {
      productDetails = await cartDb.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(cartId) } },
      ]);

      if (
        !productDetails.length ||
        productDetails[0].userId.toString() !== userId
      ) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid cart or user" });
      }

      const cartProducts = productDetails[0].products;

      lineItems = (
        await Promise.all(
          cartProducts.map(async (item) => {
            const product = await productDb.findById(item.productId);
            if (product) {
              totalAmount += product.price * item.quantity;
              return {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: product.productName,
                    description: product.description,
                    images: [product.image],
                  },
                  unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
              };
            }
            return null;
          })
        )
      ).filter((item) => item !== null);
    } 
    // else if (products) {
    //   const { productId, quantity } = products;

    //   const productDetails = await productDb.findById(productId);

    //   if (productDetails) {
    //     totalAmount += productDetails.price * quantity;

    //     lineItems.push({
    //       price_data: {
    //         currency: "inr",
    //         product_data: {
    //           name: productDetails.productName,
    //           description: productDetails.description,
    //           images: [productDetails.image],
    //         },
    //         unit_amount: Math.round(productDetails.price * 100),
    //       },
    //       quantity: quantity,
    //     });
    //   } else {
    //     return res
    //       .status(400)
    //       .json({ success: false, error: "Product not found" });
    //   }
    // }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      success_url: `http://localhost:3000/api/users/payment/success/${userId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/products/cart/mycart",
    });

    // const existingSession = await paymentSession.findOne({ userId });

    // if (existingSession) {

    //   existingSession.paymentData.push({
    //     sessionId: session.id,
    //     pa,
    //     totalAmount,
    //   });
    //   await existingSession.save();
    // } else {
      
    //    paymentData = {
    //     sessionId: session.id,
    //     cartId: cartId,
    //     totalAmount,
    //   }
      

    //   try {
    //     await paymentSession.create({
    //       userId,
    //       paymentData: [paymentData],
    //     });
    //   } catch (error) {
    //     console.error("Error while creating payment session:", error);
    //   }
    // }
    paymentData = {
      sessionId: session.id,
      cartId: cartId,
      totalAmount,
    }
    

    if (!session) {
      return res.status(500).json({success: false,message: "Error occurred while creating session" })}

    res.status(200).json({success: true,message: "Stripe payment session created successfully",url: session.url,});
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: `Payment Failed - ${error.message}` });
  }
};

export const successPayment = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [session, lineItems] = await Promise.all([
      stripe.checkout.sessions.retrieve(req.query.session_id, {
        expand: ["payment_intent.payment_method"],
      }),
      stripe.checkout.sessions.listLineItems(req.query.session_id),
    ]);

    console.log(session);
    
    // const existingSession = await paymentSession.findOne({
    //   userId,
    //   "paymentData.sessionId": session.id,
    // });

    let cartId;
    let totalAmount = 0;
    let products;
    console.log(paymentData);

    if (paymentData) {
      // const paymentProductData = paymentData?.paymentProductData;
      // products = paymentProductData.products;
      totalAmount = paymentData?.totalAmount;
      cartId = paymentData?.cartId;

    }
    // else {
    //   const paymentInfo = existingSession.paymentData.find((data) => data.sessionId === session.id);      
    //   const paymentProductData = paymentInfo?.paymentProductData;
    //   totalAmount = paymentInfo?.totalAmount;
    //   // products = paymentProductData.products;
    //   cartId = paymentProductData?.cartId;
    // }

    if (cartId) {
      
      let cart = await cartDb.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(cartId) } },
      ]);

      const cartProducts = await cart[0].products;

      let orderData = await orderDb.findOne({ userId });

      const orderDetails = {
        orderId: session.id,
        paymentId: userId + Date.now(),
        products: cartProducts,
        total: totalAmount,
        status: "Placed",
        shippingAddress: session.customer_details.address,
        orderUsermail: session.customer_details.email,
        orderedUserName: session.customer_details.name,
        createdAt: new Date(),
      };

      if (!orderData) {
        orderData = new orderDb({ userId, orderDetails: [orderDetails] });
      } else {
        orderData.orderDetails.push(orderDetails);
      }

      await orderData.save();

      //if the order is success the cart is empty
      await cartDb.deleteOne({ _id: new mongoose.Types.ObjectId(cartId) });
    } 
    // else if (products) {
    //   let orderData = await orderDb.findOne({ userId });

    //   const orderDetails = {
    //     orderId: session.id,
    //     products,
    //     total: totalAmount,
    //     status: "Placed",
    //     createdAt: new Date(),
    //   };

    //   if (!orderData) {
    //     orderData = new orderDb({ userId, orderDetails: [orderDetails] });
    //   } else {
    //     orderData.orderDetails.push(orderDetails);
    //   }

    //   await orderData.save();
    // }

    res.status(200).json({success: true,message: "Stripe payment  successfully Completed",});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to retrieve payment details - ${error.message}`,
    });
  }
};

export const cancel = (req, res) => {
  res.redirect("/cart");
};
