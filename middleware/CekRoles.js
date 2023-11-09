function checkUserRole(role) {
    
    return (req, res, next) => {
        // Simulasikan peran pengguna dari objek pengguna (pastikan req.role sesuai dengan objek pengguna Anda)
        if (req.role === role) {
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