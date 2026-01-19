import jwt from "jsonwebtoken";

export default async function(req,res){
  const {email,password}=req.body;
  // store user in DB (use real DB later)
  res.json({success:true});
}
