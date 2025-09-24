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

/**
 * @openapi
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Cria uma reserva (booking) para um usuário em um slot específico
 *     description: Normaliza o campo time para HH:mm; decrementa capacity do slot se houver disponibilidade.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, dayOfWeek, time]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 68d436af5abd64a7e9651705
 *               dayOfWeek:
 *                 type: string
 *                 example: Monday
 *               time:
 *                 type: string
 *                 example: "9:00"
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva criada com sucesso!
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Erro de validação (campos faltando) ou slot sem capacidade
 *       404:
 *         description: Usuário ou slot não encontrado
 *       500:
 *         description: Erro ao processar a solicitação
 */

/**
 * @openapi
 * /bookings/{userId}:
 *   get:
 *     tags: [Bookings]
 *     summary: Retorna o histórico de agendamentos de um cliente
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 68d436af5abd64a7e9651705
 *     responses:
 *       200:
 *         description: Lista de agendamentos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingHistory'
 *       404:
 *         description: Cliente sem histórico (opcional, dependendo da sua implementação)
 *       500:
 *         description: Erro ao buscar histórico
 */


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