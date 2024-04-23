const baseURL = 'http://127.0.0.1:8000/api';

export const environment = {
  production: false,
  queueGameURL: `${baseURL}/game/queue`,
  joinRandomGameURL: `${baseURL}/game/join/random`,
  endGameURL: `${baseURL}/game/end`,
  dequeueGameURL: `${baseURL}/game/dequeue`,
  cancelRandomQueueURL: `${baseURL}/game/cancel/random`,
  loginURL: `${baseURL}/user/login`,
  logoutURL: `${baseURL}/user/logout`,
  authenticateURL: `${baseURL}/authenticatetoken`,
  registerURL: `${baseURL}/user/register`,
  historyGames: `${baseURL}/game/history`,
  sendBoard: `${baseURL}/game/send/board`,
  notify: `${baseURL}/game/notify`,
  sseURL: `${baseURL}/game/start`,
  attackURL: `${baseURL}/game/attack`,
  attackSuccessURL: `${baseURL}/game/attack/success`,
  attackFailedURL: `${baseURL}/game/attack/failed`,

  pusher: {
    key: `43fedbb14d45bf4e004e`,
    cluster: `us3`
  }
}
