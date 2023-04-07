import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.js';

const successMsg = message => Notiflix.Notify.success(message);

const warningMsg = message => Notiflix.Notify.warning(message);

const failureMsg = message => Notiflix.Notify.failure(message);

export { successMsg, warningMsg, failureMsg };
