
class PosterEntity {

  posters = [];
  selected_tags = [];

  constructor() { }

  setSelectedTags(tags) {
    this.selected_tags = [...tags];
  }

  getPosters() {
    let posters = [];
    if (this.selected_tags.length > 0) {
      posters = this.getPostersByTags(this.selected_tags);
    }
    return posters;
  }

  getPostersByTags(tags) {
    if (tags.length === 0) return [];

    return this.posters.filter(
      poster => tags.includes(poster.tag)
    );
  }

  push(posters) {
    console.info("【Poster Entity】 push items: ", this.posters, posters)
    this.posters = this.posters.concat(posters);
    return this.posters;
  }

  unshift(posters) {
    this.posters = posters.concat(this.posters);
    return this.posters;
  }

  removePosterByPosterid(poster_id) {
    let index = this.posters.findIndex(poster => poster.id === poster_id);
    this.posters.splice(index, 1)
  }

  getPosterByPosterid(poster_id) {
    return this.posters.find(poster => {
      poster.id === poster_id;
    });
  }

  shuffle() { }
}

let SinglePosterEntity = new PosterEntity();

export default SinglePosterEntity;
