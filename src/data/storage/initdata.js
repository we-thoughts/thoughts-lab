export default {
  openid: '',
  userinfo: {},
  creditinfo: {},

  posters: [],
  myposters: [],
  changelogs: [],

  config: {},

  // TODO: remove
  motto: 'Hello World',
  reverseMotto() {
    return this.motto.split('').reverse().join('')
  }
}
