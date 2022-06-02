"use strict"

function formatRupiah(price){
    return price.toLocaleString('id', {
        style : "currency", 
        currency: "IDR"
    });
}

module.exports = formatRupiah;