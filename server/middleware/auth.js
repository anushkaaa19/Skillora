// AUTH , IS STUDENT , IS INSTRUCTOR , IS ADMIN

const jwt = require("jsonwebtoken");
require('dotenv').config();


// ================ AUTH ================
exports.auth = (req, res, next) => {
    try {
      const bodyToken = req.body?.token;
      const cookieToken = req.cookies?.token;
      const authHeader = req.header('Authorization');
  
      console.log("🍪 [Backend] Cookie Token:", cookieToken);
      console.log("📝 [Backend] Body Token:", bodyToken);
      console.log("🔐 [Backend] Authorization Header:", authHeader);
  
      const token = authHeader?.replace('Bearer ', '') || bodyToken || cookieToken;
  
      console.log("✅ [Backend] Final token being used:", token);
  
      if (!token) {
        console.warn("❌ [Backend] No token provided");
        return res.status(401).json({
          success: false,
          message: 'Token is Missing',
        });
      }
  
      // Verify token
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ [Backend] Token verified:", decode);
        req.user = decode;
      } catch (error) {
        console.error("❌ [Backend] Error decoding token:", error.message);
        return res.status(401).json({
          success: false,
          error: error.message,
          message: 'Error while decoding token',
        });
      }
  
      next();
    } catch (error) {
      console.error("🔥 [Backend] Error while token validating:", error.message);
      return res.status(500).json({
        success: false,
        message: 'Error while token validating',
      });
    }
  };
  




// ================ IS STUDENT ================
exports.isStudent = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType?.toLowerCase() !== 'student'){
            return res.status(401).json({
                success: false,
                message: 'This Page is protected only for student'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with student accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while cheching user validity with student accountType'
        })
    }
}


// ================ IS INSTRUCTOR ================
exports.isInstructor = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType != 'Instructor') {
            return res.status(401).json({
                success: false,
                message: 'This Page is protected only for Instructor'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Instructor accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while cheching user validity with Instructor accountType'
        })
    }
}


// ================ IS ADMIN ================
exports.isAdmin = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user.accountType != 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This Page is protected only for Admin'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Admin accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while cheching user validity with Admin accountType'
        })
    }
}

