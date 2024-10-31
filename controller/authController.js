const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken'); 
const User = require("../model/User"); 
const dotenv = require('dotenv'); +

dotenv.config(); 

exports.signup = async(req,res)=>{
        const {name,email,password} = req.body; 
        
        try {
            let user1 = await User.findOne({email}); 
            if(user1){
                return res.status(400).json({message: 'User already exists'}); 
            } ;

            let user = new User({
                   name,
                   email,
                   password,
            });
            const salt = await bcrypt.genSalt(10); 
            user.password = await bcrypt.hash(password,salt); 

            await user.save(); 

           

            jwt.sign({user_id: user._id},process.env.JWT_SECRET,{expiresIn: '1h'}, (err,token)=>{
                     if(err) throw err; 
                     res.json({ message: 'Signup successful', token }); 
            }); 

        } catch (error) {
            console.error(error.message); 
            res.status(500).send("Server"); 
            
        }
} 

exports.login = async (req, res) => {
    console.log(req.body);  
    
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id, 
                name: user.name
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                throw err;
            }

            res.json({ message: 'Login successful', token, user:{id:user.id, name:user.name} });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
};