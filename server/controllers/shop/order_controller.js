const paypal = require("../../helpers/paypal");
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId
    } = req.body;

    // Basic validations
    if (!userId || !cartItems || !cartItems.length || !totalAmount || !addressInfo) {
      return res.status(400).json({ success: false, message: "Invalid or missing order data" });
    }

    // Check stock availability for each product
    for (let item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.title}" is out of stock or insufficient quantity`
        });
      }
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal/return",
        cancel_url: "http://localhost:5173/shop/paypal/cancel"
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map(item => ({
              name: item.title,
              sku: item.productId,
              price: Number(item.price).toFixed(2),
              currency: "USD",
              quantity: item.quantity
            }))
          },
          amount: {
            currency: "USD",
            total: Number(totalAmount).toFixed(2)
          },
          description: "Purchase from Wood Gift Store"
        }
      ]
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment"
        });
      } else {
        const approvalUrl = payment.links.find(link => link.rel === "approval_url")?.href;

        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId: payment.id
        });

        await newlyCreatedOrder.save();

        res.status(201).json({
          success: true,
          approvalUrl,
          orderId: newlyCreatedOrder._id
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const foundOrder = await Order.findById(orderId);
    if (!foundOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update stock for each product
    for (let item of foundOrder.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product with ID: ${item.productId}`
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // Delete the cart
    if (foundOrder.cartId) {
      await Cart.findByIdAndDelete(foundOrder.cartId);
    }

    // Update order status
    foundOrder.orderStatus = 'confirmed';
    foundOrder.paymentStatus = 'paid';
    foundOrder.paymentId = paymentId;
    foundOrder.payerId = payerId;
    await foundOrder.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: foundOrder
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred"
    });
  }
};


const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found"
      });
    }

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred"
    });
  }
};


const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred"
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails
};
