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

/**
 * @openapi
 * /slots:
 *   post:
 *     tags: [Slots]
 *     summary: Cria um novo slot de atendimento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dayOfWeek, time, capacity]
 *             properties:
 *               dayOfWeek:
 *                 type: string
 *                 example: Monday
 *               time:
 *                 type: string
 *                 example: "18:00"
 *               capacity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Slot criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Slot criado com sucesso!
 *                 slot:
 *                   $ref: '#/components/schemas/Slot'
 *       400:
 *         description: Campos obrigatórios não preenchidos
 *       500:
 *         description: Erro ao processar a solicitação
 */

/**
 * @openapi
 * /slots:
 *   delete:
 *     tags: [Slots]
 *     summary: Deleta todos os slots
 *     responses:
 *       200:
 *         description: Remoção concluída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       500:
 *         description: Erro ao deletar os slots
 */

/**
 * @openapi
 * /slots/seed:
 *   post:
 *     tags: [Slots]
 *     summary: Gera slots automaticamente (segunda a sexta; 08–11 e 14–17) com capacidade aleatória 1..4
 *     responses:
 *       201:
 *         description: Slots gerados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       500:
 *         description: Erro ao gerar os slots
 */

/**
 * @openapi
 * /slots/{dayOfWeek}:
 *   get:
 *     tags: [Slots]
 *     summary: Lista os slots de um dia específico
 *     parameters:
 *       - name: dayOfWeek
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: Monday
 *     responses:
 *       200:
 *         description: Array de slots do dia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slot'
 *       500:
 *         description: Erro ao buscar slots
 */

/**
 * @openapi
 * /slots:
 *   get:
 *     tags: [Slots]
 *     summary: Lista todos os slots agrupados por dia da semana
 *     responses:
 *       200:
 *         description: Objeto com chaves por dia (Monday..Friday) e arrays de horários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotGrouped'
 *       500:
 *         description: Erro ao buscar slots
 */

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

router.get('/:dayOfWeek', async (req, resp) => {
    try {
        const dayOfWeek = req.params.dayOfWeek;
        const horariosDoDia = await Slot.find({ dayOfWeek: dayOfWeek }).lean();

        if (horariosDoDia.length === 0) {
            resp.status(404).json({ error: 'Nenhum slot encontrado para o dia especificado.' });
            return;
        }

        resp.status(200).json(horariosDoDia);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Erro ao buscar os slots.' });
    }
});

module.exports = router;