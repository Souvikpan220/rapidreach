import jwt from "jsonwebtoken";

export default async function(req,res){
  const {email,password}=req.body;
  const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"7d"});
  res.json({token});
}
