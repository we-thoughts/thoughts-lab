import Storage from './storage';
import Data from './initdata';

let SingleStorage = new Storage();

SingleStorage.init(Data)

export default SingleStorage

let storage = SingleStorage;

export { storage }
