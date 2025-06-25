const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
     
    // Get authorization header - try both methods
    const authHeader = req.headers.authorization || req.header("Authorization") || req.get("Authorization")
    
      

    if (!authHeader) {
       return res.status(401).json({ msg: "No token. Authorization denied." })
    }

    // Check if it starts with Bearer
    if (!authHeader.startsWith("Bearer ")) {
       return res.status(401).json({ msg: "Invalid token format. Use 'Bearer <token>'" })
    }

    const jwtToken = authHeader.substring(7) // Remove "Bearer " (7 characters)
 
    if (!jwtToken || jwtToken === 'null' || jwtToken === 'undefined' || jwtToken.trim() === '') {
       return res.status(401).json({ msg: "Token is empty or invalid." })
    }

     const decoded = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET)
 
    req.user = decoded
     next()

  } catch (err) {
   /*  console.log("❌ Auth middleware error:")
    console.log("Error name:", err.name)
    console.log("Error message:", err.message) */
    
    if (err.name === 'JsonWebTokenError') {
/*       console.log("❌ JWT is malformed")
 */      return res.status(401).json({ msg: "Token is malformed or invalid." })
    } else if (err.name === 'TokenExpiredError') {
/*       console.log("❌ JWT has expired")
 */      return res.status(401).json({ msg: "Token has expired." })
    } else if (err.name === 'NotBeforeError') {
/*       console.log("❌ JWT not active yet")
 */      return res.status(401).json({ msg: "Token not active yet." })
    } else {
/*       console.log("❌ Unknown JWT error")
 */      return res.status(401).json({ msg: "Token verification failed." })
    }
  }
}

module.exports = auth