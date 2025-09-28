const path = require("path");
const express = require("express");

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Petshop API', version: '1.0.0' },
    components: {
      schemas: {
        Slot: {
          type: 'object',
          properties: {
            _id:        { type: 'string',  example: '68d3583129e3bd1bc7a1d1bf' },
            dayOfWeek:  { type: 'string',  example: 'Monday' },
            time:       { type: 'string',  example: '18:00' },
            capacity:   { type: 'integer', example: 3 },
            __v:        { type: 'integer', example: 0 }
          }
        },

        SlotGrouped: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id:       { type: 'string',  example: '68d439d65abd64a7e965170c' },
                time:     { type: 'string',  example: '08:00' },
                capacity: { type: 'integer', example: 2 }
              }
            }
          }
        },

        DeleteResponse: {
          type: 'object',
          properties: {
            message:      { type: 'string',  example: 'Todos os slots foram deletados com sucesso' },
            deletedCount: { type: 'integer', example: 0 }
          }
        },

        SeedResponse: {
          type: 'object',
          properties: {
            message:      { type: 'string',  example: 'Slots gerados com sucesso!' },
            createdCount: { type: 'integer', example: 40 }
          }
        },

        Booking: {
          type: 'object',
          properties: {
            _id:          { type: 'string',  example: '68d4404d04d2aa1f099f109b' },
            slotId:       { type: 'string',  example: '68d439d65abd64a7e965170d' },
            userId:       { type: 'string',  example: '68d436af5abd64a7e9651705' },
            costumerName: { type: 'string',  example: 'FABIO' },
            createdAt:    { type: 'string',  format: 'date-time', example: '2025-09-24T19:02:37.575Z' },
            __v:          { type: 'integer', example: 0 }
          }
        },

        BookingHistory: {
          type: 'object',
          properties: {
            dayOfWeek:    { type: 'string',  example: 'Monday' },
            time:         { type: 'string',  example: '09:00' },
            costumerName: { type: 'string',  example: 'FABIO' },
            createdAt:    { type: 'string',  format: 'date-time', example: '2025-09-24T19:02:37.575Z' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/**/*.js'] // ajuste o caminho se necessário
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// midlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const usersRouter = require('./src/routes/users.routes');
const slotsRouter = require('./src/routes/slots.routes');
const bookingsRouter = require('./src/routes/bookings.routes');

app.use("/users", usersRouter);
app.use("/slots", slotsRouter);
app.use("/bookings", bookingsRouter);

// rota inicial
app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/public/html/user_selection.html');
});

// rota usuario
app.get('/booking', (req, resp) => {
    resp.sendFile(__dirname + '/public/html/booking.html');
});

// rota petshop
app.get('/petshop', (req, resp) => {
    resp.sendFile(__dirname + '/public/html/petshop.html');
});

app.listen(8080, function () {
    console.log("Servidor rodando na porta 8080...");
});
