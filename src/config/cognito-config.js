import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'ap-northeast-2_78HNDcTxY',
    ClientId: '4v0l18pe5gjvlv6jdmvarf5dck',
    Region: 'ap-northeast-2',
    GoogleClientId: '785935071013-ms26qfbn4tiu4kui0leu7la8m3f18v5h.apps.googleusercontent.com',
    CognitoDomain: 'ap-northeast-2cj4nax3ku.auth.ap-northeast-2.amazoncognito.com'
  };

export const userPool = new CognitoUserPool(poolData);
export const cognitoConfig = poolData;