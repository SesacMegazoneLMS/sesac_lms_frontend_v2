import React from 'react';
import styled from 'styled-components';
import { FaGlobe, FaLinkedin, FaGithub } from 'react-icons/fa'; // 아이콘 추가

const InstructorContainer = styled.div`
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-3px);
    }
`;

const InstructorHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 2px solid #e2e8f0;
`;

const InstructorInfo = styled.div`
    flex: 1;
`;

const InstructorName = styled.h3`
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
`;

const InstructorTitle = styled.p`
    color: #718096;
    font-size: 1rem;
`;

const InstructorBio = styled.p`
    line-height: 1.7;
    color: #4a5568;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
`;

const InstructorStats = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 1rem 0;
    border-top: 1px solid #e2e8f0;
    color: #718096;
`;

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 0.875rem;
    span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        &:first-child {
            font-weight: 600;
            font-size: 1rem;
            color: #4a5568;
            svg {
                width: 18px;
                height: 18px;
            }
        }
        &:last-child {
            color: #a0aec0;
            word-break: break-all;
        }
    }
`;

const InstructorSection = ({ instructor }) => {
    return (
        <InstructorContainer>
            <InstructorHeader>

                <InstructorInfo>
                    <InstructorName>{instructor?.nickname || "해당 정보가 없습니다"}</InstructorName>
                    <InstructorTitle>{instructor?.introduction || "해당 정보가 없습니다"}</InstructorTitle>
                    <div>{instructor?.techStack || "해당 정보가 없습니다"}</div>
                </InstructorInfo>
            </InstructorHeader>

            <InstructorBio>{instructor?.bio || "해당 정보가 없습니다"}</InstructorBio>

            <InstructorStats>
                <StatItem>
              <span>
                  <FaGlobe/>
                  websiteUrl
                </span>
                    <span>{instructor?.websiteUrl || "해당 정보가 없습니다"}</span>
                </StatItem>
                <StatItem>
              <span>
              <FaLinkedin/>
               linkedUrl
                </span>
                    <span>{instructor?.linkedinUrl || "해당 정보가 없습니다"}</span>
                </StatItem>
                <StatItem>
                    <span><FaGithub/>gitHub</span>
                    <span>{instructor?.githubUrl || "해당 정보가 없습니다"}</span>
                </StatItem>
            </InstructorStats>
        </InstructorContainer>
    );
};

export default InstructorSection;