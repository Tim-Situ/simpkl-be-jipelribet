function checkUserRole(allowedRole) {
    
    return (req, res, next) => {
        
        var userRole = req.role

        if (allowedRole.includes(userRole)) {
          // Pengguna memiliki peran yang diperlukan, lanjutkan
            next();
        } else {
            // Pengguna tidak memiliki peran yang diperlukan, tolak akses
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak...'
            });
        }
    };  
}

module.exports = {
    checkUserRole
}