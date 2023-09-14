import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Secret key for JWT
const secretKey = process.env.SECRETKEY;

const authenticate = (req, res, next) => {
    // const bearerHeader=req.header('Authorization');
    // if(typeof bearerHeader!== 'undefined'){
    //   const bearerToken=bearerHeader.split(" ")[1];
    //   console.log(bearerToken);
    //   req.token=bearerToken;
    //   next();
    // } else {
    //   res.status(400).json({ message: 'Invalid token' });
    // }
  
    const bearerHeader = req.header("Authorization");
    if (!bearerHeader) return res.status(401).json({ message: "Access denied" });
  
    try {
      const bearerToken = bearerHeader.split(" ")[1];
      jwt.verify(bearerToken, secretKey, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          console.log(authData);
          req.user = authData;
          next();
        }
      });
  
      // // console.log(token);
      // const bearerToken=bearerHeader.split(" ")[1];
      // // console.log(bearerToken);
      // // req.token=bearerToken;
      // const decoded = jwt.verify(bearerToken, secretKey);
      // console.log(decoded);
      // req.user = decoded;
  
      // next();
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Invalid token" });
    }
  };

  export default authenticate;