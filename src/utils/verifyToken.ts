import * as jose from "jose";
export const verifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return {
      valid: true,
      payload,
    };
  } catch {
    return {
      valid: false,
      payload: null,
    };
  }
};
