import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { reviewService } from '../../infrastructure/services/ReviewService';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

function LikeButton({ reviewId, fetchCourseData }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가
    const [, forceUpdate] = useState({}); // 강제 업데이트를 위한 상태 추가
    const user = localStorage.getItem('idToken');

    const handleForceUpdate = useCallback(() => {
        forceUpdate({});
    }, [forceUpdate]);

    const fetchLikeData = async () => {
        setLoading(true); // 로딩 시작
        setError(null); // 에러 초기화
        try {
            const res = await reviewService.getLikeStatus(reviewId);
            setIsLiked(res.status);
            setLikesCount(res.totalCount);
        } catch (error) {
            console.error('좋아요 상태 불러오기 실패:', error);
            setError('좋아요 상태를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false); // 로딩 종료
            handleForceUpdate(); // 강제 업데이트 실행
        }
    };

    useEffect(() => {
        fetchLikeData();
    }, [reviewId,handleForceUpdate]);

    const handleLike = async () => {
        setLoading(true); // 로딩 시작
        setError(null); // 에러 초기화
        try {
            const res = await reviewService.toggleLike(reviewId, user);
            setIsLiked(res.status); // 서버 응답을 통해 status 값을 받아옴
            setLikesCount(res.totalCount); // 서버 응답을 통해 likesCount 값을 받아옴
            await fetchCourseData();
            // 좋아요 상태 변경 후 좋아요 데이터를 다시 가져옴
            await fetchLikeData()
            if(res.message) {
                toast.success(res.message); // 토스트 메시지 출력
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            setError('좋아요 처리 실패했습니다.');
        } finally {
            setLoading(false); // 로딩 종료
        }
    };


    return (
        <StyledLikeButton onClick={handleLike} disabled={loading}>
            <FontAwesomeIcon
                icon={faHeart}
                style={{ color: isLiked ? '#ff6b6b' : '#ddd', marginRight: '0.3rem' }}
            />
            <span>{likesCount}</span>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </StyledLikeButton>
    );
}

LikeButton.propTypes = {
    reviewId: PropTypes.number.isRequired,
    fetchCourseData: PropTypes.func.isRequired
};

const StyledLikeButton = styled.div`
    background-color: transparent;
    color: black;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &:hover {
        background-color: transparent;
    }

    &:active {
        background-color: transparent;
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;


export default LikeButton;