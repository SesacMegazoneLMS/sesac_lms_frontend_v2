import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {clearCart} from '../../store/slices/cartSlice';
import {OrderService, PaymentService} from '../../infrastructure/services/CourseService';
import {toast} from 'react-toastify';
import CourseCard from '../../shared/components/CourseCard';
import {cartService} from "../../infrastructure/services/CartService";

function CartPage() {
  const user = localStorage.getItem("idToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); // 선택된 아이템 관리

  useEffect(() => {
    if (!user) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const fetchCartsData = async () => {
    try {
      const cartsData = await cartService.getCarts();
      if (cartsData && cartsData.cartInfo) {
        const cartItemsArray = Object.values(cartsData.cartInfo);
        setCartItems(cartItemsArray);
        // 초기 선택 상태 설정
        const initialSelection = {};
        cartItemsArray.forEach((item, index) => {
          initialSelection[index] = false;
        });
        setSelectedItems(initialSelection);
      }
    } catch(error) {
      console.log(error);
    }
  }

  const deleteFromCart = async (index) => {
    try {
      const res = await cartService.deleteFromCart(index);
      alert(res);
      fetchCartsData();
    } catch(error) {
      console.log("함수 : " + error);
    }
  }

  // 체크박스 선택 처리
  const handleSelectItem = (index) => {
    setSelectedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    const allSelected = Object.values(selectedItems).every(item => item);
    const newSelection = {};
    cartItems.forEach((_, index) => {
      newSelection[index] = !allSelected;
    });
    setSelectedItems(newSelection);
  };

  useEffect(() => {
    fetchCartsData();
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

  // 선택된 아이템들의 총 가격 계산
  const selectedItemsList = cartItems.filter((_, index) => selectedItems[index]);
  const totalPrice = selectedItemsList.reduce((sum, item) => sum + item.price, 0);
  const discountedPrice = totalPrice * 0.8; // 20% 할인

  const handlePayment = async () => {
    if (selectedItemsList.length === 0) {
      toast.error('결제할 강좌를 선택해주세요.');
      return;
    }

    try {
      const orderData = await OrderService.createOrder({
        courses: selectedItemsList.map(item => ({
          courseId: item.courseId,
          price: item.price
        })),
        totalAmount: discountedPrice
      });

      console.log( "orderData : " + JSON.stringify(orderData));

      const { IMP } = window;
      IMP.request_pay({
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: orderData.merchantUid,
        amount: orderData.totalAmount,
        name: selectedItemsList.length > 1
            ? `${selectedItemsList[0].title} 외 ${selectedItemsList.length - 1}건`
            : selectedItemsList[0].title,
        buyer_name: orderData.userName,
        notice_url: "https://api.sesac-univ.click/api/payments/webhook"
      }, async (rsp) => {
        if (rsp.success) {
          try {
            const verifyResult = await PaymentService.verifyPayment({
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              buyerName: rsp.buyer_name,
              amount: rsp.paid_amount,
              status: rsp.status,
              payMethod: rsp.pay_method
            });

            if (verifyResult.status === 'success') {
              dispatch(clearCart());
              navigate('/dashboard');
              toast.success('결제가 완료되었습니다.');
            } else {
              toast.error('결제는 완료되었으나 처리 중입니다. 결제 내역에서 확인해주세요.')
            }
          } catch (error) {
            console.error('Verification error:', error);
          }
        } else {
          toast.error(`결제에 실패했습니다. 사유: ${rsp.error_msg}`);
        }
      });
    } catch (error) {
      console.error('결제 처리 중 오류 발생: ', error);
      toast.error('결제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
      <CartContainer>
        <CartHeader>장바구니</CartHeader>

        {cartItems.length === 0 ? (
            <EmptyCart>
              <img src="/assets/icons/empty-cart.svg" alt="빈 장바구니" />
              <p>장바구니가 비어 있습니다.</p>
            </EmptyCart>
        ) : (
            <CartContent>
              <CartItemList>
                <SelectAllWrapper>
                  <Checkbox
                      type="checkbox"
                      checked={Object.values(selectedItems).every(item => item)}
                      onChange={handleSelectAll}
                  />
                  <span>전체 선택</span>
                </SelectAllWrapper>
                {cartItems.map((course, index) => (
                    <CourseWrapper key={course.id}>
                      <CheckboxWrapper>
                        <Checkbox
                            type="checkbox"
                            checked={selectedItems[index] || false}
                            onChange={() => handleSelectItem(index)}
                        />
                      </CheckboxWrapper>
                      <CourseCard
                          course={course}
                          type="cart"
                      />
                      <RemoveButton onClick={() => deleteFromCart(index)}>
                        <TrashIcon />
                        삭제
                      </RemoveButton>
                    </CourseWrapper>
                ))}
              </CartItemList>

              <OrderSummary>
                <SummaryTitle>주문 요약</SummaryTitle>
                <SelectedCount>선택된 강좌: {selectedItemsList.length}개</SelectedCount>
                <PriceDetails>
                  <PriceRow>
                    <span>상품 금액</span>
                    <span>₩{totalPrice.toLocaleString()}</span>
                  </PriceRow>
                  <PriceRow>
                    <span>할인 금액</span>
                    <DiscountPrice>-₩{(totalPrice * 0.2).toLocaleString()}</DiscountPrice>
                  </PriceRow>
                  <TotalRow>
                    <span>총 결제 금액</span>
                    <TotalPrice>₩{discountedPrice.toLocaleString()}</TotalPrice>
                  </TotalRow>
                </PriceDetails>
                <PaymentButton
                    onClick={handlePayment}
                    disabled={selectedItemsList.length === 0}
                >
                  {selectedItemsList.length}개 강좌 결제하기
                </PaymentButton>
              </OrderSummary>
            </CartContent>
        )}
      </CartContainer>
  );
}

// 추가된 Styled Components
const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
`;

const SelectAllWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  
  span {
    font-weight: 500;
  }
`;

const SelectedCount = styled.div`
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;
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

const CartItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CourseWrapper = styled.div`
  position: relative;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #fff;
  color: #1e40af;
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: #dbeafe;
  }
`;

const OrderSummary = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const PriceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalRow = styled(PriceRow)`
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  font-weight: bold;
`;

const DiscountPrice = styled.span`
  color: #1e40af;
`;

const TotalPrice = styled.span`
  color: #1e40af;
  font-size: 1.25rem;
`;

const PaymentButton = styled.button`
  width: 100%;
  background: #1e40af;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: #1e3a8a;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  
  img {
    width: 120px;
    margin-bottom: 1rem;
  }
  
  p {
    color: #6b7280;
  }
`;

const TrashIcon = styled.span`
  &:before {
    content: "🗑";
  }
`;

export default CartPage;