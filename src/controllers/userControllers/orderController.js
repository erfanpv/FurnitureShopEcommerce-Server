import mongoose from "mongoose";
import orderDb from "../../models/schemas/orderSchema.js";
import addressDb from "../../models/schemas/addressSchema.js";
import productDb from "../../models/schemas/productSchema.js";
import cartDb from "../../models/schemas/cartSchema.js";

export const getOrdersByUser = async (req, res) => {
  try {   
    const userId = req.params.id;
    const orders = await orderDb.find({ userId })
      .populate({
        path: 'orderDetails.products.productId', 
        model: 'products',
        select: 'productName price category image', 
      }).exec();
    
    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    res.status(200).json({ success: true, message: "Orders Fetched", data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};



export const createOrder = async (req, res) => {
  try {
    const { products, address, payment_method,userId} = req.body;    


    if (!products || !address || !payment_method ||!userId) {
      return res.status(400).json({success:false, message: "All fields are required." });
    }

    const productIds = products.map((product) => product.productId);
    const productDetails = await productDb.find({ _id: { $in: productIds } });

    let totalAmount = 0;
    products.forEach((product) => {
      const productDetail = productDetails.find((p) => p._id.equals(product.productId));
      if (productDetail) {
        totalAmount += productDetail.price * product.quantity; 
      }
    });

    let orderData = await orderDb.findOne({ userId });

    const orderDetails = {
      orderId:new Date(),
      products,
      total: totalAmount,
      status: "Placed", 
      payment_method,
      address,
      createdAt: new Date(),
    };

    if (!orderData) {      
      orderData = new orderDb({userId,orderDetails: [orderDetails]});
    } else {
      orderData.orderDetails.push(orderDetails);
    }

    await orderData.save();
    res.status(201).json({success:true, message: "Order Placed Successfully" });
  } catch (error) {
    res.status(500).json({success:false, message: `Error creating order - ${error.message}` });
  }
};


export const createOrderbyCart = async (req, res) => {
  try {
    const { payment_method, cartId,userId} = req.body;

    if (!cartId ) {
      return res.status(400).json({success:false, message: "All fields are required." });
    } 
    const cart = await cartDb.aggregate([ { $match: { _id: new mongoose.Types.ObjectId(cartId) } } ]);

    if (!cart.length || cart[0].userId.toString() !== userId) {
      return res.status(400).json({ success: false, error: "Invalid cart or user" });
    }

    const cartProducts = await cart[0].products;

    let totalAmount = 0;
    for (const item of cartProducts) {
      const product = await productDb.findById(item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }

    let orderData = await orderDb.findOne({ userId });

    const orderDetails = {
      orderId:new Date(),
      products:cartProducts,
      total: totalAmount,
      status: "Placed", 
      payment_method,
      createdAt: new Date(),
    };

    if (!orderData) {      
      orderData = new orderDb({userId,orderDetails: [orderDetails]});
    } else {
      orderData.orderDetails.push(orderDetails);
    }

    await orderData.save();

    //if the order is success is the cart is empty
    await cartDb.deleteOne({ _id: new mongoose.Types.ObjectId(cartId) });
    
    res.status(201).json({success:true, message: "Order Placed Successfully" });
  } catch (error) {
    res.status(500).json({success:false, message: `Error creating order - ${error.message}` });
  }
};