import jsonwebtoken from "jsonwebtoken"

export const generateToken = (id, secret) => {
  return jsonwebtoken.sign(id,secret,{expiresIn : "1h"})
}

export const verify = (token,secret) => {
  return jsonwebtoken.verify(token,secret)
}


