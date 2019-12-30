import PublicRepository from "../public.repository";

class GetChangelogsUsecase {
  constructor() { }
  execute(option) {
    return PublicRepository.getChangelogs(option);
  }
}

let SingleGetChangelogsUsecase = new GetChangelogsUsecase();

export default SingleGetChangelogsUsecase;
