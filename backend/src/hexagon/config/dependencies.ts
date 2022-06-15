import { useCases } from '../useCases';
import { repositories } from '../frameworks/repository/postgre';

export default {
  useCases,
  ...repositories,
};
