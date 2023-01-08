const db = require('../models/contacts.js');

const { newError } = require('../helpers');

async function getContacts(req, res, next) {
  const contacts = await db.listContacts();
  return res.status(200).json(contacts);
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(newError(404, 'Contact not found'));
  }
  return res.status(200).json(contact);
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(newError(404, 'Contact not found'));
  }
  await db.removeContact(contactId);
  return res.status(200).json({ message: 'contact deleted' });
}

async function postContact(req, res, next) {
  const newContact = await db.addContact(req.body);
  return res.status(201).json(newContact);
}

async function putContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(newError(404, 'Contact not found'));
  }
  const updatedContact = await db.updateContact(contactId, req.body);
  return res.status(201).json(updatedContact);
}

module.exports = {
  getContacts,
  getContactById,
  deleteContact,
  postContact,
  putContact,
};
