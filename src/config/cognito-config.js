import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: "ap-northeast-2_ow5oyt4jA",
  ClientId: "6tuhkvilko0ea253l36d4n3uec",
  Region: "ap-northeast-2",
  GoogleClientId:
    "785935071013-ms26qfbn4tiu4kui0leu7la8m3f18v5h.apps.googleusercontent.com",
  CognitoDomain:
    "ap-northeast-2cj4nax3ku.auth.ap-northeast-2.amazoncognito.com",
};

export const userPool = new CognitoUserPool(poolData);
export const cognitoConfig = poolData;