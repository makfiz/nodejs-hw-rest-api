const express = require('express');

const router = express.Router();

const { validateBody, auth } = require('../../middlewares');
const { tryCatchWrapper } = require('../../helpers');
const controllers = require('../../controllers/contacts.controller');
const {
  addContactSchema,
  putContactSchema,
  updateStatusContactSchema
} = require('../../schemas/contacts');

router.get('/', tryCatchWrapper(auth), tryCatchWrapper(controllers.getContacts));

router.get('/:contactId', tryCatchWrapper(auth), tryCatchWrapper(controllers.getContactById));

router.post(
  '/',tryCatchWrapper(auth),
  validateBody(addContactSchema),
  tryCatchWrapper(controllers.postContact)
);

router.delete('/:contactId',tryCatchWrapper(auth),tryCatchWrapper(controllers.deleteContact));

router.put(
  '/:contactId',tryCatchWrapper(auth),
  validateBody(putContactSchema),
  tryCatchWrapper(controllers.putContact)
);

router.patch('/:contactId/favorite',tryCatchWrapper(auth), validateBody(updateStatusContactSchema), tryCatchWrapper(controllers.updateStatusContact));

module.exports = router;
