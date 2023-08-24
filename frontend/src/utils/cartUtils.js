export const updateCart = (state) => {
    //calculate items price
    state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    //calculate shipping price
    state.shippingPrice = state.items > 500000 ? 0 : 15000;
    //calculate tax price
    state.taxPrice = Number((0 * state.itemsPrice));
    //calculate total price
    state.totalPrice = Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice);

    localStorage.setItem('cart', JSON.stringify(state));

    return state;
}