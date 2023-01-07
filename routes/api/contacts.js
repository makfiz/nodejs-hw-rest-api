const express = require('express');

const router = express.Router();
const db = require('../../models/contacts.js');

router.get('/', async (req, res, next) => {
  const contacts = await db.listContacts();
  res.status(200).json(contacts);
});

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
