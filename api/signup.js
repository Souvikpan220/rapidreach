import jwt from "jsonwebtoken";

export default async function(req,res){
  const {email,password}=req.body;
  // store user in DB (use real DB later)
  res.json({success:true});
}


global.users = global.users || [];

export default function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "Missing fields" });
  }

  const exists = global.users.find(u => u.email === email);
  if (exists) {
    return res.json({ error: "User already exists" });
  }

  global.users.push({ email, password });

  res.json({ success: true });
}

