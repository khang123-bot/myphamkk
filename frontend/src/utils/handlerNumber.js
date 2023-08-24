export const handleNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const handlePhoneNumber = (num) => {
    return [num.slice(0, 4), ".", num.slice(4,7), ".", num.slice(7)].join('');
}
