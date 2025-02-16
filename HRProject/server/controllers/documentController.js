const documentRepo = require("../repositories/documentRepository");

class DocumentController {
  async getAll(req, res) {
    try {
      const documents = await documentRepo.getAll();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async getById(req, res) {
    try {
      const document = await documentRepo.getById(req.params.id);
      if (!document)
        return res.status(404).json({ error: "Document not found" });
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async getByName(req, res) {
    try {
      const document = await documentRepo.getByName(req.params.name);
      if (!document)
        return res.status(404).json({ error: "Document not found" });
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async create(req, res) {
    try {
      const newDocument = await documentRepo.create(req.body);
      res.status(201).json(newDocument);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  async update(req, res) {
    try {
      const updatedDocument = await documentRepo.update(
        req.params.id,
        req.body
      );
      if (!updatedDocument)
        return res.status(404).json({ error: "Document not found" });
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async delete(req, res) {
    try {
      const result = await documentRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: "Document not found" });
      res.json({ message: "Document deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = new DocumentController();
