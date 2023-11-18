// Fungsi untuk membuat random char dengan rentang character yang bisa di sesuaikan
function randomChar(charset) {
    const chars = charset;
    
    let result = chars.charAt(Math.floor( Math.random() * chars.length ));

    return result;
}

// Fungsi generate random password
function generateRandomPassword(min_length){
    try {
        let password = '';
        let shuffleIndex = [];
        
        while (shuffleIndex.length < min_length) {
            let randomIndex = Math.floor(Math.random() * 4); // Membuat angka random dalam rentang 0 sampai 3 karena password rules berisikan 3 rules
            shuffleIndex.push(randomIndex)

            if (!shuffleIndex.includes(0)) {
                shuffleIndex.push(0)
            } else if (!shuffleIndex.includes(1)) {
                shuffleIndex.push(1)
            } else if (!shuffleIndex.includes(2)) {
                shuffleIndex.push(2)
            } else if (!shuffleIndex.includes(3)) {
                shuffleIndex.push(3)
            }
        }

        // Menggenerate char sesuai dari shuffle index
        shuffleIndex.forEach((element) => {
            // Menentukan random character set
            const hurufKecil = randomChar('abcdefghijklmnopqrstuvwxyz');
            const hurufBesar = randomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            const angka = randomChar('0123456789');
            const specialChar = randomChar('!@#$');
            
            // Password rule berisikan 3 index
            let passwordRules = [
                hurufKecil,
                hurufBesar,
                angka,
                specialChar
            ];
            
            // Memasukkan shuffle index
            password += passwordRules[element];
        });

        return {success: true, data: password}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

module.exports = {
    generateRandomPassword
}