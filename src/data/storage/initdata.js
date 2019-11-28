export default {
  openid: '',
  user_info: {},
  credit_info: {},
  posters: [],
  myposters: [],
  changelogs: [],
  // TODO: remove
  motto: 'Hello World',
  reverseMotto() {
    return this.motto.split('').reverse().join('')
  }
}
