const bcrypt = require ("bcryptjs"); //for password
const jwt = require ('jsonwebtoken');
const User = require ("../../models/user")


//register
const registerUser = async (req, res)=>
{
    const {userName, email, password } = req.body;
    console.log("Register API hit ✅"); // Add this line

    try
    {
        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const checkUser = await User.findOne({email})
        if (checkUser) return res.json({success : false, message : 'user is existes with same emailId ! Plz try again'})
        
        const hashPassword = await bcrypt.hash(password,12);
        const newUser = new User(
            {
                userName, email, password:hashPassword
            }
        )

     await newUser.save()//saves the user in mongodb
     res.status(200).json(
        {
            success: true,
            message: 'Registration succesfull'
        }
     )
    }
    catch (e) {
        console.error("❌ Register Error:", e); // Log full error
        console.log("Error details:", e.message); // Log error message
        res.status(500).json({
            success: false,
            message: e.message || "Some error occurred"
        });
    }
}

//login

    const loginUser = async (req, res)=>
        {
            const {email, password } = req.body;
        
            try
            {
               const checkUser = await User.findOne({email})
               if(!checkUser) return res.json({
                success:false,
                message:"User doesn't exists! plz register first "
               })

               const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
               if(!checkPasswordMatch) return res.json({
                success:false,
                message:"Incorrect password! plz try again"
               })

               const token = jwt.sign({
                id:checkUser._id,
                role:checkUser.role, 
                email:checkUser.email,
                userName:checkUser.userName,
               }, 'CLIENT_SECRATE_KEY',{expiresIn: '20m'})

               res.cookie('token', token, {httpOnly: true, secure:false}).json({
                success:true,
                message:"Login successfull",
                user:
                {
                    email: checkUser.email,
                    role: checkUser.role,
                    id:checkUser._id,
                    userName:checkUser.userName
                }
               })

            }
            catch(e)
            {
                console.log(e)
                res.status(500).json(
                    {
                        success: false,
                        message: "some error occured",
                    })
            };
        }

    //logout
    const logoutUser=( req,res )=>
        {
            res.clearCookie('token').json({
                success:true,
                message:'Logged out succesfully'
            })
        }    

    //auth middleware
    const authMiddleware = async(req, res, next)=>
        {
            const token = req.cookies.token;
            if(!token) return res.status(401).json({
                success:false,
                message:'Unauthorized user!'
            })

            try
            {
                const decoded = jwt.verify(token,'CLIENT_SECRATE_KEY');
                req.user = decoded;
                next()
            }
            catch(error)
            {
                res.status(401).json({
                    success:false,
                    message:'Unauthorized user'
                });
            }
        }    

        module.exports = {registerUser, loginUser, logoutUser, authMiddleware};

