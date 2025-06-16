const express = require("express");
const { registerUser,loginUser,logoutUser,authMiddleware } = require("../../controllers/auth/auth_controller");

const router=express.Router();

router.post("/register" , registerUser)
router.post("/login" , loginUser)
router.post("/logout",logoutUser)
router.get("/check_auth" ,authMiddleware, (req,res)=>
{
  const user = req.user;
  res.status(200).json({
    success:true,
    message:'Authenticated user!',
    user
  })
} )

router.get("/test", (req, res) => {
    res.send("Router is working ✅");
  });
  

module.exports = router;
