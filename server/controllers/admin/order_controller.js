
const Order = require('../../models/order')

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'userName email'); // populate user info

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!"
      });
    }

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured!"
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('userId', 'userName email'); // populate user info

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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured!"
    });
  }
};

const updateOrderStatus = async(req,res)=>
{
  try
  {
    const {id} = req.params;
    const {orderStatus} = req.body;

    const order = await Order.findById(id);

    if(!order)
    {
      return res.status(404).json({
        success : false,
        message : "Data not found!"
      })
    }

    await Order.findByIdAndUpdate(id,{orderStatus})

    res.status(200).json({
      success : true,
      message : "Order Status is updated successfully!"
    })
  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({
      success : false,
      message : "Some Error Occured!"
    })
  }
}


module.exports = {getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus}