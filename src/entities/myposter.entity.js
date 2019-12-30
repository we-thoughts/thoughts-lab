
class MyposterEntity {

  posters = [];

  constructor() { }

  getPosters() {
    return this.posters;
  }

  set(posters) {
    this.posters = [].concat(posters);
    return this.posters;
  }

  removePosterByPosterid(poster_id) {
    let index = this.posters.findIndex(poster => poster.id === poster_id);
    this.posters.splice(index, 1)
  }

  getPosterByPosterid(poster_id) {
    return this.posters.find(poster => poster.id === poster_id);
  }
}

let SingleMyposterEntity = new MyposterEntity();

export default SingleMyposterEntity;
