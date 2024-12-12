const API_URL = 'http://ALB-ECS-LMS-2015700642.ap-northeast-2.elb.amazonaws.com';

export const getInstructorProfile = async () => {
  const response = await fetch(`${API_URL}/api/instructor/profile`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('idtoken')}`
    }
  });
  console.log('getInstructorProfile: ', response);
  return response.json();
};

export const updateInstructorProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/api/instructor/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(profileData)
  });
  console.log('updateInstructorProfile: ', response);
  return response.json();
};