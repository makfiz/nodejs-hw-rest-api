const express = require('express');

const router = express.Router();

const { validateBody } = require('../../middlewares');
const { tryCatchWrapper } = require('../../helpers');
const controllers = require('../../controllers/contacts.controller');
const {
  addContactSchema,
  putContactSchema,
  updateStatusContactSchema
} = require('../../schemas/contacts');

router.get('/', tryCatchWrapper(controllers.getContacts));

router.get('/:contactId', tryCatchWrapper(controllers.getContactById));

router.post(
  '/',
  validateBody(addContactSchema),
  tryCatchWrapper(controllers.postContact)
);

router.delete('/:contactId', tryCatchWrapper(controllers.deleteContact));

router.put(
  '/:contactId',
  validateBody(putContactSchema),
  tryCatchWrapper(controllers.putContact)
);

router.patch('/:contactId/favorite',validateBody(updateStatusContactSchema), tryCatchWrapper(controllers.updateStatusContact));

module.exports = router;
