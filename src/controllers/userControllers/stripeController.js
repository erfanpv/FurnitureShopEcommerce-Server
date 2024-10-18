import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import cartDb from "../../models/schemas/cartSchema.js";
import productDb from "../../models/schemas/productSchema.js";
import orderDb from "../../models/schemas/orderSchema.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let paymentData = {};

export const stripeIntent = async (req, res) => {
  try {
    const userId = req.params.id;
    const { cartId } = req.body;

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
        return res.status(400).json({ success: false, error: "Invalid cart or user" });
      }

      const cartProducts = productDetails[0].products;

      lineItems = (
        await Promise.all(
          cartProducts.map(async (item) => {
            const product = await productDb.findById(item.productId);
            if (product) {
              totalAmount += product.price * 0.1  + product.price
              return {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: product.productName,
                    description: product.description,
                    images: [product.image],
                  },
                  unit_amount: Math.round(((product.price * 100)*0.1) +product.price * 100),
                },
                quantity: item.quantity,
              };
            }
            return null;
          })
        )
      ).filter((item) => item !== null);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      success_url: `https://furnitureshopecommerce-server-1.onrender.com/api/users/payment/success/${userId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "https://furniture-shop-ecommerce-client.vercel.app/products/cart/mycart",
    });

    paymentData = {
      sessionId: session.id,
      cartId: cartId,
      totalAmount,
    };

    if (!session) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Error occurred while creating session",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Stripe payment session created successfully",
        url: session.url,
      });
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


    let cartId;
    let totalAmount = 0;

    if (paymentData) {
      totalAmount = paymentData?.totalAmount;
      cartId = paymentData?.cartId;
    }

    if (cartId) {
      const cart = await cartDb.findOne({ userId }).populate({
        path:'products.productId', 
        model: 'products',
        select: 'productName price category image description'
      }).exec();

      const cartProducts =  cart.products
    


      let orderData = await orderDb.findOne({ userId });

      const orderDetails = {
        orderId: userId + Date.now(),
        paymentId: session.payment_intent.id,
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
      
      await cartDb.deleteOne({ _id: new mongoose.Types.ObjectId(cartId) });

      await res.redirect("https://furniture-shop-ecommerce-client.vercel.app/payment/success/payment");

    }

  } catch (error) {
    res.status(500).json({success: false,message: `Failed to retrieve payment details - ${error.message}`});
  }
};

export const cancel = (req, res) => {
  res.redirect("/cart");
};
