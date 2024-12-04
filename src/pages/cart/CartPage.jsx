import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart } from '../../store/slices/cartSlice';
function CartPage() {
  const { cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map(course => (
            <div key={course.id} className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-gray-500">{course.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₩{course.price.toLocaleString()}</p>
                  <button 
                    onClick={() => dispatch(removeFromCart(course.id))}
                    className="text-red-500 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>상품 금액</span>
              <span>₩{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <Link 
            to="/checkout"
            className="w-full bg-primary text-white py-2 px-4 rounded-md block text-center"
          >
            결제하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;