function cekPasswordValid(input) {
    try {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\;',./]).{4,}$/;
        return {success: regex.test(input)}
    } catch (error) {
        return {success: false}
    }   
}

module.exports = {
    cekPasswordValid
}