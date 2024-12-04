import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito-config';

export const authService = {
  login: (email, password, userType) => {
    if (!email || !password || !userType) {
      return Promise.reject(new Error('이메일, 비밀번호, 사용자 유형은 필수입니다.'));
    }

    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();
          const userAttributes = result.getIdToken().payload;
          
          const cognitoUserType = userAttributes['custom:userType'];
          if (!cognitoUserType) {
            reject(new Error('사용자 유형이 없습니다.'));
            return;
          }

          if (cognitoUserType !== userType) {
            reject(new Error('잘못된 사용자 유형입니다.'));
            return;
          }

          resolve({
            id: userAttributes.sub,
            email: userAttributes.email,
            name: userAttributes.name,
            role: cognitoUserType,
            accessToken,
            idToken,
            refreshToken
          });
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  },

  googleLogin: () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/callback&response_type=code&scope=email profile`;
    window.location.href = googleAuthUrl;
  },

  register: (email, password, name, userType, phoneNumber, address) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
        new CognitoUserAttribute({ Name: 'name', Value: name }),
        new CognitoUserAttribute({ Name: 'custom:userType', Value: userType }),
        new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }),
        new CognitoUserAttribute({ Name: 'address', Value: address })
      ];

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      });
    });
  },

  confirmRegistration: (email, code) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}; 