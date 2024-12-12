import React from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 2rem;
`;

const TabButton = styled.button`
  padding: 1rem 0;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-light)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    color: var(--primary);
  }
`;

const CourseDetailTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'curriculum', label: '커리큘럼' },
    { id: 'reviews', label: '수강평' },
    { id: 'instructor', label: '강사 소개' },
  ];

  return (
    <TabContainer>
      <TabList>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
    </TabContainer>
  );
};

export default CourseDetailTabs;