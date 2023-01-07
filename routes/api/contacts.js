const express = require('express');

const router = express.Router();
const db = require('../../models/contacts.js');
// const { validateBody } = require('../../middlewares');
const { addContactSchema } = require('../../schemas/contacts');

router.get('/', async (req, res, next) => {
  const contacts = await db.listContacts();
  res.status(200).json(contacts);
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.status(200).json(contact);
});

router.post('/', async (req, res, next) => {
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const newContact = await db.addContact(req.body);
  res.status(201).json(newContact);
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
