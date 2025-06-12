const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    console.log("Authorization Header: ", req.headers.authorization)

    if (!token)
      return res.status(401).json({ msg: "No token. Authorization denied." })

    // Expect Bearer token
    if (!token.startsWith("Bearer "))
      return res.status(401).json({ msg: "Invalid token format." })

    const jwtToken = token.split(" ")[1]  // Extract actual token

    const decoded = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET)

    req.user = decoded  // Attach payload { id } to request
    next()

  } catch (err) {
    console.error("Auth middleware error:", err)
    res.status(401).json({ msg: "Token invalid or expired." })
  }
}

module.exports = auth
