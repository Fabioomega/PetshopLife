const path = require("path");
const express = require("express");

const router = express.Router();

const Booking = require('../model/booking');
const Slot = require('../model/slot');
const User = require('../model/user');

const normalizeTime = (t) => {
  const [h, m] = String(t).split(":");
  return `${String(h).padStart(2, "0")}:${String(m || "00").padStart(2, "0")}`;
};


router.post('/', async (req, resp) => {
    try {
        const { userId, dayOfWeek } = req.body;
        const time = normalizeTime(req.body.time);
        const campos = ['userId', 'dayOfWeek', 'time'];
        
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

        const user = await User.findById(userId);
        if (!user) {
            resp.status(404).json({ error: 'Usuário não encontrado.' });
            return;
        }

        const slot = await Slot.findOne({ dayOfWeek, time });
        if (!slot) {
            resp.status(404).json({ error: 'Reserva não encontrada para o dia e hora especificados.' });
            return;
        }

        if (slot.capacity <= 0) {
            resp.status(400).json({ error: 'Não há profissionais disponíveis para este horário.' });
            return;
        }

        const novaReserva = new Booking({
            slotId: slot._id,
            userId: user._id,
            costumerName: user.username,
            createdAt: new Date()
        });
        await novaReserva.save();

        slot.capacity -= 1;
        await slot.save();

        resp.status(201).json({ message: 'Reserva criada com sucesso!', booking: novaReserva });

    } catch (error) {
        resp.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
});

router.get('/:userId', async (req, resp) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId);
        if (!user) {
            resp.status(404).json({ error: 'Usuário não encontrado.' });
            return;
        }

        const bookings = await Booking.find({ userId: userId }).populate('slotId', 'dayOfWeek time -_id').sort({ createdAt: -1 });

        const resultado = bookings.map(booking => ({
            dayOfWeek: booking.slotId.dayOfWeek,
            time: booking.slotId.time,
            costumerName: booking.costumerName,
            createdAt: booking.createdAt
        }));

        resp.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Erro ao buscar as reservas.' });
    }
});

module.exports = router;