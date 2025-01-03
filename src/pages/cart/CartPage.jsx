import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {clearCart} from '../../store/slices/cartSlice';
import {OrderService, PaymentService} from '../../infrastructure/services/CourseService';
import {toast} from 'react-toastify';
import {cartService} from "../../infrastructure/services/CartService";
import {getCourseImage} from "../../shared/utils/imageUtils";
import cartCount from "../../store/actions/cartActions"; // cartCount 임포트

function CartPage() {
  const user = localStorage.getItem("idToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!user) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/auth/login');
    }
  }, [user, navigate]);


  const handleSelectDelete = async () => {
    const selectedIndexes = Object.keys(selectedItems).filter(key => selectedItems[key]).map(Number);
    if (selectedIndexes.length === 0) {
      toast.error('선택된 강좌가 없습니다.');
      return;
    }
    if (window.confirm(`${selectedIndexes.length}개 강좌를 삭제하시겠습니까?`)) {
      try{
        const res = await cartService.deleteFromCart(selectedIndexes); // 변경된 부분
        if(res) {
          setCartItems(prevItems => prevItems.filter((_, index) => !selectedIndexes.includes(index)));
          setSelectedItems({});
          alert('선택한 강좌가 삭제되었습니다.');
          dispatch(cartCount()); // 추가: cartCount dispatch
        }
      }catch (error){
        toast.error('선택한 강좌 삭제 실패');
        console.log(error);
      }
    }
  };

  const handleAllDelete = async () => {
    if (cartItems.length === 0) {
      toast.error('장바구니가 비어있습니다.');
      return;
    }

    if (window.confirm('장바구니의 모든 강좌를 삭제하시겠습니까?')) {
      try {
        const allIndexes = cartItems.map((_, index) => index);
        const res = await cartService.deleteFromCart(allIndexes);

        if(res) {
          alert('장바구니의 모든 강좌가 삭제되었습니다.');
          await dispatch(cartCount());

          setCartItems([]);
          setSelectedItems({});
        }

      } catch (error) {
        toast.error('장바구니 삭제 실패');
        console.log(error);
      }
    }
  };

  const deleteFromCart = async (index) => {
    try {
      const res = await cartService.deleteFromCart([index]); // 변경된 부분
      if(res) {
        setCartItems(prevItems => {
          const newItems = [...prevItems];
          newItems.splice(index, 1);
          const newSelection = { ...selectedItems};
          delete newSelection[index];
          setSelectedItems(newSelection);
          alert('선택한 강좌가 삭제되었습니다.');
          dispatch(cartCount()); // 추가: cartCount dispatch
          return newItems;
        })
      }
    } catch(error) {
      console.log("함수 : " + error);
      toast.error('삭제 실패');
    }
  }

  const fetchCartsData = async () => {
    try {
      const cartsData = await cartService.getCarts();
      if (cartsData && cartsData.cartInfo) {
        const cartItemsArray = Object.values(cartsData.cartInfo);
        setCartItems(cartItemsArray);
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

  const handleSelectItem = (index) => {
    setSelectedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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

  const selectedItemsList = cartItems.filter((_, index) => selectedItems[index]);
  const totalPrice = selectedItemsList.reduce((sum, item) => sum + item.price, 0);
  const discountedPrice = totalPrice * 0.8;

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
      }, (rsp) => {
        if (rsp.success) {
          PaymentService.verifyPayment({
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
            buyerName: rsp.buyer_name,
            amount: rsp.paid_amount,
            status: rsp.status,
            payMethod: rsp.pay_method
          })
              .then(async () => { // `then` 내부를 async 함수로 변경
                const purchasedIndexes = Object.keys(selectedItems).filter(key => selectedItems[key]).map(Number);
                await cartService.deleteFromCart(purchasedIndexes);
                // 결제 완료된 항목들을 장바구니에서 제거
                setCartItems(prevItems => prevItems.filter((_, index) => !purchasedIndexes.includes(index)));
                setSelectedItems(prev => {
                  const newSelection = { ...prev };
                  purchasedIndexes.forEach(key => {
                    delete newSelection[key];
                  });
                  return newSelection;
                });
                dispatch(clearCart());
                alert('결제가 완료되었습니다.');
                navigate('/dashboard');
              })
              .catch(error => {
                console.error('Verification error:', error);
              });
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
        <CartHeaderWrapper>
          <CartHeader>장바구니</CartHeader>
          <CartCount>장바구니에 담긴 강좌: {cartItems.length}개</CartCount>
        </CartHeaderWrapper>
        {cartItems.length === 0 ? (
            <EmptyCart>
              <p>장바구니가 비어 있습니다.</p>
            </EmptyCart>
        ) : (
            <CartContent>
              <CartItemList>
                <SelectAllWrapper>
                  <CheckboxArea>
                    <Checkbox
                        type="checkbox"
                        checked={Object.values(selectedItems).every(item => item)}
                        onChange={handleSelectAll}
                    />
                    <span>전체 선택</span>
                  </CheckboxArea>
                  <ButtonArea>
                    <DeleteButton onClick={handleSelectDelete}>
                      선택 삭제
                    </DeleteButton>
                    <DeleteButton onClick={handleAllDelete}>
                      전체 삭제
                    </DeleteButton>
                  </ButtonArea>
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
                      <CourseItem>
                        <CourseImage src={getCourseImage(course)} alt={course.title} style={{ width: '120px', height: '80px' }}/>
                        <CourseInfo>
                          <CourseTitle>{course.title}</CourseTitle>
                          <CoursePrice>₩{course.price.toLocaleString()}</CoursePrice>
                        </CourseInfo>
                      </CourseItem>
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
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
`;
const CheckboxArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`
const ButtonArea = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const DeleteButton = styled.button`
  background-color: #fff;
  color: #1e40af;
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background: #dbeafe;
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

const CartHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const CartCount = styled.span`
  font-size: 1rem;
  color: #6b7280;
  margin-right: 340px;
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
  display: flex;
  align-items: center;
  padding: 1rem;
`;

const CourseItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const CourseImage = styled.img`
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CourseTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
`;

const CoursePrice = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const RemoveButton = styled.button`
  background: #fff;
  color: #1e40af;
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

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
  top: 10rem;
  border: 3px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
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