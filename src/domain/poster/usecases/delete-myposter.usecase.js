import { map } from "rxjs/operators";
import PosterRepository from "../poster.repository";

class DeleteMyposterUsecase {
  constructor() { }
  extractPicids(pictures) {
    let pic_ids = [];
    pictures.forEach(pic => {
      pic_ids.push(pic.id)
    })
    return pic_ids;
  }
  execute(poster, option) {
    let { id, pictures } = poster;
    let pic_ids = this.extractPicids(pictures);
    return PosterRepository.deleteFiles(pic_ids).pipe(
      map(() => PosterRepository.deletePosterByPosterid(id, option))
    );
  }
}

let SingleDeleteMyposterUsecase = new DeleteMyposterUsecase();

export default SingleDeleteMyposterUsecase;
