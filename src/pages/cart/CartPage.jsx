import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { removeFromCart } from '../../store/slices/cartSlice';

function CartPage() {
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.onload = () => {
      if (window.IMP) {
        const IMP = window.IMP;
        IMP.init("imp56058426");
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handlePayment = async () => {
    try {
      const orderResponse = await fetch('http://localhost:8081/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user.id,
          items: cartItems.map(item => ({
            itemId: item.id,
            price: item.price
          })),
          totalAmount: totalPrice
        })
      });

      if (!orderResponse.ok) throw new Error('주문 생성 실패');
      const orderData = await orderResponse.json();

      const { IMP } = window;
      IMP.request_pay({
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: orderData.merchantUid,
        amount: orderData.totalAmount,
        name: cartItems.length > 1 
          ? `${cartItems[0].title} 외 ${cartItems.length - 1}건`
          : cartItems[0].title,
        buyer_name: user.name
      }, async (rsp) => {
        if (rsp.success) {
          // 결제 성공 처리
          navigate('/dashboard');
        } else {
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      });
    } catch (error) {
      console.error('결제 처리 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <CartContainer>
      <CartHeader>장바구니</CartHeader>
      
      {cartItems.length === 0 ? (
        <EmptyCart>장바구니가 비어 있습니다.</EmptyCart>
      ) : (
        <CartContent>
          <CartList>
            {cartItems.map(course => (
              <CartItem key={course.id}>
                <CourseInfo>
                  <CourseTitle>{course.title}</CourseTitle>
                  <InstructorName>{course.instructor}</InstructorName>
                </CourseInfo>
                <PriceSection>
                  <Price>₩{course.price.toLocaleString()}</Price>
                  <RemoveButton onClick={() => dispatch(removeFromCart(course.id))}>
                    삭제
                  </RemoveButton>
                </PriceSection>
              </CartItem>
            ))}
          </CartList>

          <OrderSummary>
            <SummaryTitle>주문 요약</SummaryTitle>
            <PriceDetail>
              <span>상품 금액</span>
              <span>₩{totalPrice.toLocaleString()}</span>
            </PriceDetail>
            <PaymentButton onClick={handlePayment}>
              결제하기
            </PaymentButton>
          </OrderSummary>
        </CartContent>
      )}
    </CartContainer>
  );
}

// Styled Components
const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CartHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CartItem = styled.li`
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
`;

const CourseInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CourseTitle = styled.h3`
  font-weight: bold;
`;

const InstructorName = styled.p`
  color: #666;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.p`
  font-weight: bold;
`;

const RemoveButton = styled.button`
  color: #dc2626;
  cursor: pointer;
`;

const OrderSummary = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.25rem;
`;

const SummaryTitle = styled.h2`
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

const PriceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const PaymentButton = styled.button`
  background-color: #2563eb;
  color: #fff;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const EmptyCart = styled.p`
  text-align: center;
  color: #666;
`;

export default CartPage;