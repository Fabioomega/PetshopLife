const path = require("path");
const express = require("express");
const Slot = require('../model/slot');

const router = express.Router();

router.post('/', async (req, resp) => {
    
    try {
        const { dayOfWeek, time, capacity } = req.body;
        const campos = ['dayOfWeek', 'time', 'capacity'];
        const camposObrigatorios = [];

        for (let campo of campos) {
            if (!req.body[campo]) {
                camposObrigatorios.push(campo);
            }
        }
        if (camposObrigatorios.length > 0) {
            resp.status(400).json({ error: 'Existem campos obrigatórios não preenchidos.', camposObrigatorios });
            return;
        }

        const newSlot = new Slot({ dayOfWeek, time, capacity });
        await newSlot.save();

        resp.status(201).json({ message: 'Slot criado com sucesso!', slot: newSlot });
    }

    catch (error) {
        resp.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
});

router.delete("/", async (req, res) => {
  try {
    const resultado = await Slot.deleteMany({});
    res.status(200).json({
      message: "Todos os slots foram deletados com sucesso",
      deletedCount: resultado.deletedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar os slots" });
  }
});

module.exports = router;