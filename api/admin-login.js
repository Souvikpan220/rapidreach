import jwt from "jsonwebtoken";

export default function(req,res){
  if(req.body.key !== process.env.ADMIN_SECRET){
    return res.status(401).json({ok:false});
  }

  const token = jwt.sign(
    {role:"admin"},
    process.env.JWT_SECRET,
    {expiresIn:"12h"}
  );

  res.json({ok:true,token});
}
