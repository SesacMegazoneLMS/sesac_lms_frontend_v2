// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import { clearCart } from '../../store/slices/cartSlice';
// import { apiEndpoints } from '../../infrastructure/api/endpoints';
// import { toast } from 'react-toastify';

// function CheckoutPage() {
//   const { cartItems } = useSelector(state => state.cart);
//   const { user } = useSelector(state => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
//   const discountedPrice = totalPrice * 0.8; // 20% 할인

//   useEffect(() => {
//     if (cartItems.length === 0) {
//       navigate('/cart');
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://cdn.iamport.kr/v1/iamport.js";
//     script.async = true;
//     script.onload = () => {
//       if (window.IMP) {
//         const IMP = window.IMP;
//         IMP.init("imp56058426");
//       }
//     };
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     }
//   }, [cartItems.length, navigate]);

//   const handlePayment = async () => {
//     try {
//       const orderData = await apiEndpoints.cart.createOrder({
//         studentId: user.id,
//         items: cartItems,
//         totalAmount: discountedPrice
//       });

//       const { IMP } = window;
//       IMP.request_pay({
//         pg: "kakaopay",
//         pay_method: "card",
//         merchant_uid: orderData.merchantUid,
//         amount: orderData.totalAmount,
//         name: cartItems.length > 1 
//           ? `${cartItems[0].title} 외 ${cartItems.length - 1}건`
//           : cartItems[0].title,
//         buyer_name: user.name
//       }, async (rsp) => {
//         if (rsp.success) {
//           await apiEndpoints.cart.processPayment({
//             orderId: orderData.orderId,
//             amount: orderData.totalAmount
//           });
//           dispatch(clearCart());
//           navigate('/dashboard');
//           toast.success('결제가 완료되었습니다.');
//         } else {
//           toast.error(`결제 실패: ${rsp.error_msg}`);
//         }
//       });
//     } catch (error) {
//       console.error('결제 처리 오류:', error);
//       toast.error('결제 처리 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <CheckoutContainer>
//       <CheckoutHeader>결제하기</CheckoutHeader>
//       <CheckoutContent>
//         <OrderDetails>
//           <SectionTitle>주문 내역</SectionTitle>
//           {cartItems.map(course => (
//             <CourseItem key={course.id}>
//               <CourseTitle>{course.title}</CourseTitle>
//               <CoursePrice>₩{course.price.toLocaleString()}</CoursePrice>
//             </CourseItem>
//           ))}
//         </OrderDetails>

//         <PaymentSummary>
//           <SectionTitle>결제 정보</SectionTitle>
//           <PriceDetails>
//             <PriceRow>
//               <span>상품 금액</span>
//               <span>₩{totalPrice.toLocaleString()}</span>
//             </PriceRow>
//             <PriceRow>
//               <span>할인 금액</span>
//               <DiscountPrice>-₩{(totalPrice * 0.2).toLocaleString()}</DiscountPrice>
//             </PriceRow>
//             <TotalRow>
//               <span>총 결제 금액</span>
//               <TotalPrice>₩{discountedPrice.toLocaleString()}</TotalPrice>
//             </TotalRow>
//           </PriceDetails>
//           <PaymentButton onClick={handlePayment}>
//             {cartItems.length}개 강좌 결제하기
//           </PaymentButton>
//         </PaymentSummary>
//       </CheckoutContent>
//     </CheckoutContainer>
//   );
// }

// // Styled Components
// const CheckoutContainer = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 2rem;
// `;

// const CheckoutHeader = styled.h1`
//   font-size: 1.5rem;
//   font-weight: bold;
//   margin-bottom: 2rem;
// `;

// const CheckoutContent = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 300px;
//   gap: 2rem;
// `;

// const OrderDetails = styled.div`
//   background: white;
//   padding: 1.5rem;
//   border-radius: 0.5rem;
// `;

// const SectionTitle = styled.h2`
//   font-size: 1.25rem;
//   font-weight: bold;
//   margin-bottom: 1rem;
// `;

// const CourseItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1rem 0;
//   border-bottom: 1px solid #e5e7eb;
  
//   &:last-child {
//     border-bottom: none;
//   }
// `;

// const CourseTitle = styled.h3`
//   font-size: 1rem;
//   font-weight: 500;
//   color: #1f2937;
// `;

// const CoursePrice = styled.span`
//   font-weight: 600;
//   color: #1e40af;
// `;

// const PaymentSummary = styled.div`
//   background: white;
//   padding: 1.5rem;
//   border-radius: 0.5rem;
//   height: fit-content;
//   position: sticky;
//   top: 2rem;
// `;

// const PriceDetails = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.75rem;
//   margin-bottom: 1.5rem;
// `;

// const PriceRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const TotalRow = styled(PriceRow)`
//   border-top: 1px solid #e5e7eb;
//   padding-top: 0.75rem;
//   margin-top: 0.75rem;
//   font-weight: bold;
// `;

// const DiscountPrice = styled.span`
//   color: #1e40af;
// `;

// const TotalPrice = styled.span`
//   color: #1e40af;
//   font-size: 1.25rem;
//   font-weight: bold;
// `;

// const PaymentButton = styled.button`
//   width: 100%;
//   background: #1e40af;
//   color: white;
//   padding: 0.75rem;
//   border-radius: 0.5rem;
//   font-weight: bold;
//   cursor: pointer;
  
//   &:hover {
//     background: #1e3a8a;
//   }
// `;

// export default CheckoutPage;