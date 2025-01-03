import { setCartItems } from "../slices/cartSlice";
import {cartService} from "../../infrastructure/services/CartService"; // 수정: cartSlice 액션 임포트

const cartCount = () => {
    return async (dispatch) => {
        try {
            const cartsData = await cartService.getCarts();
            const cartItemsArray = Object.values(cartsData.cartInfo);
            dispatch(setCartItems(cartItemsArray)); // 수정: 액션 생성자 dispatch
        } catch (error) {
            console.error('장바구니 데이터 로딩 에러:', error);
        }
    };
};

export default cartCount;