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

router.post('/seed', async (req, resp) => {
  try {
    const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    const docs = [];

    for (let dayOfWeek of dias) {
      for (let time of horarios) {
        const capacity = Math.floor(Math.random() * 4) + 1;
        docs.push({ dayOfWeek, time, capacity });
      }
    }

    const inseridos = await Slot.insertMany(docs);

    resp.status(201).json({
      message: 'Slots gerados com sucesso!',
      createdCount: inseridos.length
    });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: 'Erro ao gerar os slots.' });
  }
});

router.get('/', async (req, resp) => {
    try {
        const todosHorarios = await Slot.find({}).lean();

        const todosHorariosAgrupados = todosHorarios.reduce((acc, slot) => {
            if (!acc[slot.dayOfWeek]) {
                acc[slot.dayOfWeek] = [];
            }

            acc[slot.dayOfWeek].push({id:slot._id, time: slot.time, capacity: slot.capacity });
            return acc;
        }, {});

        resp.status(200).json(todosHorariosAgrupados);
        
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: "Erro ao buscar slots" });
    }
});

module.exports = router;